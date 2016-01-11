angular.module('meetings')
        .factory('UsersService', function ($http, Notification) {
            var UserService = {
                getEmptyUser: function () {
                    return {
                        isLogged: false,
                        username: '',
                        expires: new Date()
                    };
                },
                saveUser: function (user) {
                    this.user = user;
                    this.user.expires = new Date();
                    this.user.expires.setHours(this.user.expires.getHours() + 1);  //expires after 1 hour
//                   this.user.expires.setTime(this.user.expires.getTime()+20 * 1000);  
//                   expires after 20 seconds, debug
                    sessionStorage.user = angular.toJson(this.user);
                },
                getUser: function () {
                    if (new Date() > this.user.expires)
                        this.resetUser();
                    return this.user;
                },
                resetUser: function () {
                    var emptyUser = this.getEmptyUser();
                    this.saveUser(emptyUser);
                },
                login: function (credentials) {
                    return $http.post('api/login', credentials)
                            .then(function (res) {
                                var user = res.data.session;
                                UserService.isLogged = true;
                                UserService.username = res.data.username;
                                UserService.saveUser(res.data.session);
                                return user;
                            }, function () {
                                Notification.error('Login Failed');
                            });
                },
                logout: function () {
                    return $http.post('api/logout')
                            .then(function (res) {
                                var user = res.data.session;
                                UserService.isLogged = false;
                                UserService.username = null;
                                UserService.resetUser();
                                return user;
                            }, function () {
                                Notification.error('Logout Failed');
                            });
                },
                user: {}
            };
            UserService.user = sessionStorage.user ?
                    angular.fromJson(sessionStorage.user) :
                    UserService.getEmptyUser();
            UserService.user.expires = new Date(UserService.user.expires);
            if (UserService.user.expires < new Date())
                UserService.resetUser();

            return UserService;
        });