var $username;
var $userImage;

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

    $('#logOutButton').on('click', function(){
      location.reload();
    });

    $('#landingPageImagesBlock').on('click', '.landingPageImage', function(e){
      e.preventDefault();
      $(this).siblings().removeClass('selectedUserImage');
      $(this).addClass('selectedUserImage');
      console.log($(this).html().trim());
      $userImage = $(this).html().trim();
    });

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
      if ($userImage !== undefined && $('#landingFormUsername').val().trim().length > 0) {
        $username = $('#landingFormUsername').val();
        var userInfoArray = {
          username: $username,
          userIcon: $userImage
        }
        $('#landingPage').fadeOut();
        $('#landingPageImageErrorBlock').removeClass('activeImageError');
        $('#landingPageUsernameErrorBlock').removeClass('activeUsernameError');
        page.loadTemplate("loggedInLeftBlock", userInfoArray, $('#loggedInLeft'));
        page.disableDeleteCircles();

      } else if ($userImage === undefined && $('#landingFormUsername').val().trim().length === 0) {
        $('#landingPageImageErrorBlock').addClass('activeImageError');
        $('#landingPageUsernameErrorBlock').addClass('activeUsernameError');
      } else if ($userImage === undefined && $('#landingFormUsername').val().trim().length > 0) {
        $('#landingPageImageErrorBlock').addClass('activeImageError');
        $('#landingPageUsernameErrorBlock').removeClass('activeUsernameError');
      } else {
        $('#landingPageUsernameErrorBlock').addClass('activeUsernameError');
        $('#landingPageImageErrorBlock').removeClass('activeImageError');
      }
    });

    // setInterval(function() {
    //   page.loadMessages();
    // }, 2000);
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
      console.log('DATA: ', data);
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
        author: $attachUsername,
        userIcon: $userImage
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
  },
  disableDeleteCircles: function() {
    $.ajax({
      url: page.url,
      method: 'GET',
      success: function (data) {
        var authorsNotEqual = _.reject(data, {author: $username});
        console.log(authorsNotEqual);
        for (var i = 0; i < authorsNotEqual.length; i++) {
          $('.message').each(function(idx, el, arr){
             if (authorsNotEqual[i].author === $(el).find('.messageInfoName').text().trim()) {
               $(el).find('.messageDeleteCircle').hide();
             }
          });
        };
      },
      error: function (err) {

      }
    });
  }
};
