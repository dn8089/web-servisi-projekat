(function (angular) {
	angular.module('report', ['report.resource', 'project.resource'])
	.controller('reportsCtrl', function ($scope, Report, Project) {
		Project.query(function (projects) {
			$scope.projects = projects;
			$scope.reportOpt = {};
			$scope.reportOpt.reportType = 'reportOne';
			$scope.reportOpt.projectId = projects[0]._id;
		});
	
		$scope.reportFunc = function () {
			var projectId = $scope.reportOpt.projectId;
			var type = $scope.reportOpt.reportType;
			Report.get({proj_id:projectId, type:type}, function (report) {
				$scope.report = {};
				$scope.report.labels = report.labels;
				$scope.report.data = report.data;
				$scope.report.tasksNum = report.tasksNum;
				
				if ($scope.reportOpt.reportType === 'reportOne') {
					$scope.report.title = 'Zadaci dodeljeni korisnicima';
				} else if ($scope.reportOpt.reportType === 'reportTwo') {
					$scope.report.title = 'Završeni zadaci';
				} /*else if ($scope.reportOpt.reportType === 'reportThree') {
					$scope.report.title = 'Dinamika kreiranja zadataka na projektu';
				} else if ($scope.reportOpt.reportType === 'reportFour') {
					$scope.report.title = 'Dinamika završavanja zadataka na projektu';
				} else if ($scope.reportOpt.reportType === 'reportFive') {
					$scope.report.title = 'Aktivnost korisnika na projektu';
				}*/
			});
		};
	});
}(angular));