angular.module('meetings')
        .directive('iitHeader', function (UsersService) {
            return {
                templateUrl: 'header.html',
                restrict: 'E',
                controller: headerController,
                controllerAs: 'vm',
                scope: {
                }
            };
        });

function headerController($scope, UsersService, $location) {
    var vm = this;
    vm.isLogged = isLogged;
    vm.logout = logout;

    function isLogged() {
        return UsersService.isLogged;
    }

    function logout() {
        UsersService.logout()
                .then(function () {
                    $location.path('/login');
                });
    }
}