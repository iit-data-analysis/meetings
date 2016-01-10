(function () {
    angular
            .module('meetings')
            .factory('PeopleService', PeopleService);

    function PeopleService(Restangular) {
         var service = Restangular.service("people");
         
         service.getNewPerson = function() {
             return {
                 surname: '',
                 institute: ''
             };
         };
         
         return service;
    }
})();