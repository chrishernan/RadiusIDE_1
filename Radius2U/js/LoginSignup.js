var currentUser;

$(function () {

    var accountType;
    

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

    function closeLogin() {
        $("#login-pop").hide();
        $("#b-login").hide();
        $("#user-form").show();
        $("#b-signout").show();
        clear();
    }


    function authOnClick() {
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        login(email, password);


    }


    function login(email, password) {

        firebase.auth().signInWithEmailAndPassword(email, password).then(function (data) {
            var demail =data.email.split('@')[0];
            console.log(demail);
            document.getElementById('user').innerHTML = data.email.split('@')[0];
            closeLogin();
        }, function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            alertError("LoginError", "alert", errorMessage);

        });
    }


    function alertError(text, a, error) {
        document.getElementById(a).innerHTML = text + error;
        document.getElementById(a).style.visibility = "visible";
    }

    // var cCoderef = new Firebase(url+"users/cCode");

    var studentUrl;
    var Teacher;

    var userId = '';

    function createAccount() {
        var userName = document.getElementById("name").value;
        var email = document.getElementById("email1").value;
        var courseCode = document.getElementById("course-code").value;
        var password = document.getElementById("password1").value;


        if ($("#password1").val() == $("#password2").val()) {
            if (!isNaN(courseCode)) {
                if (courseCode.length != 5) {
                    alertError("Invalid Course Code!: Making Normal Account", 'alert1', '');
                    accountType = "normal";
                }
                else {

                    firebase.database().ref('users/cCode/' + courseCode ).on('value', function(snapshot) {
                        console.log(snapshot.val());
                        if (snapshot.val() === null) {
                            alertError("The Course Code: " + courseCode + " does not exist!", 'alert1', '');
                        }
                        else {
                            accountType = "student";
                            Teacher = snapshot.val();

                        }
                    }, function (err) {
                        console.log("The read failed: " + err.code);
                    });
                }
            }
            else {
                accountType = "normal";

            }

            firebase.auth().createUserWithEmailAndPassword(email, password).then(function (data) {

                console.log(email);
                console.log(password);
                login(email, password);

                var auth = firebase.auth();

                var provider = new firebase.auth.GoogleAuthProvider();
                auth.signInWithPopup(provider).then(function(result) {
                    var accessToken = result.credential.accessToken;
                    console.log(accessToken);
                    closeLogin();
                });
                if (accountType == 'normal') {
                    firebase.database().ref('NormalUsers/'+data.uid).set({
                        username: userName,
                        email: email
                    });

                    courseCode = '';
                }
                else if (accountType == 'student') {
                    firebase.database().ref("Teachers/" + Teacher + '/Students/'+ data.uid).set({
                        username: userName,
                        email: email,
                        accountType: accountType
                    });
                }

                firebase.database().ref("users/"+ data.uid).set({
                    username: userName,
                    email: email,
                    courseCode: courseCode,
                });


            }, function (error) {
                    alertError("", "alert1", error);

            });

        }

        else {
            alertError("Password not matching!", "alert1", "");
        }

    };


    function signOut() {

        firebase.auth().signOut().then(function() {
            $("#user-form").hide();
            $("#b-login").show();
            $("#b-signout").hide();

        }, function(error) {
            // An error happened.
        });


    };

    function clear() {
        var inputList = document.getElementsByClassName("input");
        for (var i = 0; i < inputList.length; i++) {
            inputList[i].value = "";
        }
        var alertList = document.getElementsByClassName("alert");
        for (var i = 0; i < alertList.length; i++) {
            alertList[i].innerHTML = "";
        }
    };


});