var $username;
var $userImage;
var $mostRecentMessageId;
var $appendingRecentMessages;

$(document).ready(function(){
  page.init();
});


var page = {

  url: "http://tiy-fee-rest.herokuapp.com/collections/blabberChat",
  urllogin: "http://tiy-fee-rest.herokuapp.com/collections/blabberUsers",

  init: function () {
    page.initStyling();
    page.initEvents();
  },

  initStyling: function () {
    page.loadMessages();
  },




  initEvents: function (event) {

    $('#messageForm').on('submit', page.addMessage);

    $('#loggedInLeft').on('click', '#loggedInLeftEdit', function() {
      console.log('Clicked!');
      $(this).hide();
      $('#loggedInLeftName').css('width', '90%');
      $('#loggedInLeftName').css('color', 'black');
      $('#loggedInLeftName').html("<form id='loggedInLeftInput'><input type='text' value='" + $username + "'></form>");
    });

    $('#loggedInLeft').on('submit', '#loggedInLeftInput', function(e) {
      e.preventDefault();
      $.ajax({
        url: page.urllogin,
        method: 'GET',
        success: function (data) {
          console.log('Got!');
          _.each(data, function(el, idx, arr){
            console.log($username);
            console.log(el.username);
            if ($username === el.username) {
              $.ajax({
                url: page.urllogin + "/" + el._id,
                method: 'DELETE',
                success: function (data) {
                  console.log('User deleted.');
                  $username = $('#loggedInLeftInput').children().val();
                  $(this).hide();
                  $('#loggedInLeftEdit').show();
                  $('#loggedInLeftName').html($username);
                  $('#loggedInLeftName').css('width', '50%');
                  $('#loggedInLeftName').css('color', 'white');
                  var newUser = {
                    username: $username,
                    userIcon: $userImage,
                    available: true
                  }
                  page.createUser(newUser);
                }
              });
            }
          });
        },
        error: function (err) {

        }
      });
    })

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

    $('#asideMain').on('click', '.statusOnCircle', function() {
      if ($(this).closest('.status').find('.statusName').text() === $username) {
        if ($(this).hasClass('availableFalse') === true) {
          $(this).removeClass('availableFalse');
        } else {
          $(this).addClass('availableFalse');
        }
      }
      if ($(this).closest('.status').find('.statusName').text() === $username) {
        $.ajax({
          url: page.urllogin,
          method: 'GET',
          success: function (data) {
            _.each(data, function(el, idx, arr) {
              if (el.username === $username) {
                if (el.available === "true") {
                  console.log('Available is true.');
                    var updatedStatus = {
                      userIcon: el.userIcon,
                      username: el.username,
                      available: false
                    };
                    page.updateUserStatuses(updatedStatus, el._id);
                } else if (el.available === "false") {
                    var updatedStatus = {
                      userIcon: el.userIcon,
                      username: el.username,
                      available: true
                    };
                    page.updateUserStatuses(updatedStatus, el._id);
                }
              }
            });
          },
          error: function (err) {

          }
        });
      }
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
          $.ajax({
          url: page.urllogin,
          method: 'GET',
          success: function (data) {
            console.log('USERS: ', data);
            var loginPass = true;
            _.each(data, function(idx, el, arr) {
              if ($('#landingFormUsername').val() === data[el].username) {
                $('#landingPageUsernameErrorBlock').addClass('activeUsernameError');
                $('#usernameErrorText').text('Username taken.');
                loginPass = false;
              }
            })
            if (loginPass) {
              $username = $('#landingFormUsername').val();
              var userInfoObject = {
                username: $username,
                userIcon: $userImage
              }
              page.addUser();
              $('#landingPage').fadeOut();
              $('#landingPageImageErrorBlock').removeClass('activeImageError');
              $('#landingPageUsernameErrorBlock').removeClass('activeUsernameError');
              page.loadTemplate("loggedInLeftBlock", userInfoObject, $('#loggedInLeft'));
              $('#sectionMain').html("");
              page.loadUserStatuses();
              page.loadMessages();
              setInterval(function() {
                page.loadUserStatuses();
                page.loadNewMessages();
                page.disableDeleteCircles();
              }, 2000);
            }
          },
          error: function (err) {

          }
        });


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
      page.addAllMessagesToDOM(data.reverse());
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

  appendNewestMessages: function(messagesToAppend) {
    console.log(messagesToAppend.reverse());

    _.each(messagesToAppend.reverse(), function(el, idx, arr) {
      var newMessage = {
        content: el.content,
        timestamp: el.timestamp,
        author: el.author,
        userIcon: el.userIcon
      }
      $.ajax({
        url: page.url,
        method: 'POST',
        data: newMessage,
        success: function (data) {
          page.addOneMessageToDOM(data);
        },
        error: function (err) {
          console.log("error ", err);
        }

      });
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
      page.createMessage(newMessage);
    } else {
      $('#messageInput').val("");

    }
  },

  addUser: function() {
    var newUser = {
      username: $username,
      userIcon: $userImage,
      available: true
    }
    page.createUser(newUser);
  },

  createUser: function(newUser) {
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

  loadUsers: function() {
    $.ajax({
    url: page.urllogin,
    method: 'GET',
    success: function (data) {
      console.log('DATA: ', data);
      return data;
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
      page.loadTemplate2("userStatus", data[el], $('#asideMain'));
    });
  },

  loadUserStatuses: function(data) {
    $.ajax({
    url: page.urllogin,
    method: 'GET',
    success: function (data) {
      if (data.length === $("#asideMain").children().length) {
        $('#asideMain').html("");
        page.createUserStatuses(data);
      } else {
        $('#asideMain').html("");
        page.createUserStatuses(data);
      }
    },
    error: function (err) {

    }
  });
  },

  updateUserStatuses: function (editedStatus, statusId) {

    $.ajax({
      url: page.urllogin + '/' + statusId,
      method: 'PUT',
      data: editedStatus,
      success: function (data) {
        console.log('Status updated');
        $('.content').html('');
        page.loadUserStatuses();

      },
      error: function (err) {}
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
    // $('.message').each(function(idx, el, arr){
    //   if ($(el).find('.messageInfoName').text().trim() !== $username) {
    //     $(el).find('.messageDelete').hide();
  //     }
  //   });
  // },
///////////////////////////////////////////////////////////

  loadTemplate: function (tmplName, data, $target){
    var compiledTmpl = _.template(page.getTemplate(tmplName));

    $target.append(compiledTmpl(data));
  },

  loadTemplate2: function (tmplName, data, $target){
    var compiledTmpl = _.template(page.getTemplate(tmplName));

    $target.prepend(compiledTmpl(data));
  },

  getTemplate: function(name) {
    return templates[name];
  },
  getCurrentTime: function() {
    var time = moment().format();
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
