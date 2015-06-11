$(document).ready(function(){
  page.init();
});


var page = {

  url: "http://tiyfee-calweb.rhcloud.com/collections/blabber",

  init: function () {
    page.initStyling();
    page.initEvents();

  },

  initStyling: function () {
    page.loadMessages();

  },


  initEvents: function () {
    $('.message').on('submit', page.addMessage)

  },

  addOneMessageToDOM: function(message) {
    page.loadtemplate("message", message, $('.message'))
  },

  addAllMessagesToDOM: function(messageCollection) {
    _.each(messageCollection, page.addOneMessageToDOM);
  },

  loadMessages: function () {


    $.ajax({
    url: page.url,
    method: 'GET',
    success: function (data) {
      ///need to add here
      console.log("success");
      console.log(data);
      page.addAllMessagesToDOM(data);

    },
    error: function (err) {

    }
  });
},

createMessage: function (newMessage) {

    $.ajax({
      url: page.url,
      method: 'POST',
      data: newMessage,
      success: function (data) {

        page.addOneMessageToDOM(data);
        console.log("success!!: ", data);
      },
      error: function (err) {
        console.log("error ", err);
      }

    });
  },

  updateMessage: function (editedMessage, MessageId) {

  $.ajax({
    url: page.url + '/' + messageId,
    method: 'PUT',
    data: editedMessage,
    success: function (data) {
/////need to determine where?/////
      $('.message').html('');
      page.loadMessages();

    },
    error: function (err) {}
  });
},


  deletePost: function(e) {
  e.preventDefault();

  $.ajax({
    url: page.url + "/" + $(this).closest('.message').data('id'),
    method: 'DELETE',
    success: function (data) {

      $('.message').html('');
      page.loadMessages();
    },
  });
},



  addMessage: function(event) {
    event.preventDefault
    // var messageTime = ()
    var newMessage = {
      message: $('#messageInput').val(),
      // messageId: $('.message').data('id'),
      // time: $()
  }
    console.log(newMessage);

    page.createMessage(newMessage),

    $('#messageInput').html("")

  },

  navPages: function (event) {
  event.preventDefault();

  var clickedPage = $(this).attr('rel');
  $(clickedPage).siblings().removeClass('active');
  $(clickedPage).addClass('active');
},

  loadTemplate: function (tmplName, data, $target){
    var compiledTmpl = _.template(page.getTemplate(tmplName));

    $target.append(compiledTmpl(data));
  },

  getTemplate: function(name) {
    return templates[name];
  },


};
