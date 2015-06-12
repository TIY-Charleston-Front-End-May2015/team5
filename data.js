var templates = {};


  templates.message = [
        "<div class='message' data-id='<%=_id%>'>",
          "<div class='messageInfo'>",
             "<div class='messageInfoImage'>",
               "<img src='http://placehold.it/100x100'>",
             "</div>",
             "<div class='messageInfoName'>",
               "<span>Name</span>",
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
        "<%=staus%>",
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
