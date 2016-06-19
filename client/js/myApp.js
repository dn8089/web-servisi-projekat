(function(angular) {

	var usersController = function ($scope, $resource) {
		var User = $resource('/api/users/');
		$scope.users = User.query();
	};
	
	var projectsController = function ($scope, $resource) {
		var Project = $resource('/api/projects/');
		Project.query(function (projects) {
			$scope.projects = projects;
		});
	};
	
	var projectController = function ($scope, $resource, $stateParams) {
		var Project = $resource('/api/projects/:_id',
			{_id:'@_id'},
			{update:{method:'PUT', params: {proj_id:'@proj_id', user_id: '@user_id'}, url: '/api/projects/:proj_id/removeUser/:user_id'}}
		);
		var projectId = $stateParams.id;
		var loadProject = function() {
			Project.get({_id:projectId}, function (project) {
				$scope.project = project;
			});
		};
		loadProject();
		
		$scope.removeUser = function (user_id) {
			$scope.project.$update({proj_id:projectId, user_id:user_id}, loadProject);
		};
		
		$scope.deleteTask = function (task_id) {
			
		};
	};
	
	
	var createProjectController = function ($scope, $resource, $location) {
		var Project = $resource('/api/projects/');
		$scope.project = new Project();
		
		$scope.save = function () {
			$scope.project.$save();
			$scope.project = new Project();
			$location.path('/main');
		};
	};
	
	var addUserController = function ($scope, $resource, $stateParams, $location) {
		var User = $resource('/api/users/');
		var Project = $resource('/api/projects/:_id',
			{_id:'@_id'},
			{update:{method:'PUT', params: {proj_id:'@proj_id', user_id: '@user_id'}, url: '/api/projects/:proj_id/addUser/:user_id'}}
		);
		var projectId = $stateParams.id;
		var project;
		$scope.selected = {};	
		var users = [];
		
		User.query(function (allUsers) {
			Project.get({_id:projectId}, function(data){
				project = data;
				allUsers.forEach( function (value) {
					var found = false;
					if (project.team) {
						project.team.forEach(function (user) {
							if (value._id === user._id) {
								found = true;
							}
						});
					 
						if (!found) {
							users.push(value);
						}
					}
				});
			});
		});
		$scope.users = users;
				
		$scope.addUser = function () {
      angular.forEach($scope.selected, function( value, key) {
				project.$update({proj_id:projectId, user_id:key});
      });
			
			$location.path('/projects/'+projectId);
		};
	};
	
	var createTaskController = function ($scope, $resource, $stateParams, $location) {
		var Project = $resource('/api/projects/:_id',
			{_id:'@_id'}
		);
		var Task = $resource('/api/projects/:proj_id/task',
			{proj_id:'@proj_id'}
		);
		var projectId = $stateParams.id;
		$scope.project = Project.get({_id:projectId});
		$scope.task = new Task();
		$scope.task.task_status = 'To Do';
		$scope.task.task_priority = 'Trivial';
		
		$scope.saveTask = function () {
			$scope.task.task_label = $scope.project.label + "-" + ($scope.project.tasks.length+1);
			$scope.task.author = '57448af901fc915018dc781c';
			$scope.task.$save({proj_id:projectId});
			$location.path('/projects/'+projectId);
		};
	};
	
	var createUserController = function ($scope, $resource, $location) {
		var User = $resource('/api/users');
		$scope.user = new User();
		
		$scope.createUser = function () {
			$scope.user.admin = false;
			$scope.user.$save( function () {}, function (err) {console.log(err)});
			$scope.user = new User();
			$location.path('/login');
		};
	};
	
	var loginController = function ($scope, $resource, $location) {
		
	};

	var app = angular.module("app", ['ui.router','ngResource']);
	app.controller("usersCtrl", usersController);
	app.controller("projectsCtrl", projectsController);
	app.controller("projectCtrl", projectController);
	app.controller("createProjectCtrl", createProjectController);
	app.controller("addUserCtrl", addUserController);
	app.controller("createTaskCtrl", createTaskController);
	app.controller("createUserCtrl", createUserController);
	app.controller("loginCtrl", loginController);
	
	app.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/main');
    $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: 'projects.html',
      controller: 'projectsCtrl'
    })
		.state('project', {
      url: '/projects/:id',
      templateUrl: 'project.html',
			controller: 'projectCtrl'
    })
		.state('createProject', {
			url: '/createProject',
			templateUrl: 'createProject.html',
			controller: 'createProjectCtrl'
		})
		.state('usersList', {
			url: '/projects/:id/users',
			templateUrl: 'users.html',
			controller: 'addUserCtrl'
		})
		.state('createTask', {
			url: '/projects/:id/createTask',
			templateUrl: 'createTask.html',
			controller: 'createTaskCtrl'
		})
		.state('createUser', {
			url: '/registration',
			templateUrl: 'createUser.html',
			controller: 'createUserCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'login.html',
			controller: 'loginCtrl'
		});
	});

})(angular);
