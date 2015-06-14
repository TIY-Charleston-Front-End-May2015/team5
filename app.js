var $username;
var $userImage;
var $mostRecentMessageId;

$(document).ready(function(){
  page.init();
});


var page = {

  url: "http://tiy-fee-rest.herokuapp.com/collections/blabber",
  urllogin: "http://tiy-fee-rest.herokuapp.com/collections/blabberUsers",

  init: function () {
    page.initStyling();
    page.initEvents();
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
      $.ajax({
        url: page.urllogin,
        method: 'GET',
        success: function (data) {
          console.log('DATA: ', data);
          var users = data;
          _.each(users, function(idx, el, arr){
            if (users[el].username === $username) {
              page.deleteUser(users[el]._id);
            }
          });
          $username = undefined;
          $userImage = undefined;
          $('#landingFormUsername').val("");
          $('.landingPageImage').removeClass('selectedUserImage');
          $('#landingPage').fadeIn();
          $('#asideMain').html("");
          $('#sectionMain').html("");
          $('#loggedInLeft').html("");
        },
        error: function (err) {

        }
      });
    });

    $('#landingPageImagesBlock').on('click', '.landingPageImage', function(e){
      e.preventDefault();
      $(this).siblings().removeClass('selectedUserImage');
      $(this).addClass('selectedUserImage');
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


    // setInterval(function() {
          // $('#asideMain').html("");
          // $('#sectionMain').html("");
    //    page.loadMessages();
    //    page.loadUserStatuses();
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
      // console.log('DATA: ', data);
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

  getMostRecentMessage: function() {
    $mostRecentMessageId = $('.message').last().data('id');
  },

  getNewestMessages: function(recentId) {
    $.ajax({
      url: page.url,
      method: 'GET',
      success: function (data) {
        console.log('DATA: ', data);
        for (var i = 0; i < data.length; i++){

          if (data[i]._id === recentId) {

          }
        }
        console.log(result);
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
      data: newUser,
      success: function(data) {
        console.log('New user created.');
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


  loadLogin: function () {
    $.ajax({
    url: page.urllogin,
    method: 'GET',
    success: function (data) {
      console.log("Logins Loaded");

    },
    error: function (err) {

    }
  });
},

  deleteUser: function(deleteId) {
    $.ajax({
      url: page.urllogin + "/" + deleteId,
      method: 'DELETE',
      success: function (data) {
        console.log('User deleted.');
      }
    });
  },

  createUserStatuses: function(data) {
    _.each(data, function(idx, el, arr) {
      page.loadTemplate("userStatus", data[el], $('#asideMain'));
    })
  },

  loadUserStatuses: function(data) {
    $.ajax({
    url: page.urllogin,
    method: 'GET',
    success: function (data) {
      page.createUserStatuses(data);
    },
    error: function (err) {

    }
  });
  },


  deleteAllUsers: function() {
    $.ajax({
      url: page.urllogin,
      method: 'DELETE',
      success: function (data) {
        console.log('User deleted.');
      }
    });
  },

  addAllLoginsToDOM: function(loginCollection) {
    _.each(loginCollection, page.addOneLoginToDOM);
  },

  addOneLoginToDOM: function(login) {
    page.loadTemplate("userStatus", login, $('#asideMain'));
  },


////////////////////////////////////////////////////


//////////////This is David's way to not show delete circle currently has error//////
  // getDelete: function(event){
  //   var toDelete = _.reject($('.message')), function() {
  //
  //     return ('.message').find('.messageInfoName') = $username;
  //
  //   },
  //
  // hideDelete: function() {
  //   page.getDelete.().find('.messageDelete').hide();
  // },
///////////////////////////////////////////////////////////////////////////////

///////////////This is Clayton's way to not show the delete circle/////////////

///////////////////////////////////////////////////////////

  loadTemplate: function (tmplName, data, $target){
    var compiledTmpl = _.template(page.getTemplate(tmplName));

    $target.append(compiledTmpl(data));
  },

  getTemplate: function(name) {
    return templates[name];
  },
  getCurrentTime: function() {
    var time = moment().format('hh:mm:ss DD/MM/YY');
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
        authorsNotEqual = $.unique(authorsNotEqual);
        console.log(authorsNotEqual);
        for (var i = 0; i < authorsNotEqual.length; i++) {
          console.log('Authors not equal to $username: ', authorsNotEqual[i].author);
          $('.message').each(function(idx, el, arr){
            console.log('Author of each message: ', $(el).find('.messageInfoName').text().trim());
            console.log(authorsNotEqual[i].author === $(el).find('.messageInfoName').text().trim());
             if (authorsNotEqual[i].author === $(el).find('.messageInfoName').text().trim()) {
               $(el).find('.messageDeleteCircle').hide();
               console.log($(el).find('.messageDeleteCircle'));
             } else {
               $(el).find('.messageDeleteCircle').show();
             }
          });
        };
      },
      error: function (err) {

      }
    });
  }
};
