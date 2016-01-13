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
                    meetings: '=',
                    filterActive: '=',
                    countingActive: '='
                }
            };
        });

function meetingsListController($uibModal, Notification, MeetingsService) {
    var vm = this;
    vm.deleteMeeting = deleteMeeting;
    vm.askDeleteConfirmation = askDeleteConfirmation;
    vm.openEditingForm = openEditingForm;
    vm.getMeetings = getMeetings;

    function getMeetings() {
        var query ={};
        if (vm.searchField) {
            query[vm.searchField] = vm.filteringValue;
        }
        return MeetingsService.getList(query)
                .then(function (meetings) {
                    vm.meetings = meetings;
                    return vm.meetings;
                });
    }

    function openEditingForm(meeting, $event) {
        var resolve = {meeting: meeting};
        var modalInstance = openModal('editingForm.html', 'editingFormCtrl', resolve, $event);

        modalInstance.result.then(function (meeting) {
            console.log(arguments);
        }, function () {
        });
    }

    function askDeleteConfirmation(meeting, $event) {
        var resolve = {meeting: meeting};
        var modalInstance = openModal('deleteConfirmation.html', 'ModalInstanceCtrl', resolve, $event);

        modalInstance.result.then(function (meeting) {
            deleteMeeting(meeting);
        }, function () {
        });
    }

    function deleteMeeting(meeting) {
        meeting.remove()
                .then(function (m) {
                    Notification.success('Meeting deleted');
                    _.remove(vm.meetings, meeting);
                });
    }

    function openModal(templateUrl, controller, resolve, $event) {
        if ($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: templateUrl,
            controller: controller,
            controllerAs: 'vm',
            resolve: resolve
        });
        return modalInstance;
    }
}

angular.module('meetings').controller('ModalInstanceCtrl', function ($uibModalInstance, meeting) {
    var vm = this;
    vm.meeting = meeting;

    vm.proceed = function (meeting) {
        $uibModalInstance.close(meeting);
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss();
    };
});

angular.module('meetings').controller('editingFormCtrl', function ($uibModalInstance, meeting) {
    var vm = this;
    vm.meeting = meeting;

    vm.ok = function (meeting) {
        $uibModalInstance.close(meeting);
    };

});