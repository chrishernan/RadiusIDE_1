var control_width=310;
var control_height=640;
var editing_width = 960;
var editing_height = 315;
var console_width = 960;
var console_height = 200;
var b_pane_width = 960;
var b_pane_height =55;

var control_Panel_content = $();


var button_p = jQuery.jsPanel({
	title: "Button Pane",
	id: "button",
	position: "top right",
	size: {width:b_pane_width,height:b_pane_height},
	
});

/*
var control_p = jQuery.jsPanel( {
	content: function() {
		$(this).load('/Users/christianhernandez/RadiusIDE_1/Radius2U/Radius2.css" rel="stylesheet" type="text/css">");
		},
	title: "Control Pane",
	id: 'control',
	position: "bottom left",
	size: {width:control_width , height:control_height},
	theme: "black"
});

var editing_p = jQuery.jsPanel( {
	title:"Editing Pane",
	id:'editing',
	offset:{top:240,left:0},
	position: "bottom right",
	size: {width:editing_width,height:editing_height},
	theme: "black"

});

*/

var console_p = jQuery.jsPanel( {
	title: "Console Pane",
	id:'console',
	position: "bottom right",
	size: {width:console_width,height:console_height},
	
});
/*
var new_image = document.createElement("input"); 
var save_image =document.createElement("input"); 
var submit_image = document.createElement("input"); 
var open_image = document.createElement("input"); 
var run_image = document.createElement("input"); 

new_image.src = "http://www.clker.com/cliparts/s/k/F/o/d/h/new-file.svg";
open_image.src = "/Users/christianhernandez/Downloads/1270668950.png";
submit_image.src = "http://www.clker.com/cliparts/9/3/e/f/14144256491614649893green_submit_button_by_rukiaxichigo152.jpg";
save_image.src = "http://icons.iconseeker.com/ico/toolbar-icons/save.ico";

new_image.type = "image";
open_image.type = "image;
submit_image.type = "image;
save_image.type = "image";

*/
button_p.content.append('<button>new</p>');
button_p.content.append('<button>submit</p>');
button_p.content.append('<button>open</p>');
button_p.content.append('<button>save</p>');
button_p.content.append('<button>RUN</p>');





control_p.on("jspanelstatechange", function(){
		console_p.resize(200,550);
		editing_p.resize(200,550);
});