// Generated by CoffeeScript 1.10.0
(function() {
  var Box, Commands, Radius, VERTICAL_COMMAND_SEPARATION;

  Radius = window.Radius;

  Commands = Radius.Commands;

  Box = Radius.Box;

  VERTICAL_COMMAND_SEPARATION = 10;

  Radius.PrototypesOnReady = function() {
    var bx, c, commandNames, i, left, len, offset, top;
    console.log("in Radius.PrototypesOnReady");
    commandNames = ['clear', 'show', 'while', 'assign', 'if', 'else', 'function', 'function return', 'do'];
    offset = $('#PrototypesPane').offset();
    left = 10;
    top = VERTICAL_COMMAND_SEPARATION;
    for (i = 0, len = commandNames.length; i < len; i++) {
      c = commandNames[i];
      bx = new Box(c, 'PrototypesPane').setPos(left, top);
      top += $('#' + bx.id).outerHeight() + VERTICAL_COMMAND_SEPARATION;
    }
    return $('#PrototypesPane').on("dblclick", ".draghandle", function(event) {
      var boxID, dblclickbox;
      Radius.clearErrors(false);
      boxID = $(event.target).parent().attr("id");
      event.stopPropagation();
      dblclickbox = Radius.TheBlockList.findPrototypeBoxByID(boxID);
      return dblclickbox.onPrototypeDoubleClick();
    });
  };

}).call(this);
