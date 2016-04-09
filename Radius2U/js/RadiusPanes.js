$(function() {

  var accountType;
  //var Firebase = require("firebase");

  var url = "https://radius-ide.firebaseio.com/"
  var ref = new Firebase(url);

//var FirebaseTokenGenerator = require("firebase-token-generator");
//var tokenGenerator = new FirebaseTokenGenerator("<YOUR_FIREBASE_SECRET>");
//var token = tokenGenerator.createToken({ uid: "uniqueId1", some: "arbitrary", data: "here" });


  //make all panes draggable and snapable and contained in #window
  $(".draggable").draggable({
    snap: ".pane",
    handle: '.simple-title',

  }).resizable({
    grid: 5
  });

  //All buttons in Toolbar
   $("button:first").button({
    icons: {
      primary: "ui-icon-arrowthickstop-1-e"
    },
  }).next().button({
    icons: {
      primary: "ui-icon-document"
    }
  }).next().button({
    icons: {
      primary: "ui-icon-script",
    }
  }).next().button({
    icons: {
      primary: "ui-icon-trash",
    },
  }).next().button({
    icons: {
      primary: "ui-icon-help",
    },
  }).next().button({
    icons: {
      primary: "ui-icon-locked",
    },

  }).next().button({
    icons: {
      primary: "ui-icon-gear",
    },
  }).next().button({
    icons: {
      primary: "ui-icon-play",
    },
  }).next().button({
    icons: {
      primary: "ui-icon-stop",
    },
  });

function  show(id) {
  $(id).style.display ='block';
}
function hide(id) {
  $(id).style.display ='none';
}

//change dimension of div 
//mostly used for snaping
function setBounds(element, l, t, w, h) {
  element.style.left = l + '%';
  element.style.top = t + '%';
  element.style.width = w + '%';
  element.style.height = h + '%';
}

//hide the ghostpanes
function hintHide(ghost) {
  ghost.style.opacity = 0;
}

var topRight = document.getElementById('top-right');
var bottomRight = document.getElementById('bottom-right');
var left = document.getElementById('left');

//hintHide(topRight);
//hintHide(bottomRight);
//hintHide(left);

document.getElementById("window").addEventListener('mouseup', onUp);
document.getElementById("tool-bar").addEventListener('mouseup', onUp);


document.getElementById("programming").addEventListener('mousedown', onDown);
document.getElementById("control-panel").addEventListener('mousedown', onDown);
document.getElementById("program-output").addEventListener('mousedown', onDown);
var st = "undefined";
var id = "undefined";

function onDown(){
//save element when click 
//not sure if this is really needed
st = $(this);
id = document.getElementById(st.attr('id'));
//bring div to the front
st.parent().append(st);

}

function onUp(){
//sanp the left
if(st!="undefined"){
  if(st.offset().left <=3){
  setBounds(id, 0, 0, 25, 100);
  }
  //snap to top-right
  else if(st.offset().top <=100 && $('#window').width() - (st.offset().left + st.width())<5){
  setBounds(id, 25, 0, 75, 55);
  }
  //snap to bottom-right
    else if(($('#window').height() - (st.offset().top + st.height()))<5 && $('#window').width() - (st.offset().left + st.width())<5){
  setBounds(id, 25, 55, 75, 45);
  }
}


}



var signup = document.getElementById("signup-form");
var loginEnter = document.getElementById("login-enter");

loginEnter.addEventListener('click',authOnClick);
$("#b-login")[0].addEventListener('click', onLogin);
$("#signup-enter")[0].addEventListener("click",showSignUp);

function onLogin(){
  $("#login-pop").css("display","block");
}

//document.getElementById("login-close").addEventListener("mousedown", onDown)

//document.getElementById("login-close").addEventListener("mouseup", closeOnClick)

$("#login-close")[0].addEventListener("click",closeOnClick)
$("#signup-close")[0].addEventListener("click",closeOnClick)
$("#signup-submit")[0].addEventListener("click",createAccount)
$("#b-signout")[0].addEventListener("click",signOut)

function closeOnClick(){
  $("#login-pop").hide();
  $("#signup-form").hide();
}



function authOnClick(){
  ref.authWithPassword({
    email: document.getElementById("email").value,
    password: document.getElementById("password").value 
  }, function(error, authData) {
    if(error){
      document.getElementById('alert').innerHTML = "Login Failed:" + error;
      document.getElementById('alert').style.visibility = "visible";
    } else {
      $("#login-pop").hide();
      var demail = document.getElementById("email").value.split('@');
      document.getElementById('user').innerHTML = demail[0];
      $("#user-form").show();
      $("#b-signout").show();


    }
  });

}

function showSignUp(){
   $("#signup-form").css("display","block");
}

var studentref;

function createAccount(){
  var studentName = document.getElementById("name");
  var Email = document.getElementById("email1").value;
  var femail = Email.split("@");
    var courseCode = document.getElementById("course-code");
    url += "Courses/" +courseCode.value+"/";
    studentref = new Firebase(url);


  ref.createUser({
  email    : document.getElementById("email1").value,
  password : document.getElementById("password1").value 
}, function(error, userData) {
  if (error) {
      document.getElementById('alert1').innerHTML = "Error creating user:"+ error;
      document.getElementById('alert1').style.visibility = "visible";
  } else {
        if (!isNaN(courseCode.value) && courseCode.value.length==5){
        accountType = "student";
        document.getElementById('user').innerHTML = femail[0];
        studentref.child(userData.uid).set({
            name: document.getElementById("name").value,
            cCode: courseCode.value,
            email: Email
        })

      }
      $("#login-pop").hide();
      $("#user").show();
  }
});
}

function signOut(){
  ref.unauth();
   $("#user-form").hide();

}



});