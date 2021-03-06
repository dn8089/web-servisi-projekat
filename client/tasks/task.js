(function (angular) {
	angular.module('task', ['task.resource', 'project.resource', 'comment.resource', 'authentication'])
	.controller('taskCtrl', function ($scope, Task, Comment, $stateParams, AuthenticationService) {
		var projectId = $stateParams.id;
		var taskId = $stateParams.task_id;
		$scope.projectId = projectId;
		
		var loadTask = function () {
			Task.get({proj_id:projectId, task_id:taskId}, function (task) {
				$scope.task = task;
			});
			
			$scope.showChanges = false;
			$scope.showComments = true;
			$scope.comment = new Comment();
		};
		loadTask();
		
		$scope.saveComment = function () {
			var commId = $scope.comment._id;
			if (!commId) {
				$scope.comment.signedBy = AuthenticationService.getCurrentUser().user_id;
				$scope.comment.$save({task_id:taskId}, loadTask);
			} else {
				$scope.comment.$editComment({proj_id:projectId, task_id:taskId, comm_id:commId}, loadTask);
			}
		};
		
		$scope.deleteComment = function (commId) {
			Comment.delete({proj_id:projectId, task_id:taskId, comm_id:commId}, loadTask);
		};
		
		$scope.editComment = function (commId) {
			Comment.get({proj_id:projectId, task_id:taskId, comm_id:commId}, function (comment) {
				$scope.comment = comment;
			})
		};
		
		$scope.showChangesFunc = function () {
			$scope.showChanges = !$scope.showChanges;
		};
		
		$scope.showCommentsFunc = function () {
			$scope.showComments = !$scope.showComments;
		};
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
			if (task.assignedTo) {
				$scope.task.assignedTo = task.assignedTo._id;
			}
		});
 
		$scope.saveTask = function () {
			$scope.task.$save({proj_id:projectId, task_id:taskId}, function () {
				$location.path('/projects/' + projectId + '/' + taskId);
			});
		};
	})
	.controller('userTasksCtrl', function($scope, Task, AuthenticationService) {
		var currentUser = AuthenticationService.getCurrentUser();
		
		var loadTasks = function () {
			Task.query({id: currentUser.user_id}, function (tasks) {
				$scope.project = {};
				$scope.project.tasks = tasks;
			});
			
			$scope.orderBy = 'task_label';
			$scope.showTasks = true;
			$scope.filter = {};
		}
		loadTasks();
		
		$scope.filterFunc = function () {
			if (!$scope.filter.status&&!$scope.filter.priority) {
				loadTasks();
			} else {
				Task.query({id: currentUser.user_id, status: $scope.filter.status, priority: $scope.filter.priority}, function (tasks) {
					$scope.project = {};
					$scope.project.tasks = tasks;
				});
			}
		}
		
		$scope.deleteTask = function (project_id, task_id) {
			Task.delete({proj_id:project_id, task_id:task_id}, loadTasks);
		};
	});
}(angular));