(function () {
    angular
            .module('meetings')
            .controller('meetingsController', meetingsController);

    function meetingsController(MeetingsService, PeopleService, Restangular, $scope) {
        var vm = this;

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
    }
})();