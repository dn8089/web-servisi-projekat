(function (angular) {
	angular.module('task', ['task.resource', 'project.resource'])
	.controller('createTaskCtrl', function ($scope, Project, Task, $resource, $stateParams, $location) {
		var projectId = $stateParams.id;
		
		Project.get({_id:projectId}, function (project) {
			$scope.project = project;
		});
		$scope.task = new Task();
		$scope.task.task_status = 'To Do';
		$scope.task.task_priority = 'Trivial';
		
		$scope.saveTask = function () {
			$scope.task.task_label = $scope.project.label + "-" + ($scope.project.tasks.length+1);
			$scope.task.author = '57448af901fc915018dc781c';
			$scope.task.$save({proj_id:projectId});
			$location.path('/projects/'+projectId);
		};
	});
}(angular));