(function () {
    angular
            .module('meetings')
            .factory('MeetingsService', MeetingsService);

    function MeetingsService(Restangular) {
         var service = Restangular.service("meetings");
         
         service.getNewMeeting = function() {
             return {
                 date: null,
                 location: null,
                 topics: null,
                 platform: null,
                 participants: []
             };
         };
         
         return service;
    }
})();