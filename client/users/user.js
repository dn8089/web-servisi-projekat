(function (angular) {
	angular.module('user', ['user.resource'])
	.controller('createUserCtrl', function ($scope, User, $location) {
		$scope.user = new User();
		
		$scope.createUser = function () {
			$scope.user.admin = false;
			$scope.user.$save();
			$scope.user = new User();
			$location.path('/login');
		};
	});
}(angular));