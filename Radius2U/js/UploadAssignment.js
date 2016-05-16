/**
 * Created by christianhernandez on 5/11/16.
 */
$(function() {
   
    var url = "https://radius-ide.firebaseio.com/Teachers/Frost/Students/"
    var ref = new Firebase(url)
    var name;
    var dueDate;
    var starterCode;


    $("#upload-assignments").click(function () {
        //add a floating div that prompts the user to input the starter code,
        //due date, name
        //$("#upload-assignments-prompt").style.display = 'block';

        document.getElementById("upload-form").style.display = "block";




    })


    //user clicks on submit button
    $("#upload-form-submit").click(function() {


        name = document.getElementById("Starter-Code-Form1").value;
        dueDate = document.getElementById("Starter-Code-Form2").value;
        starterCode = document.getElementById("Starter-Code-Form3").value;
        Description = document.getElementById("Starter-Code-Form4").value;

        var tempFirebase;

        ref.once("value",function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var studentData = childSnapshot.val();
                // var student = child.val();

                alert(childSnapshot.key());
                tempFirebase = new Firebase("https://radius-ide.firebaseio.com/Teachers/Frost/Students/"+childSnapshot.key()+"/Assignments/"+name);

                // Same as the previous example, except we will also display an alert
                // message when the data has finished synchronizing.
                var onComplete = function(error) {
                    if (error) {
                        console.log('Synchronization failed');
                    } else {
                        console.log('Synchronization succeeded');
                    }
                };


                tempFirebase.update({Descriptions:Description,DueDate:dueDate,Last_Saved_State:'',Starter_Code:starterCode},onComplete());



            });

        })




    })


    $("#upload-close").click( function() {

        document.getElementById("upload-form").style.display = "none";

    })
    //when the teacher fills in and submits the assignment fields we make the div dissapear again.




    //update assignments







})


