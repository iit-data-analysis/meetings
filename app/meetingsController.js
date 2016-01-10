(function () {
    angular
            .module('meetings')
            .controller('meetingsController', meetingsController);

    function meetingsController(MeetingsService, PeopleService, Restangular, $scope) {
        var vm = this;
        vm.formatDate = formatDate;

        activate();

        function activate() {
            reset();
        }

        function reset() {
            getMeetings();
        }

        function getMeetings() {
            return MeetingsService.getList()
                    .then(function (meetings) {
                        vm.meetings = meetings;
                        return vm.meetings;
                    });
        }

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
})();