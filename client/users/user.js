(function (angular) {
	angular.module('user', ['user.resource', 'authentication'])
	.controller('createUserCtrl', function ($scope, User, $location) {
		$scope.user = new User();
		
		$scope.createUser = function () {
			$scope.user.$save();
			$scope.user = new User();
			$location.path('/login');
		};
	})
	.controller('loginCtrl', function ($scope, $log, AuthenticationService) {
		$scope.user = {};
		$scope.failure = false;
		$scope.login = function () {
			AuthenticationService.login($scope.user.email, $scope.user.password, loginCbck);
		};
		
		function loginCbck(success) {
			if (success) {
				$log.info('success!');
			}
			else{
				$log.info('failure!');
				$scope.failure = true;
			}
		}
	});
}(angular));