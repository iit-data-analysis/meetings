(function () {
    angular
            .module('meetings')
            .controller('homeController', homeController);

    function homeController(MeetingsService, PeopleService, Restangular, $scope) {
        var vm = this;
        vm.submit = submit;
        vm.getPlatforms = getPlatforms;
        vm.getPeople = getPeople;
        vm.openDatePicker = openDatePicker;
        vm.addParticipant = addParticipant;
        vm.closePopover = closePopover;
        vm.submitPerson = submitPerson;
        vm.removeParticipant = removeParticipant;

        activate();

        function activate() {
            reset();
        }

        function reset() {
            vm.popup1 = {
                opened: false
            };
            vm.popover = {
                'popover-is-open': false
            };
            vm.newMeeting = MeetingsService.getNewMeeting();
            vm.newPerson = PeopleService.getNewPerson();
            getMeetings();
        }

        function getMeetings() {
            return MeetingsService.getList({limit: 5})
                    .then(function (meetings) {
                        vm.meetings = meetings;
                        return vm.meetings;
                    });
        }

        function submit() {
            return MeetingsService.post(vm.newMeeting)
                    .then(function () {
                        reset();
                        return getMeetings();
                    });
        }

        function submitPerson() {
            PeopleService.post(vm.newPerson)
                    .then(function (person) {
                        addParticipant(person);
                        vm.newPerson = PeopleService.getNewPerson();
                        closePopover();
                    });
        }

        function getPlatforms(q) {
            return Restangular.all('platforms').getList({q: q});
        }

        function getPeople(q) {
            return PeopleService.getList({q: q});
        }

        function openDatePicker() {
            vm.popup1.opened = true;
        }

        function addParticipant(participant) {
            vm.newMeeting.participants.push(participant);
            vm.newParticipant = '';
        }

        function closePopover() {
            vm.popover["popover-is-open"] = false;
        }
        
        function removeParticipant(participant) {
            _.remove(vm.newMeeting.participants, participant);
        }

    }
})();