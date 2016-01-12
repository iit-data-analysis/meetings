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

function meetingsListController($uibModal) {
    var vm = this;
    vm.deleteMeeting = deleteMeeting;
    vm.askDeleteConfirmation = askDeleteConfirmation;
    vm.openEditingForm = openEditingForm;

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
        _.remove(vm.meetings, meeting);
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

angular.module('meetings').controller('editingFormCtrl', function ($scope, $uibModalInstance, meeting) {
    var vm = this;
    vm.meeting = meeting;
});