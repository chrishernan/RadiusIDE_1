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
        closeLogin();


    }


    function login(email,password){
        ref.authWithPassword({
            email: email,
            password: password
        }, function (error, authData) {
            if (error) {
                alertError("Login Failed:","alert",error);
            } else {
                rememberMe: true;
                var demail = authData.password.email.split('@')[0];
                console.log(demail);
                document.getElementById('user').innerHTML = authData.password.email.split('@')[0];
                // closeLogin();

            }
        });
    }


    function alertError(text,a,error){
        document.getElementById(a).innerHTML = text + error;
        document.getElementById(a).style.visibility = "visible";
    }
    function showSignUp() {
        $("#signup-form").css("display", "block");
    }

    var studentref;
    var users = new Firebase(url+"Users/")

    function createAccount() {
        var userName = document.getElementById("name");
        var email = document.getElementById("email1").value;
        var courseCode = document.getElementById("course-code");
        studentref = new Firebase(url+"Courses/" + courseCode.value + "/");

        if($("#password1").val()==$("#password2").val()) {
            ref.createUser({
                email: email,
                password: document.getElementById("password1").value,
            }, function (error, authData) {
                if (error) {
                    alertError("Error creating uer:","alert1",error);

                } else {
                    if (!isNaN(courseCode.value) && courseCode.value.length == 5) {
                        studentref.child(authData.uid).set({
                            name: userName.value,
                            courseCode: courseCode.value,
                            email: email
                        })
                        accountType= "student";
                    }
                    else {
                        users.child(authData.uid).set({
                            name: document.getElementById("name").value,
                            email: email
                        })
                        accountType = "normal";
                    }
                    ref.child("users").child(authData.uid).set({
                        name: userName.value,
                        courseCode: courseCode.value,
                        accountType: accountType
                    });
                }
            });
        }
        else {
            alertError("Password not matching!", "alert1", "");
        }
        //login(email,document.getElementById("password1").value);
        // ref.onAuth(function(authData) {
        //     if (authData) {
        //         alert("YESSS"+userName.value+" "+courseCode.value);
        //         ref.child("users").child(authData.uid).set({
        //             name: userName.value,
        //             courseCode: courseCode.value
        //         });
        //     }
        // });

        closeLogin();

    }

    function signOut() {
        ref.unauth();
        $("#user-form").hide();
        $("#b-login").show();
        $("#signup-form").hide();

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



    window.onload = ref.onAuth(function (authData) {
        if (authData) {
            console.log(authData);
            document.getElementById('user').innerHTML =
                authData.password.email.split('@')[0];
            closeLogin();
        }
    });


});