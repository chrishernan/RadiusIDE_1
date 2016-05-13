$(function () {

    var accountType;
    //var Firebase = require("firebase");

    var url = "https://radius-ide.firebaseio.com/"
    var ref = new Firebase(url);


    var signup = document.getElementById("signup-form");
    var loginEnter = document.getElementById("login-enter");

    loginEnter.addEventListener('click', authOnClick);
    $("#b-login")[0].addEventListener('click', onLogin);
    // $("#signup-enter")[0].addEventListener("click", showSignUp);

    function onLogin() {
        $("#login-pop").css("display", "block");
    }


    $("#login-close")[0].addEventListener("click", closeOnClick);
    // $("#signup-close")[0].addEventListener("click", closeOnClick);
    $("#signup-submit")[0].addEventListener("click", createAccount);
    $("#b-signout")[0].addEventListener("click", signOut);

    function closeOnClick() {
        $("#login-pop").hide();
        clear();

    }

    function closeLogin(){
        $("#login-pop").hide();
        $("#b-login").hide();
        $("#user-form").show();
        $("#b-signout").show();
        clear();
    }


    function authOnClick() {
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
        login(email,password);


    }


    function login(email,password){
        ref.authWithPassword({
            email: email,
            password: password
        }, function (error, authData) {
            if (error) {
                alertError("","alert",error);
            } else {
                rememberMe: true;
                var demail = authData.password.email.split('@')[0];
                console.log(demail);
                document.getElementById('user').innerHTML = authData.password.email.split('@')[0];
                closeLogin();

            }
        });
    }


    function alertError(text,a,error){
        document.getElementById(a).innerHTML = text + error;
        document.getElementById(a).style.visibility = "visible";
    }

    var studentref;
    // var cCoderef = new Firebase(url+"users/cCode");
    var users = new Firebase(url+"Users/");


    //
    // function checkCourseCode(urlref){
    //     var dataref = new Firebase(url+"Users/"+urlref);
    //     dataref.on("value",function(snapshot){
    //
    //     })
    // }


    function createAccount() {
        var userName = document.getElementById("name").value;
        var email = document.getElementById("email1").value;
        var courseCode = document.getElementById("course-code").value;
        studentref = new Firebase(url+"Courses/" + courseCode + "/");


        if($("#password1").val()==$("#password2").val()) {
            if (!isNaN(courseCode)) {
                if (courseCode.length != 5) {
                    alertError("Invalid Course Code!", 'alert1', '');
                }
                else {
                    var cCoderef = new Firebase(url + "users/cCode/" + courseCode);
                    cCoderef.on("value", function (snapshot) {
                        if (snapshot.val() === null) {
                            alertError("The Course Code: " + courseCode + " does not exist!", 'alert1', '');
                        }
                        else {
                            accountType = "student";
                        }
                    }, function (err) {
                        console.log("The read failed: " + err.code);
                    });
                }
            }
            else {
                accountType = "normal";
            }

            ref.createUser({
                email: email,
                password: document.getElementById("password1").value,
            }, function (error, authData) {
                if (error) {
                    alertError("","alert1",error);

                } else {

                    users.child(authData.uid).set({
                        name: userName,
                        email: email
                    });

                    ref.child("users").child(authData.uid).set({
                        name: userName,
                        courseCode: courseCode,
                        accountType: accountType
                    });
                    closeLogin();

                }
            });
        }

        else {
            alertError("Password not matching!", "alert1", "");
        }

    }

    function signOut() {
        ref.unauth();
        $("#user-form").hide();
        $("#b-login").show();

    }

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
    


});