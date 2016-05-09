$(function() {

    var counter=0;
    var data;

    //Changes the visibility of the assignments pane by a toggle button
    $('#b-assignments').click(function() {
        var table;
        var row;
        var cell1;
        var cell2;

        if (document.getElementById("assignment-panel").style.display === 'block') {
            document.getElementById("assignment-panel").style.display = 'none';

        }
        else {
            document.getElementById("assignment-panel").style.display = 'block';
        }

        data = [{"name": "Assignment 1", "due_date": "08/16/17"}, {
            "name": "Assignment 2",
            "due_date": "08/24/17"
        }, {"name": "Assignment 3", "due_date": "09/03/17"}, {"name": "Assignment 4", "due_date": "09/25/17"}];

        table = document.getElementById("dataHolder");

        if (counter <= 0) {
            for (var key in data) {
                row = table.insertRow(counter);
                cell1 = row.insertCell(0);
                cell1.innerHTML = " <img src='http://icons.iconarchive.com/icons/dtafalonso/yosemite-flat/512/Folder-icon.png' class='folder-images' style='width: 50px;height: 50px;'/> " + data[key].name;
                counter++;



            }
        }
    })


    $("table").on("click",'.folder-rows',function () {
        alert('You clicked row '+ ($(this).index()+1) );
    })


     //var url = "https://amber-heat-3180.firebaseio.com/amber-heat-3180";
     var url = "https://radius-ide.firebaseio.com/";
     var reference = new Firebase(url);
     //reference.set({Name:"assignment 1",Date: "08./15/17", assignmentDetails: "Turn the farenheit temperature into celsius."});

    $("#b-assignments")[0].addEventListener("click",retrieveAssignmentName);

    $("table").on("mouseenter",".folder-rows, #hover-div",function(event) {

        var hoverDiv = document.getElementById("hover-div");
        var left = event.clientX+"px";
        var top = event.clientY+"px";

        var rowNumber = "Assignment "+($(this).index()+1) +" details";

        hoverDiv.innerHTML = rowNumber;

        hoverDiv.style.left = left;
        hoverDiv.style.top = top;

        $("#hover-div").toggle();




        //alert("mouse over"+($(this).index()+1));
    })


    $("table").on("mouseleave",".folder-rows, #hover-div",function() {

        $("#hover-div").toggle();

    })

    $("#resources-panel").mouseenter(function() {
        var image = document.getElementById("plus-sign-image");
        image.style.opacity= "0.2";
    })

    $("#resources-panel").mouseleave(function() {
        var image = document.getElementById("plus-sign-image");
        image.style.opacity = ".5";
    })


    $("#splash-screen").click(function () {
        $("#splash-screen").fadeOut();
    })



    function retrieveAssignmentName() {
         var assignmentName;
         var assignment;
         var boolean1;

/*
     reference.on("value",function(snapshot) {
         alert(snapshot.exists());
         snapshot.forEach( function(childSnapshot) {
             var value = childSnapshot.key();
             alert(value);
         })
         var assignmentSnapshot = snapshot.child();
         assignment = assignmentSnapshot.exportVal();

         var assignmentNameSnapshot = snapshot.child("Name/");
         assignmentName = assignmentNameSnapshot.exportVal();
         boolean = snapshot.exists();
         return boolean1;
     });
     console.log(boolean1);
     alert(assignmentName);
        */
     }

});






/*"aoColumns": [
    {"sTitle":"", "mData":null,"bSortable":false,"sClass":"head0","sWidth":"55px",
    "mRender",function(data,type,row,meta) {
            return "<a href='#' target='_blank'><i class='fa fa-folder'></i>&nbsp;" +data.Name+"</a>";
        }
    }
]*/
/*** Created by christianhernandez on 4/18/16.*/
