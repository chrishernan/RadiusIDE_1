/**
 * Created by christianhernandez on 5/11/16.
 */
$(function () {

    $("#resources-panel").mouseenter(function() {
        var image = document.getElementById("plus-sign-image");
        image.style.opacity= "0.2";
    });

    $("#resources-panel").mouseleave(function() {
        var image = document.getElementById("plus-sign-image");
        image.style.opacity = ".5";
    });


    $("#splash-screen-button").click(function () {
        $("#splash-screen").fadeOut();
    });

    $("#splash-screen").click(function (){
        $("#splash-screen").fadeOut();
    });


});