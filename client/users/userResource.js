(function (angular) {
	angular.module('user.resource', ['ngResource'])
	.factory('User', function($resource) {
		var User = $resource('/api/users/');
		return User;
	});
}(angular));