describe('Songs', function(){
   var scope = {}, songCtrl;

   beforeEach(function() {
      songCtrl = new SongsController(scope);
   });

   it('should have 3 songs', function() {
      expect(scope.songs.length).toBe(3);
   });
});
