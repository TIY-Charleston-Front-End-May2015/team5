var $username;
var $userImage;
$(document).ready(function(){
  page.init();
});


var page = {

  url: "http://tiy-fee-rest.herokuapp.com/collections/blabber",
  urllogin: "http://tiy-fee-rest.herokuapp.com/collections/blabberuserlogin",

  init: function () {
    page.initStyling();
    page.initEvents();
    page.loadNewMessages();

  },

  initStyling: function () {
    page.loadMessages();

  },




  initEvents: function (event) {
    /////////Added this for login///////////////////
    $('#landingPageForm').on('submit', page.addLogin);
    ////////////////////////////////////////////////
    $('#messageForm').on('submit', page.addMessage);

    $('#logOutButton').on('click', function(){
      location.reload();
    });

    $('#landingPageImagesBlock').on('click', '.landingPageImage', function(e){
      e.preventDefault();
      console.log('hello');
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
        /////////////Added this for status bar/////////////////
        page.loadTemplate("userStatus", userInfoArray, $('#asideMain'))
        ///////////////////////////////////////////////////////

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



    setInterval(function() {
       page.loadNewMessages();

    }, 2000);

  },


  addOneMessageToDOM: function(message) {
    page.loadTemplate("message", message, $('#sectionMain'));
  },

  addAllMessagesToDOM: function(messageCollection) {
    _.each(messageCollection, page.addOneMessageToDOM);
  },



  loadMessages: function (data) {
    $.ajax({
    url: page.url,
    method: 'GET',
    success: function (data) {

      page.addAllMessagesToDOM(data.reverse());

      $('.message').each(function(idx, el, arr){
         if ($(el).find('.messageInfoName').text().trim() !== $username) {
           $(el).find('.messageDelete').hide();
         }
        });

      $('#sectionMain').scrollTop($('#sectionMain')[0].scrollHeight);
    },


    error: function (err) {

    }
  });
},

addNewMessagesToDOM: function(newMessages) {
    _.each(newMessages, page.addOneMessageToDOM);
  },

  loadNewMessages: function(data){

    $.ajax({
      url: page.url,
      method: 'GET',
      success: function(data) {
        var timeSort = _.sortBy($(data), ('timestamp') );
        var newMessages = _.rest(timeSort, $('.message').length);

        console.log("New Message: ", newMessages);
        console.log("timeSort:", timeSort);
        if (data.length !== $('.message').length) {
          page.addNewMessagesToDOM(newMessages);
          $('#sectionMain').scrollTop($('#sectionMain')[0].scrollHeight);
        }
      }
    })
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
      page.createMessage(newMessage);
    } else {
      $('#messageInput').val("");

    }
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

  deleteAllMessages: function(messageCollection) {
    $.ajax({
      url: page.url,
      method: 'DELETE',
      success: function (data) {
        $('#sectionMain').html('');
        page.loadMessages();
      }
    });

  },


////////////Trying to create Login here//////////////
  addLogin: function(event) {
    event.preventDefault();
    var newLogin = {
      login: $('#landingFormUsername').val(),
      password: $('#landingFormPassword').val(),
    }
    page.createLogin(newLogin);
  },

  createLogin: function(login) {
    $.ajax({

      url: page.urllogin,
      method: 'POST',
      data: login,
      success: function(data) {
        page.addOneLoginToDOM(data);
      },
      error: function(err) {
      console.log("error", err);
    }
    });
  },

  deleteLogin: function(deleteId) {
  $.ajax({
    url: page.urllogin + "/" + deleteId,
    method: 'DELETE',
    success: function (data) {
      // $('.status').html('');
      page.loadLogin();
    }
  });
},

  deleteAllLogins: function(messageCollection) {
    $.ajax({
      url: page.urllogin,
      method: 'DELETE',
      success: function (data) {
        // $('.status').html('');
        page.loadLogin();
      }
    });
  },


  loadLogin: function () {
    $.ajax({
    url: page.urllogin,
    method: 'GET',
    success: function (data) {
      page.addAllLoginsToDOM();
      console.log("Logins Loaded");
    },



    error: function (err) {

    }
  });
  },

  addAllLoginsToDOM: function(loginCollection) {
    _.each(loginCollection, page.addOneLoginToDOM);
  },

  addOneLoginToDOM: function(login) {
    page.loadTemplate("userStatus", login, $('#asideMain'));
  },
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////

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
