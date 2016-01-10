(function () {
    angular
            .module('meetings')
            .controller('loginController', loginController);

    function loginController(UsersService, $location) {
        var vm = this;
        vm.submit = submit;

        activate();

        function activate() {
            reset();
        }

        function reset() {
            vm.credentials = {username: '', password: ''};
        }

        function submit() {
            UsersService.login(vm.credentials)
                    .then(function () {
                        reset();
                        $location.path('/');
                    });
        }

    }
})();