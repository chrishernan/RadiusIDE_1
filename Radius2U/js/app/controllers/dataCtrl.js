


app.controller("dataController",
    ['$http', '$scope', function ($http, $scope) {

        var accountType;

        var signup = document.getElementById("signup-form");
        var loginEnter = document.getElementById("login-enter");

        loginEnter.addEventListener('click', authOnClick);
        $("#b-login")[0].addEventListener('click', onLogin);
        function onLogin() {
            $("#login-pop").css("display", "block");
        }



        $("#login-close")[0].addEventListener("click", closeOnClick);
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
                $scope.getUserInfo(data.uid);
                $scope.getAssignments(data.uid);

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


        var Teacher;


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
                            userName: userName,
                            email: email
                        });

                        courseCode = '';
                    }
                    else if (accountType == 'student') {
                        firebase.database().ref("Teachers/" + Teacher + '/Students/'+ data.uid).set({
                            userName: userName,
                            email: email,
                            accountType: accountType
                        });
                    }

                    firebase.database().ref("users/"+ data.uid).set({
                        userName: userName,
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

        $scope.userData = {};
        $scope.userData.email = '';
        $scope.userData.name = '';
        $scope.userData.accountType = "";
        $scope.userData.courseCode = '';

        $scope.studentData = {};
        $scope.studentData.teacher = '';

        $scope.assignments = {};


        $scope.getUserInfo = function(id){
            firebase.database().ref('users/' + id ).on("value",function(info) {
                console.log(info.val());
                $scope.userData.userName = info.val().userName;
                $scope.userData.accountType = info.val().accountType;
                $scope.userData.courseCode = info.val().courseCode;

            }, function(err){
                console.log("The Read failed!: "+err );
            });
        };


        $scope.getAssignments = function(id){
            firebase.database().ref('Teachers/Frost/Students/' + id +"/Assignments/" ).on("value",function(assign) {
               console.log(assign.val());

                $scope.assignments = assign.val();

                for(var key in $scope.assignments){
                    console.log(key);
                }
            });
        };

        var counter=0;
        var data;

        //Changes the visibility of the assignments pane by a toggle button
        $('#b-ass').click(function() {
            var table;
            var row;
            var cell1;
            var cell2;

            if (document.getElementById("assignment-panel").style.display === 'block') {
                document.getElementById("assignment-panel").style.display = 'none';

            }
            else {
                document.getElementById("assignment-panel").style.display = 'block';
            }

            data = $scope.assignments;

            table = document.getElementById("dataHolder");

            if (counter <= 0) {
                for (var key in data) {
                    row = table.insertRow(counter);
                    cell1 = row.insertCell(0);
                    cell1.innerHTML = " <img src='http://icons.iconarchive.com/icons/dtafalonso/yosemite-flat/512/Folder-icon.png' class='folder-images' style='width: 50px;height: 50px;'/> " +key;
                    counter++;



                }
            }
        })


        $scope.saveAssignments = function(id,name,code){
            student.child(name).set({
                Starter : code
            })
        };


        var auth = firebase.auth();

        window.onload = auth.onAuthStateChanged(function (user) {
            if (user) {
                $scope.userData.email = user.email.split('@')[0];
                closeLogin();
                $scope.getUserInfo(user.uid);
                $scope.getAssignments(user.uid);
            } else {
                // User logged out
            }
        });


    }]);