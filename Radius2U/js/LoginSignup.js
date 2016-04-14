$(function () {

    var accountType;
//var Firebase = require("firebase");

    var url = "https://radius-ide.firebaseio.com/"
    var ref = new Firebase(url);


    var signup = document.getElementById("signup-form");
    var loginEnter = document.getElementById("login-enter");

    loginEnter.addEventListener('click', authOnClick);
    $("#b-login")[0].addEventListener('click', onLogin);
    $("#signup-enter")[0].addEventListener("click", showSignUp);

    function onLogin() {
        $("#login-pop").css("display", "block");
    }

//document.getElementById("login-close").addEventListener("mousedown", onDown)

//document.getElementById("login-close").addEventListener("mouseup", closeOnClick)

    $("#login-close")[0].addEventListener("click", closeOnClick);
    $("#signup-close")[0].addEventListener("click", closeOnClick);
    $("#signup-submit")[0].addEventListener("click", createAccount);
    $("#b-signout")[0].addEventListener("click", signOut);

    function closeOnClick() {
        $("#login-pop").hide();
        $("#signup-form").hide();

    }


    function closeLogin(){
        $("#login-pop").hide();
        $("#b-login").hide();
        $("#b-login").prop("disabled",true);
        $("#user-form").show();
        $("#b-signout").show();
    }


    function authOnClick() {
        ref.authWithPassword({
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }, function (error, authData) {
            if (error) {
                document.getElementById('alert').innerHTML = "Login Failed:" + error;
                document.getElementById('alert').style.visibility = "visible";
            } else {
                closeLogin();
                var demail = document.getElementById("email").value.split('@');
                document.getElementById('user').innerHTML = demail[0];

            }
        });

    }

    function showSignUp() {
        $("#signup-form").css("display", "block");
    }

    var studentref = new Firebase(url+"Courses/" + courseCode.value + "/");
    var users = new Firebase(url+"Users/")

    function createAccount() {
        var studentName = document.getElementById("name");
        var Email = document.getElementById("email1").value;
        var femail = Email.split("@");
        var courseCode = document.getElementById("course-code");


        ref.createUser({
            email: document.getElementById("email1").value,
            password: document.getElementById("password1").value
        }, function (error, userData) {
            if (error) {
                document.getElementById('alert1').innerHTML = "Error creating user:" + error;
                document.getElementById('alert1').style.visibility = "visible";
            } else {
                if (!isNaN(courseCode.value) && courseCode.value.length == 5) {
                    accountType = "student";
                    studentref.child(userData.uid).set({
                        name: document.getElementById("name").value,
                        cCode: courseCode.value,
                        email: Email
                    })

                }
                else {
                    accountType = "user";
                    users.child(userData.uid).set({
                        name: document.getElementById("name").value,
                        email: Email
                    })
                }
                document.getElementById('user').innerHTML = femail[0];
                closeLogin();
            }
        });
    }

    function signOut() {
        ref.unauth();
        $("#user-form").hide();
        $("#b-login").show();
        $("#b-login").prop("disabled",false);

    }


});