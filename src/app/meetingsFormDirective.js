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
                    onSubmit: '&',
                    onCancel: '&',
                    meeting: '='
                }
            };
        });

function meetingsFormController(MeetingsService, PeopleService, Restangular, Notification, $rootScope) {
    var vm = this;
    vm.submit = submit;
    vm.getPlatforms = getPlatforms;
    vm.getPeople = getPeople;
    vm.addParticipant = addParticipant;
    vm.closePopover = closePopover;
    vm.submitPerson = submitPerson;
    vm.removeParticipant = removeParticipant;
    vm.creationMode = false;
    vm.getInstitutes = getInstitutes;
    vm.cancel = cancel;
    
    activate();

    function activate() {
        reset();
    }

    function callOnSubmitCallback() {
        if (_.isFunction(vm.onSubmit()))
            vm.onSubmit()();
    }

    function callOnCancelCallback() {
        if (_.isFunction(vm.onCancel()))
            vm.onCancel()();
    }
    
    function setupComponents() {
        vm.popover = {
            'popover-is-open': false
        };
        vm.newPerson = PeopleService.getNewPerson();
        if (!vm.meeting) {
            vm.creationMode = true;
        }
    }

    function reset() {
        setupComponents();
        if (vm.creationMode)
            vm.meeting = MeetingsService.getNewMeeting();
        vm.newParticipant = '';
    }
    
    function getInstitutes(q) {
        return Restangular.all('institutes').getList({q: q});
    }
    
    function cancel() {
        callOnCancelCallback();
    }

    function submit() {
        if (vm.creationMode)
            return MeetingsService.post(vm.meeting)
                    .then(function () {
                        Notification.success('Meeting created');
                        reset();
                        callOnSubmitCallback();
                        $rootScope.$broadcast("meeting.created");
                    });
        else
            return vm.meeting.put()
                    .then(function () {
                        Notification.success('Meeting updated');
                        callOnSubmitCallback();
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
    
    function addParticipant(participant) {
        vm.meeting.participants.push(participant);
        vm.newParticipant = '';
    }

    function closePopover() {
        vm.popover["popover-is-open"] = false;
    }

    function removeParticipant(participant) {
        _.remove(vm.meeting.participants, participant);
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