(function (angular) {
	angular.module('project', ['project.resource', 'user.resource', 'task.resource', 'authentication'])
	.controller('projectsCtrl', function ($scope, Project, AuthenticationService) {
		var currentUser = AuthenticationService.getCurrentUser();
		
		if (currentUser.role&&currentUser.role=='admin') {
			Project.query(function (projects) {
				$scope.projects = projects;
			});
		} else {
			Project.query({id: currentUser.user_id}, function (projects) {
				$scope.projects = projects;
			});
		}
	})
	.controller('projectCtrl', function ($scope, Project, Task, $stateParams) {
		var projectId = $stateParams.id;
		var loadProject = function() {
			Project.get({_id:projectId}, function (project) {
				$scope.project = project;
			});
		};
		loadProject();
		
		$scope.removeUser = function (user_id) {
			$scope.project.$removeUser({proj_id:projectId, user_id:user_id}, loadProject);
		};
		
		$scope.deleteTask = function (project_id, task_id) {
			Task.delete({proj_id:project_id, task_id:task_id}, loadProject);
		};
	})
	.controller('createProjectCtrl', function ($scope, Project, $location) {
		$scope.project = new Project();
		
		$scope.save = function () {
			$scope.project.$save();
			$scope.project = new Project();
			$location.path('/main');
		};
	})
	.controller('addUserCtrl', function ($scope, Project, User, $stateParams, $location) {
		var projectId = $stateParams.id;
		var project;
		$scope.selected = {};
		
		User.query(function (allUsers) {
			Project.get({_id:projectId}, function(data){
				project = data;
				$scope.users = getUsers(allUsers, project.team);
			});
		});
				
		$scope.addUser = function () {
      angular.forEach($scope.selected, function( value, key) {
				project.$addUser({proj_id:projectId, user_id:key});
      });
			
			$location.path('/projects/'+projectId);
		};
	});
	
	var getUsers = function (allUsers, team) {
		var users = [];
		allUsers.forEach( function (value) {
			var found = false;
			team.forEach(function (user) {
				if (value._id === user._id) {
					found = true;
				}
			});
		 
			if (!found) {
				users.push(value);
			}
		});
		return users;
	}
}(angular));