var accountType;

var url = "https://radius-ide.firebaseio.com/"
var ref = new Firebase(url);


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
        

        window.onload = ref.onAuth(function (authData) {
            if (authData) {
                $scope.userData.email= authData.password.email.split('@')[0];
                closeLogin();
            }
        });
        
        
        

    }]);