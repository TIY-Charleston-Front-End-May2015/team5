var templates = {};



templates.message = [
      "<div class='message' data-id='<%=_id%>'>",
        "<div class='messageInfo'>",
           "<div class='messageInfoImage'>",
             "<%= userIcon %>",
           "</div>",
           "<div class='messageInfoName'>",
             "<span><%= author %></span>",
           "</div>",
         "</div>",
         "<div class='messageContent'>",
           "<div class='messageContentTime'>",
             "<div class='messageContentTimeBlock'>",
               "<%= timestamp %>",
             "</div>",
           "</div>",
           "<div class='messageContentText'>",
           "<%= content %>",
           "</div>",
         "</div>",
           "<div class='messageDelete'>",
             "<div class='messageDeleteCircle'>",
               "<div class='messageDeleteX'>",
                 "X",
               "</div>",
             "</div>",
           "</div>",
         "<div class='messageBorderBlock'></div>",
       "</div>"
].join("");


templates.userStatus = [
  "<div class='status'>",
   "<div class='statusImage'>",
      "<%= userIcon %>",
   "</div>",
   "<div class='statusName'>",
     "<%= username%>",
   "</div>",
   "<div class='statusOn'>",
   "<% if (available === 'true') { %>",
     "<div class='statusOnCircle'></div>",
   "<% } else if (available === 'false') { %>",
     "<div class='statusOnCircle availableFalse'></div>",
   "<% } %>",
   "</div>",
  "</div>"
].join("");

templates.loggedInLeftBlock = [
  "<div id='loggedInLeftBlock'>",
  "<div id='loggedInLeftImage'>",
  "<%= userIcon %>",
  "</div>",
  "<div id='loggedInLeftName'>",
  "<%= username %>",
  "</div>",
  "<div id='loggedInLeftEdit'>",
  "Edit",
  "</div>",
  "</div>"
].join("");
