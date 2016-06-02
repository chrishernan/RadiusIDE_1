/**
 * Created by christianhernandez on 5/11/16.
 */
$(function() {

    var name;
    var dueDate;
    var starterCode;


    $("#upload-assignments").click(function () {
        //add a floating div that prompts the user to input the starter code,
        //due date, name
        //$("#upload-assignments-prompt").style.display = 'block';

        document.getElementById("wrapper").style.display = "block";


    })


    //user clicks on submit button
    $("#upload-form-submit").click(function () {


        name = document.getElementById("starter-code-form1").value;
        dueDate = document.getElementById("starter-code-form2").value;
        Description = document.getElementById("starter-code-form3").value;
        starterCode = document.getElementById("starter-code-form4").value;

        alert('upload clicked');

        //var tempFirebase;

        database.ref().once("value", function (snapshot) {
            var students = snapshot.child("Teachers/Frost/Students/");
            students.forEach(function (student) {
                // var student = child.val();

                //Change in notation to enter the value of variable "name" as a key and object.
                var lowerLevelEmptyObject = {};
                var assignmentDetails = {"Name": name,
                    "DueDate": dueDate,
                    "Start": starterCode,
                    "Description": Description,
                    "Start": starterCode,
                    "SavedCode": ""};
                lowerLevelEmptyObject[name] = assignmentDetails;


                var assignments = "Assignments";

                var upperLevelEmptyObject = {};
                upperLevelEmptyObject[assignments] = lowerLevelEmptyObject;

                console.log(upperLevelEmptyObject);

                student.ref.set(upperLevelEmptyObject);
                /*student.ref.set( {
                    "Assignments" : {
                        name : {
                            "Name": name,
                            "DueDate": dueDate,
                            "Start": starterCode,
                            "Description": Description,
                            "Start": starterCode
                        },
                    }

                })*/

            })
        });




    });


    $("#upload-close").click(function () {

        document.getElementById("wrapper").style.display = "none";

    })
    //when the teacher fills in and submits the assignment fields we make the div dissapear again.


    //update assignments


})






