(function(angular) {
	
	var loginController = function ($scope, $resource, $location) {
		
	};

	var app = angular.module("app", ['user', 'project', 'task', 'ui.router']);
	app.controller("loginCtrl", loginController);
	
	app.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/main');
    $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: 'projects/projects.html',
      controller: 'projectsCtrl'
    })
		.state('project', {
      url: '/projects/:id',
      templateUrl: 'projects/project.html',
			controller: 'projectCtrl'
    })
		.state('createProject', {
			url: '/createProject',
			templateUrl: 'projects/createProject.html',
			controller: 'createProjectCtrl'
		})
		.state('addUsers', {
			url: '/projects/:id/addUsers',
			templateUrl: 'projects/addUsers.html',
			controller: 'addUserCtrl'
		})
		.state('createTask', {
			url: '/projects/:id/createTask',
			templateUrl: 'tasks/createTask.html',
			controller: 'createTaskCtrl'
		})
		.state('createUser', {
			url: '/registration',
			templateUrl: 'users/createUser.html',
			controller: 'createUserCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'users/login.html',
			controller: 'loginCtrl'
		});
	});

})(angular);
