$(document).ready(function(){
   // where idOfYourVideo is the YouTube ID.
  $("body").delegate('#textbox textarea', 'keydown', function(event) {
      // Check the keyCode and if the user pressed Enter (code = 13)
      if (event.keyCode == 13) {
          event.preventDefault();
          angular.element('#container').scope().sendMessage($('#channelName').val(), $('#textbox textarea').val());
          $('#textbox textarea').val("")
          var height = jQuery("#chatzone_content")[0].scrollHeight;
          jQuery("#chatzone_content").scrollTop(height+150);
      }
  });
  if($("#chatzone_content")[0] !== undefined){
    var height = $("#chatzone_content")[0].scrollHeight;
    $("#chatzone_content").scrollTop(height+150);
  }

});
