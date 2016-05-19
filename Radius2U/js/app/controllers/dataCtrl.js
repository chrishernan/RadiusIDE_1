var accountType;

var url = "https://radius-ide.firebaseio.com/"
var ref = new Firebase(url);
var userUrl = url+"users/";

var studentUrl = url+


function clear(){
    var inputList = document.getElementsByClassName("input");
    for (var i = 0; i < inputList.length; i++) {
        inputList[i].value ="";
    }
    var alertList = document.getElementsByClassName("alert");
    for (var i = 0; i < alertList.length; i++) {
        alertList[i].innerHTML ="";
    }
}

function closeLogin(){
    $("#login-pop").hide();
    $("#b-login").hide();
    $("#user-form").show();
    $("#b-signout").show();
    clear();
}

app.controller("dataController",
    ['$http', '$scope', function ($http, $scope) {
        $scope.userData = {};
        $scope.userData.email ='';
        $scope.userData.name = '';
        $scope.userData.accountType = "";
        $scope.userData.courseCode = '';

        $scope.studentData = {};
        $scope.studentData.teacher ='';


        $scope.getUserInfo = function(id){
            userUrl+=id+"/";
            console.log(userUrl);
            var user  = new Firebase(userUrl);
            user.on("value",function(info) {
                console.log(info.val());
                $scope.userData.name = info.val().name;
                $scope.userData.accountType = info.val().accountType;
                $scope.userData.courseCode = info.val().courseCode;

            }, function(err){
                console.log("The Read failed!: "+err );
            });
        };


        window.onload = ref.onAuth(function (authData) {
            if (authData) {
                $scope.userData.email= authData.password.email.split('@')[0];
                closeLogin();
                $scope.getUserInfo(authData.uid);
            }
        });







    }]);