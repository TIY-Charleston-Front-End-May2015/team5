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

var userStatus = [

    "<div class='status'>",
     "<div class='statusImage'>",
        "<%=status%>",
     "</div>",
     "<div class='statusName'>",
       "Name",
     "</div>",
     "<div class='statusOn'>",
       "<div class='statusOnCircle'>",
       "</div>",
     "</div>",
    "</div>"

 ].join("");
