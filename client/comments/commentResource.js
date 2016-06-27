(function (angular) {
	angular.module('comment.resource', ['ngResource'])
	.factory('Comment', function ($resource) {
		var Comment = $resource('/api/comments/:proj_id/:task_id/:comm_id', 
			{proj_id:'@proj_id', task_id:'@task_id', comm_id:'@comm_id'},
			{
				editComment:{method:'PUT'}
			}
		);
		return Comment;
	});
}(angular));