$(function () {

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

    $("#window").droppable({

    })

    //revert draggable div back to original position when div is moved to toolbar

    $('#tool-bar').droppable({
        greedy: true,
        drop: function(event,ui){
            ui.draggable.draggable('option','revert',true);
        }
    });


    $('#window').droppable({

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

    function show(id) {
        $(id).style.display = 'block';
    }

    function hide(id) {
        $(id).style.display = 'none';
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

    function onDown() {
//save element when click 
//not sure if this is really needed
        st = $(this);
        id = document.getElementById(st.attr('id'));
//bring div to the front
        st.parent().append(st);

    }

    function onUp() {

        if (st != "undefined") { // prevent buttons from calling this
            //snap the left
            if (st.offset().left <= 3) {
                setBounds(id, 0, 0, 25, 100);
            }
            //snap to top-right
            else if (st.offset().top <= 100 && $('#window').width() - (st.offset().left + st.width()) < 5) {
                setBounds(id, 25, 0, 75, 55);
            }
            //snap to bottom-right
            else if (($('#window').height() - (st.offset().top + st.height())) < 5 && $('#window').width() - (st.offset().left + st.width()) < 5) {
                setBounds(id, 25, 55, 75, 45);
            }
        }


    }


});