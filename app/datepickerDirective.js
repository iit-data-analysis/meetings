angular.module('meetings')
        .directive('iitDatepicker', function () {
            return {
                templateUrl: 'datepicker.html',
                restrict: 'E',
                controller: datepickerController,
                controllerAs: 'vm',
                scope: {
                },
                bindToController: {
                    ngModel: '=',
                    id: '@'
                }
            };
        });

function datepickerController() {
    var vm = this;
    vm.openDatePicker = openDatePicker;
    
    activate();

    function activate() {
        vm.popup = {
            opened: false
        };
    }

    function openDatePicker() {
        vm.popup.opened = true;
    }
}