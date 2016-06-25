(function(angular) {
	var app = angular.module("app", ['user', 'project', 'task', 'ui.router']);
	
	app.config(config).run(run);
	
	function config ($stateProvider, $urlRouterProvider) {
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
		.state('editTask', {
			url: '/projects/:id/:task_id/editTask',
			templateUrl: 'tasks/createTask.html',
			controller: 'editTaskCtrl'
		})
		.state('task', {
			url: '/projects/:id/:task_id',
			templateUrl: 'tasks/task.html',
			controller: 'taskCtrl'
		})
		.state('registration', {
			url: '/registration',
			templateUrl: 'users/createUser.html',
			controller: 'createUserCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'users/login.html',
			controller: 'loginCtrl'
		});
	};
	
	function run ($rootScope, $http, $location, $localStorage, AuthenticationService, $state) {
		// postavljanje tokena nakon refresh
		if ($localStorage.currentUser) {
				$http.defaults.headers.common.Authorization = $localStorage.currentUser.token;
		}
		
		// ukoliko pokušamo da odemo na stranicu za koju nemamo prava, redirektujemo se na login
		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			// lista javnih stanja
			/*var publicStates = ['login', 'registration', 'main', 'project', ''];
			var restrictedState = publicStates.indexOf(toState.name) === -1;
			if(restrictedState && !AuthenticationService.getCurrentUser()){
				$state.go('login');
			} else if (restrictedState) {
				$state.go('main');
			}*/
		});
		
		$rootScope.logout = function () {
			AuthenticationService.logout();
		}
		
		$rootScope.getCurrentUserRole = function () {
			if (!AuthenticationService.getCurrentUser()){
				return undefined;
			}
			else{
				return AuthenticationService.getCurrentUser().role;
			}
		}
		
		$rootScope.isLoggedIn = function () {
			if (AuthenticationService.getCurrentUser()){
				return true;
			}
			else{
				return false;
			}
		}
		
		$rootScope.getCurrentState = function () {
			return $state.current.name;
		}
	};

})(angular);
