$(document).ready(function(){
   // where idOfYourVideo is the YouTube ID.
  $("body").delegate('.chatzone_textarea', 'keydown', function(event) {
      // Check the keyCode and if the user pressed Enter (code = 13)
      if (event.keyCode == 13) {
          event.preventDefault();
          angular.element('#container').scope().sendMessage($('#channelName').val(), $('.chatzone_textarea').val());
          $('.chatzone_textarea').val("");
          var height = jQuery("#chatzone_content")[0].scrollHeight;
          jQuery("#chatzone_content").scrollTop(height+150);
      }
  });
  if($("#chatzone_content")[0] !== undefined){
    var height = $("#chatzone_content")[0].scrollHeight;
    $("#chatzone_content").scrollTop(height+150);
  }
  $('#rankSelect select').selectpicker();

  checkLinks();


});

var checkLinks = function(){
  $(".msgLine").each(function(){
    if($(this).data('analysed') === undefined){
    var content = $(this).html();

    var words = content.split(' ');
    var newContent = "";
    for (var i = 0; i < words.length; i++) {
      if(words[i].indexOf('http://') > -1){
        var text = words[i];
        words[i] = "<a href='"+text+"' target='_blank'>"+text+"</a>";
      }
      if(i == 0){
        newContent += words[i];
      } else {
        newContent += " "+words[i];
      }
    }

    $(this).data('analysed', true);
    $(this).html(newContent);
    }
  });
}
