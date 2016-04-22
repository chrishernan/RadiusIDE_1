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


    //All buttons in Toolbar
    $("#b-login").button({icons: {primary: "ui-icon-arrowthickstop-1-e"},});
    $("#b-new").button({icons: {primary: "ui-icon-document"}});
    $("#b-classes").button({icons: {primary: "ui-icon-script",}});
    $("#b-trash").button({icons: {primary: "ui-icon-trash",},});
    $("#b-lock").button({icons: {primary: "ui-icon-locked",},});
    $("#b-settings").button({icons: {primary: "ui-icon-gear",},});
    $("#b-run").button({icons: {primary: "ui-icon-play",},});
    $("#b-stop").button({icons: {primary: "ui-icon-stop",},});
    $("#b-signout").button();


});