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


    });


    //user clicks on submit button
    $("#upload-form-submit").click(function () {


        name = document.getElementById("starter-code-form1").value;
        dueDate = document.getElementById("starter-code-form2").value;
        Description = document.getElementById("starter-code-form3").value;
        starterCode = document.getElementById("starter-code-form4").value;

        alert('upload clicked');

        //var tempFirebase;

        database.ref().once("value", function (snapshot) {
            var students = snapshot.child("Teachers/Frost/Students/").val();

            for( var st in students){
                console.log(st);
                firebase.database().ref("Teachers/Frost/Students/"+st+"/Assignments/"+name).set({
                    "Name": name,
                    "DueDate": dueDate,
                    "Start": starterCode,
                    "Description": Description,
                    "Start": starterCode,
                    "SavedCode": ""
                })
            }
        });

        document.getElementById("wrapper").style.display = "none";





    });


    $("#upload-close").click(function () {

        document.getElementById("wrapper").style.display = "none";

    })

});





