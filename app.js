var $username = "Username";

$(document).ready(function(){
  page.init();
});


var page = {

  url: "http://tiy-fee-rest.herokuapp.com/collections/blabber",

  init: function () {
    page.initStyling();
    page.initEvents();

  },

  initStyling: function () {
    page.loadMessages();

  },


  initEvents: function (event) {
    $('#messageForm').on('submit', page.addMessage);

    $('#sectionMain').on('click', '.messageDeleteCircle', function(e){
      e.preventDefault();
      var deleteId = $(this).closest('.message').data('id');
      page.deleteMessage(deleteId);
    });

    $('header').on('click', '#loggedOutLeftCreate > a', function(e){
      e.preventDefault();
      $('#loggedOutCreate').toggleClass('activeCreate');
    });

    $('#landingPageForm').on('submit', function(e) {
      e.preventDefault();
      $username = $('#landingFormUsername').val();
      $('#landingPage').fadeOut();
    });

    // setInterval(function() {
    //    page.updateTime();
    // }, 1000);
  },

  addOneMessageToDOM: function(message) {
    page.loadTemplate("message", message, $('#sectionMain'));
  },

  addAllMessagesToDOM: function(messageCollection) {
    _.each(messageCollection, page.addOneMessageToDOM);
  },

  loadMessages: function () {
    $.ajax({
    url: page.url,
    method: 'GET',
    success: function (data) {
      console.log(data);
      page.addAllMessagesToDOM(data.reverse());
      $('#sectionMain').scrollTop($('#sectionMain')[0].scrollHeight);
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
        $('#messageInput').val("");
        $('#sectionMain').scrollTop($('#sectionMain')[0].scrollHeight);
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


  deleteMessage: function(deleteId) {
  $.ajax({
    url: page.url + "/" + deleteId,
    method: 'DELETE',
    success: function (data) {
      $('#sectionMain').html('');
      page.loadMessages();
    }
  });
},



  addMessage: function(event) {
    event.preventDefault();
    var $attachUsername = $username;
    if ($('#messageInput').val().trim().length > 0) {
      var newMessage = {
        content: $('#messageInput').val(),
        timestamp: page.getCurrentTime(),
        author: $attachUsername
      }
      console.log(newMessage);
      page.createMessage(newMessage);
    } else {
      $('#messageInput').val("");
    }
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
  getCurrentTime: function() {
    var time = moment().format('hh:mm:ss');
    return time;
  },
  updateTime: function() {
    $('.messageContentTimeBlock').each(function(){
      console.log('One messageContentTimeBlock');
      var momentTime = moment($('.messageContentTimeBlock').text()).fromNow();
      $('.messageContentTimeBlock').text(momentTime);
    });
  }


};
