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

function meetingsListController($scope, $uibModal) {
    var vm = this;
    vm.deleteMeeting = deleteMeeting;
    vm.askDeleteConfirmation = askDeleteConfirmation;

    function askDeleteConfirmation(meeting, $event) {
        if ($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }

        vm.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'deleteConfirmation.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: 'vm',
            resolve: {
                meeting: meeting
            }
        });

        vm.modalInstance.result.then(function (meeting) {
            deleteMeeting(meeting);
        }, function () {
        });
    }

    function deleteMeeting(meeting) {
        _.remove(vm.meetings, meeting);
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