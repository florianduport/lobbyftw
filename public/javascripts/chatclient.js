$(document).ready(function(){

  $("body").delegate('#textbox textarea', 'keydown', function(event) {
      // Check the keyCode and if the user pressed Enter (code = 13)
      if (event.keyCode == 13) {
          event.preventDefault();
          angular.element('#container').scope().sendMessage($('#textbox textarea').val());
          $('#textbox textarea').val("")
      }
  });

});
