(function (angular) {
	angular.module('task.resource', ['ngResource'])
	.factory('Task', function ($resource) {
		var Task = $resource('/api/projects/:proj_id/task', 
			{proj_id:'@proj_id'}
		);
		return Task;
	});
}(angular));