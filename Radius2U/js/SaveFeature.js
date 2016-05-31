/**
 * Created by christianhernandez on 5/18/16.
 */


$(function() {


   $("#b-save").click(function() {
       //to save pretty much

       var serializedCode = Radius.serialize();
       var assignmentDetailsArray = [];

//       alert(serializedCode);

       alert(GLOBAL_STUDENT_ASSIGNMENT_REF.key);

       GLOBAL_STUDENT_ASSIGNMENT_REF.once("value",function(snapshot) {

           snapshot.forEach(function(assignmentsDetailsSnapshot) {
               assignmentDetailsArray.push(assignmentsDetailsSnapshot.val());
           })
       });

       GLOBAL_STUDENT_ASSIGNMENT_REF.set({

           Description:assignmentDetailsArray[0],
           Name:assignmentDetailsArray[1],
           SavedCode:serializedCode,
           Start:assignmentDetailsArray[3]

       });
       

   })

});