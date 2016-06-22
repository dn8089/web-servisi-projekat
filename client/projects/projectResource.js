(function (angular) {
	angular.module('project.resource', ['ngResource'])
	.factory('Project', function($resource) {
		var Project = $resource('/api/projects/:_id',
			{_id:'@_id'},
			{
				addUser:{method:'PUT', params: {proj_id:'@proj_id', user_id: '@user_id'}, url: '/api/projects/:proj_id/addUser/:user_id'},
				removeUser:{method:'PUT', params: {proj_id:'@proj_id', user_id: '@user_id'}, url: '/api/projects/:proj_id/removeUser/:user_id'}				
			}
		);
		return Project;
	});
}(angular));