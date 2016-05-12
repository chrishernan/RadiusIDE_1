/**
 * Created by christianhernandez on 5/11/16.
 */
$(function() {
   
    var url = "https://radius-ide.firebaseio.com/Teachers/Frost/Students/"
    var ref = new Firebase(url)

    $("#upload-assignments").click(function () {
        //add a floating div that prompts the user to input the starter code,
        //due date, name
        //$("#upload-assignments-prompt").style.display = 'block';

        ref.once("value",function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var child = childSnapshot.key();
               // var student = child.val();

                alert(child);
            });
        })


    })

    //when the teacher fills in and submits the assignment fields we make the div dissapear again.


    //update assignments







});