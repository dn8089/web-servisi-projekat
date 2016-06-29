(function (angular) {
	angular.module('report.resource', ['ngResource'])
	.factory('Report', function($resource) {
		var Report = $resource('/api/reports/:proj_id/:type',
			{proj_id:'@proj_id', type:'@type'}
		);
		return Report;
	});
}(angular));