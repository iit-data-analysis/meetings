meetings.config(function (RestangularProvider, $routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: "home.html",
                controller: "homeController",
                controllerAs: "vm"
            })
            .when("/meetings", {
                templateUrl: "meetings.html",
                controller: "meetingsController",
                controllerAs: "vm"
            })
            .when("/login", {
                templateUrl: "login.html",
                controller: "loginController",
                controllerAs: "vm",
                access: {
                    noLogin: true
                }
            });


    RestangularProvider.setBaseUrl('api');
});


meetings.run(function ($rootScope, $location, UsersService) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (!UsersService.isLogged) {
            if (next.access && next.access.noLogin) {

            } else {
                $location.path("/login");
            }
        }
    });
});
