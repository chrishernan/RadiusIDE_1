$(function () {

    $("#programming").resizable({ handles: 's' });
    $("#programming").bind("resize", function () {
        $('#program-output').height($('#window').height()-$("#programming").height());
        $('#program-output').css('top',$("#programming").height());
    });

    $("#control-panel").resizable({ handles: 'e', minWidth: 256 });
    $("#control-panel").bind("resize", function () {
        $('#programming').width($("#window").width()-$("#control-panel").width());
        $('#programming').css('left',$("#control-panel").width());
        $('#program-output').width($("#window").width()-$("#control-panel").width());
        $('#program-output').css('left',$("#control-panel").width());


    });


    //Changes the visibility of the assignments pane by a toggle button
    $('#b-assignments').click(function() {
        var table;
        var row;
        var cell1;
        var cell2;
        /*document.getElementById("assignment-panel").style.visibility= 'visible';
        if($("#assignment-panel").is(':hidden')){
            alert("in if");
            document.getElementById("assignment-panel").style.visibility= 'visible';
        }
        else {
            alert("in else");
            //document.getElementById("assignment-panel").style.visibility = 'hidden';

        }
        alert("end");*/
        if(document.getElementById("assignment-panel").style.display==='block') {
            document.getElementById("assignment-panel").style.display='none';
            document.getElementById("control-panel").style.display='block';

        }
        else {
            document.getElementById("assignment-panel").style.display='block';
            document.getElementById("control-panel").style.display='none';
        }

        var data = [{"name":"Assignment 1","due_date":"08/16/17"},{"name":"Assignment 2","due_date":"08/24/17"},{"name":"Assignment 3","due_date":"09/03/17"},{"name":"Assignment 4","due_date":"09/25/17"}];
        var counter = 0;

        table = document.getElementById("dataHolder");


        for(var key in data) {
            row = table.insertRow(counter);
            cell1 = row.insertCell(0);
            cell2 = row.insertCell(1);
            cell1.innerHTML = "<img src='/Users/christianhernandez/WebstormProjects/RadiusIDE_1/Radius2U/folder_icon.png'>";
            cell2.innerHTML = data[key].name;
            counter++;
        }

        /*
        table = $('.dataHolder').DataTable({
             rows: [
                {'name':'assignment 1'},
                {'name':'assignment 2'},
                {'name':'assignment 3'},
                {'name':'assignment 4'},
            ]
        });
        var data = {"assignments": [{"name":"Assignment 1"},{"name":"Assignment 2"},{"name":"Assignment 3"},{"name":"Assignment 4"}]};
    */
/*
        table.row.add([
            'Assignment 1',
            'Assignment 2' ,
            'Assignment 3',
            'Assignment 4'
        ]).draw(false);*/



    })

    $("#dataHolder").click(function () {
        alert("Due Date: TBA");

    })

    //All buttons in Toolbar
    $("#b-login").button({icons: {primary: "ui-icon-arrowthickstop-1-e"},});
    $("#b-new").button({icons: {primary: "ui-icon-document"}});
    $("#b-classes").button({icons: {primary: "ui-icon-script",}});
    $("#b-trash").button({icons: {primary: "ui-icon-trash",},});
    $("#b-lock").button({icons: {primary: "ui-icon-locked",},});
    $("#b-settings").button({icons: {primary: "ui-icon-gear",},});
    $("#b-run").button({icons: {primary: "u.i-icon-play",},});
    $("#b-stop").button({icons: {primary: "ui-icon-stop",},});
<<<<<<< HEAD
    $("#b-signout").button();
=======
    $("#b-assignments").button({icons:{primary: "ui-icon-folder-collapsed",},});

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

        if (st != "undefined") { // prevent buttons from calling this         //snap the left 
            if (st.offset().left <= 150) {
                setBounds(id, 0, 0, 25, 100);
            }
            //snap to top-right 
            else if ((st.offset().top <= 150 && $('#window').width() - (st.offset().left + st.width()) < 50) || (st.offset().left > 150 && st.offset().top <= 150)) {
                setBounds(id, 25, 0, 75, 55);
            }
            //snap to bottom-right 
            else if (($('#window').height() - (st.offset().top + st.height())) < 5 && $('#window').width() - (st.offset().left + st.width()) < 5) {
                setBounds(id, 25, 55, 75, 45);
            }
        }
    }
>>>>>>> origin/master


});