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
                    countingActive: '=',
                    limit: '='
                }
            };
        });

function meetingsListController($uibModal, Notification, MeetingsService, PeopleService, Restangular, $scope) {
    var vm = this;
    vm.deleteMeeting = deleteMeeting;
    vm.askDeleteConfirmation = askDeleteConfirmation;
    vm.openEditingForm = openEditingForm;
    vm.getMeetings = getMeetings;
    vm.getPeople = getPeople;
    vm.getInstitutes = getInstitutes;
    vm.openDatePicker = openDatePicker;
    vm.resetSearchField = resetSearchField;

    activate();

    function activate() {
        refresh();
        $scope.$on("meeting.created", refresh);
    }

    function refresh() {
        vm.popup1 = {
            opened: false
        };
        getMeetings();
    }

    function getMeetings() {
        var query = {};
        if (vm.searchField) {
            query[vm.searchField] = vm.filteringValue;
        }
        if (vm.limit) {
            query.limit = vm.limit;
        }
        return MeetingsService.getList(query)
                .then(function (meetings) {
                    vm.meetings = meetings;
                    return vm.meetings;
                });
    }

    function getPeople(q) {
        return PeopleService.getList({q: q});
    }

    function getInstitutes(q) {
        return Restangular.all('institutes').getList({q: q});
    }
    
    function resetSearchField() {
        vm.filteringValue = '';
    }
    
    function openDatePicker() {
        vm.popup1.opened = true;
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