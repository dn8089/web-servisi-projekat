(function (angular) {
	angular.module('task', ['task.resource', 'project.resource', 'authentication'])
	.controller('taskCtrl', function ($scope, Task, $stateParams) {
		var projectId = $stateParams.id;
		var taskId = $stateParams.task_id;
		Task.get({proj_id:projectId, task_id:taskId}, function (task) {
			$scope.task = task;
		});
	})
	.controller('createTaskCtrl', function ($scope, Project, Task, $stateParams, $location, AuthenticationService) {
		var projectId = $stateParams.id;
		
		Project.get({_id:projectId}, function (project) {
			$scope.project = project;
		});
		$scope.task = new Task();
		$scope.task.task_status = 'To Do';
		$scope.task.task_priority = 'Trivial';
		
		$scope.saveTask = function () {
			$scope.task.task_label = $scope.project.label + "-" + ($scope.project.tasks.length+1);
			$scope.task.author = AuthenticationService.getCurrentUser().user_id;
			$scope.task.$save({proj_id:projectId});
			$location.path('/projects/'+projectId);
		};
	})
	.controller('editTaskCtrl', function ($scope, Project, Task, $stateParams, $location) {
		var projectId = $stateParams.id;
		var taskId = $stateParams.task_id;
		Project.get({_id:projectId}, function (project) {
			$scope.project = project;
		});
		
		Task.get({proj_id:projectId, task_id:taskId}, function (task) {
			$scope.task = task;
		});
 
		$scope.saveTask = function () {
			$scope.task.$save({proj_id:projectId, task_id:taskId}, function () {
				$location.path('/projects/'+projectId)
			});
		};
	});
}(angular));