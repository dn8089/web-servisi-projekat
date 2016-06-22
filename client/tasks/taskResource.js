(function (angular) {
	angular.module('task.resource', ['ngResource'])
	.factory('Task', function ($resource) {
		var Task = $resource('/api/tasks/:proj_id', 
			{proj_id:'@proj_id'}
		);
		return Task;
	});
}(angular));