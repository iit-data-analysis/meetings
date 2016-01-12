angular.module('meetings')
        .directive('iitMeetingsForm', function () {
            return {
                templateUrl: 'meetingsForm.html',
                restrict: 'E',
                controller: meetingsFormController,
                controllerAs: 'vm',
                scope: {
                },
                bindToController: {
                    onSubmit: '&'
                }
            };
        });

function meetingsFormController(MeetingsService, PeopleService, Restangular) {
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
        vm.onSubmit()();
    }

    function submit() {
        return MeetingsService.post(vm.newMeeting)
                .then(function () {
                    reset();
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

angular.module('meetings').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, meeting) {
    var vm = this;
    vm.meeting = meeting;

    vm.proceed = function (meeting) {
        $uibModalInstance.close(meeting);
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss();
    };
});