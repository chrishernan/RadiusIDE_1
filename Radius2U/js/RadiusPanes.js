$(function() {
  //make all panes draggable and snapable and contained in #window
  $(".draggable").draggable({
    snap: ".ui-widget-header",
    handle: '.simple-title',
    containment: "parent"

  }).resizable({
    grid: 5
  });

  //All buttons in Toolbar
  $("button:first").button({
    label: "LogIn",
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

document.addEventListener('mouseup', onUp);


document.getElementById("programming").addEventListener('mousedown', onDown);
document.getElementById("control-panel").addEventListener('mousedown', onDown);
document.getElementById("program-output").addEventListener('mousedown', onDown);
var st;
var id;

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
  if(id.style.left =='0px'){
  setBounds(id, 0, 0, 25, 100);
  }
  //snap to top-right
  else if(id.style.top =='0px' && $('#window').width() - (st.offset().left + st.width())<3){
  setBounds(id, 25, 0, 75, 55);
  }
  //snap to bottom-right
    else if(($('#window').height() - (st.offset().top + st.height()))<3 && $('#window').width() - (st.offset().left + st.width())<3){
  setBounds(id, 25, 55, 75, 45);
  }
}

var login =document.getElementById("login-pop");
document.getElementById("b-login").addEventListener('click', onLogin);

function onLogin(event){
  login.style.visibility = "visible";
}

document.getElementById("close").addEventListener("mousedown", onDown)

document.getElementById("close").addEventListener("mouseup", closeOnClick)

function closeOnClick(event){
  document.getElementById($(this).closest('.pop').attr("id")).style.visibility="hidden";
}



//$("close").addEventListener("click",closeOnClick);


});