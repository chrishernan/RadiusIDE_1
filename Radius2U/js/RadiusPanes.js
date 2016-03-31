$(function() {
  $("#programming").draggable({
    snap: ".ui-widget-header",
    handle: '.simple-title',
    containment: "parent"

  }).resizable({
    grid: 5
  });

  $("#program-output").draggable({
    snap: ".ui-widget-header",
    handle: '.simple-title',
    containment: "parent"
  }).resizable({
    grid: 5
  });
  $("#control-panel").draggable({
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

function setBounds(element, l, t, w, h) {
  element.style.left = l + '%';
  element.style.top = t + '%';
  element.style.width = w + '%';
  element.style.height = h + '%';
}
var id = "control-panel";
function setID(e){
  id = e.target.id;
  alert(id);
}

function hintHide(ghost) {
  ghost.style.opacity = 0;
}

var topRight = document.getElementById('top-right');
var bottomRight = document.getElementById('bottom-right');
var left = document.getElementById('left');

//hintHide(topRight);
//hintHide(bottomRight);
//hintHide(left);
document.getElementById("programming").addEventListener('mouseup', onUp);
document.getElementById("control-panel").addEventListener('mouseup', onUp);
document.getElementById("program-output").addEventListener('mouseup', onUp);

document.getElementById("programming").addEventListener('mousedown', onDown);
document.getElementById("control-panel").addEventListener('mousedown', onDown);
document.getElementById("program-output").addEventListener('mousedown', onDown);
var st;
var id;
function onDown(e){
st = $(this);
id = document.getElementById(st.attr('id'));

}

function onUp(e){
//alert($('#window').width());
  if(id.style.left =='0px'){
  setBounds(id, 0, 0, 25, 100);
  }
  else if(id.style.top =='0px' && $('#window').width() - (st.offset().left + st.width())<3){
  setBounds(id, 25, 0, 75, 55);
  }
    else if(($('#window').height() - (st.offset().top + st.height()))<3 && $('#window').width() - (st.offset().left + st.width())<3){
  setBounds(id, 25, 55, 75, 45);
  }
}

});