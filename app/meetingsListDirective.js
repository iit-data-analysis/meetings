angular.module('meetings')
        .directive('iitMeetingsList', function () {
            return {
                templateUrl: 'meetingsList.html',
                restrict: 'E',
                controller: meetingsListController,
                controllerAs: 'vm',
                scope: {
                },
                bindToController: {
                    meetings: '='
                }
            };
        });

function meetingsListController($scope) {
    var vm = this;
    vm.formatDate = formatDate;

    function formatDate(date) {
        var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
}