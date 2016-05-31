var GLOBAL_STUDENT_ASSIGNMENT_REF;


$(function () {

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

/*
    //Changes the visibility of the assignments pane by a toggle button
    $('#b-assignments').click(function() {
        var table;
        var row;
        var cell1;
        var cell2;

        if(document.getElementById("assignment-panel").style.display=='block') {
            document.getElementById("assignment-panel").style.display='none';
        }
        else {
            document.getElementById("assignment-panel").style.display='block';
        }

        var data = [{"name":"Assignment 1","due_date":"08/16/17"},{"name":"Assignment 2","due_date":"08/24/17"},{"name":"Assignment 3","due_date":"09/03/17"},{"name":"Assignment 4","due_date":"09/25/17"}];
        var counter = 0;

        table = document.getElementById("dataHolder");


        for(var key in data) {
            row = table.insertRow(counter);
            cell1 = row.insertCell(0);
            cell2 = row.insertCell(1);
            cell1.innerHTML = "<img src='http://icons.iconarchive.com/icons/dtafalonso/yosemite-flat/512/Folder-icon.png'>";
            cell2.innerHTML = data[key].name;
            counter++;
        }

        /*
        table = $('.dataHolder').DataTable({
             rows: [
                {'name':'assignment 1'},
                {'name':'assignment 2'},
                {'name':'assignment 3'},
                {'name':'assignment 4'},
            ]
        });
        var data = {"assignments": [{"name":"Assignment 1"},{"name":"Assignment 2"},{"name":"Assignment 3"},{"name":"Assignment 4"}]};
    */
        /*
        table.row.add([
            'Assignment 1',
            'Assignment 2' ,
            'Assignment 3',
            'Assignment 4'
        ]).draw(false);



    })*/

    $("#dataHolder").on("click", "tr",function (event) {
        //alert(studentsRef.key);

        var rowNumber = ($(this).index()+1);
        var count = 1;

        database.ref().once("value",function(snapshot) {
            var currentUser = firebase.auth().currentUser.uid;
            var students = snapshot.child("Teachers/Frost/Students");
            students.forEach(function(studentSnapshot) {
              //  alert(studentSnapshot.key);

                //alert(currentUser);
                if(studentSnapshot.key==currentUser) {
                    var assignments = studentSnapshot.child("Assignments");
                    assignments.forEach(function(assignmentSnapshot) {
                        if(count == rowNumber) {
                            GLOBAL_STUDENT_ASSIGNMENT_REF = assignmentSnapshot.ref;
                            var savedCode =assignmentSnapshot.child("/SavedCode").val();
                            var starterCode = assignmentSnapshot.child("/Start").val();
                            if(savedCode=="") {
                                if(starterCode=="") {
                                    ;
                                }

                                else {
                                    Radius.deserialize(starterCode);
                                }
                            }
                                //making sure that the start button does not get when we deserialize an empty string
                            else if(starterCode=="") {
                                ;
                            }

                            else {
                                Radius.deserialize(savedCode);
                            }


                        }

                        count+=1;
                    })


                }
            })



        });

    })

});