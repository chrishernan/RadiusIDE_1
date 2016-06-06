var GLOBAL_STUDENT_ASSIGNMENT_REF;
var currentdate = new Date();
var DESCRIPTION_OF_CLICKED_ASSIGNMENT;


$(function () {

    var original_programming_pane_width = document.getElementById("programming").offsetWidth;

    $("#program-output").resizable({ handles: 'n', minHeight: 100 });
    $("#program-output").bind("resize", function () {
        $('#programming').height($('#window').height()-$("#program-output").height());
    });

    $("#control-panel").resizable({ handles: 'e', minWidth: 256 });
    $("#control-panel").bind("resize", function () {
        $('#programming').width($("#window").width()-$("#control-panel").width());
        $('#programming').css('left',$("#control-panel").width());
        $('#program-output').width($("#window").width()-$("#control-panel").width());
        $('#program-output').css('left',$("#control-panel").width());


    });


    //Creates a new
    $("#new-button").click(function() {

        $("#programming").css({width: original_programming_pane_width+'px'});
        $("#assignment-description").css({display: 'none'});

        var serialized_start_string = "--Radius.Serialized on "+currentdate+"^%^[^%^Start//.//.//.20//.20^%^]^%^--End of serialization--";
        Radius.deserialize(serialized_start_string);

    });
    
    //1.Opens the assignment clicked by the user
    //2. displays the assignment Description Div
    $("#dataHolder").on("click", "tr",function (event) {

        var rowNumber = ($(this).index()+1);
        var count = 1;

        // Displaying the Assignment Details/Description Div
        $("#programming").css({width: original_programming_pane_width/2+'px'});
        $("#assignment-description").css({left: original_programming_pane_width/2+300+'px',width:(original_programming_pane_width-20)/2+'px',display: 'block'});


        database.ref().once("value",function(snapshot) {
            var currentUser = firebase.auth().currentUser.uid;
            var students = snapshot.child("Teachers/Frost/Students");
            //Loops through every Frost Student
            students.forEach(function(studentSnapshot) {

                if(studentSnapshot.key==currentUser) {
                    var assignments = studentSnapshot.child("/Assignments");
                    assignments.forEach(function(assignmentSnapshot) {
                        if(count == rowNumber) {
                            GLOBAL_STUDENT_ASSIGNMENT_REF = assignmentSnapshot.ref;
                            var savedCode =assignmentSnapshot.child("/SavedCode").val();
                            var starterCode = assignmentSnapshot.child("/Start").val();
                            DESCRIPTION_OF_CLICKED_ASSIGNMENT = assignmentSnapshot.child("/Description").val().toString();
                            if(savedCode=="") {
                                if(starterCode=="") {
                                    ;
                                }

                                else {
                                    console.log(starterCode);
                                    Radius.deserialize(starterCode);
                                }
                            }


                            else {
                                Radius.deserialize(savedCode);
                            }


                        }


                        count+=1;
                    })


                }

            })
            //displaying Description to Description Div
            $("#description").text(DESCRIPTION_OF_CLICKED_ASSIGNMENT.toString());


        })



       /* document.getElementById("description").style.textAlign = "center"
        document.getElementById("description").style.textAlign = "center"
        document.getElementById("description").style.textAlign = "center"*/



    });

    $("#minimize-button").mouseenter(function() {
        $("#minimize-button").css({color: 'black'});

    })

    $("#minimize-button").mouseleave(function() {
        $("#minimize-button").css({color: 'white'});

    })


    $("#minimize-button").click(function() {
        alert("Click on your assignment to bring back the instructions.");
        $("#assignment-description").css({display: 'none'});
        $("#programming").css({width: original_programming_pane_width+'px'});


    })

});