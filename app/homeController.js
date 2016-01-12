(function () {
    angular
            .module('meetings')
            .controller('homeController', homeController);

    function homeController(MeetingsService) {
        var vm = this;
        vm.reset = reset;

        activate();

        function activate() {
            reset();
        }

        function reset() {
            getMeetings();
        }

        function getMeetings() {
            return MeetingsService.getList({limit: 5})
                    .then(function (meetings) {
                        vm.meetings = meetings;
                        return vm.meetings;
                    });
        }
    }
})();