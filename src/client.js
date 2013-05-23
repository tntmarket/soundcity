var App = angular.module('soundCity', []);

App.config(['$routeProvider', function($routeProvider) {
   function defaultRoute(name) {
      $routeProvider.otherwise({ redirectTo: '/' + name });
   }
   function route(name, paramName) {
      var routeName = '/' + name + 
                      (paramName ? '/:' + paramName : '');

      $routeProvider.when(routeName, {
         templateUrl: name + '/view.html',
         controller: window[name + 'Ctrl']
      });
   } 

   route('AddSongs');
   route('Playlist');
   route('MyMusic');
   route('Song', 'id');
   route('Artist', 'id');
   route('Album', 'id');
   defaultRoute('AddSongs');
}]);

App.directive('fileUpload', function() {
   return {
      restrict: 'E',
      template: '<input id="song-upload" type="file"'+
         'webkitdirectory directory multiple mozdirectory>',
      link: function(scope, el, attr, controller) {
         $('#song-upload').change(function(e) {
            scope.$apply(function() {
               if(attr.change) {
                  scope[attr.change](
                     Array.prototype.slice.call(e.target.files));
               }
            });
         });
      }
   };
});
