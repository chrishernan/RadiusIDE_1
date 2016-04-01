// Generated by CoffeeScript 1.6.3
(function() {
  var Box, Command, Radius;

  Radius = window.Radius;

  Command = Radius.Command;

  Box = Radius.Box;

  Radius.CommandOnReady = function() {
    var bx, c, commands, left, offset, top, _i, _len;
    console.log("in Radius.CommandOnReady");
    commands = ['clear', 'show', 'while', 'assign', 'if', 'else', 'function', 'function return', 'do'];
    offset = $('#CommandsPane').offset();
    left = offset.left + 10;
    top = offset.top + 10;
    for (_i = 0, _len = commands.length; _i < _len; _i++) {
      c = commands[_i];
      bx = new Box(c, 'CommandsPane').setPos(left, top);
      top += $('#' + bx.id).outerHeight() + 10;
    }
    return $('#PageBody').on("dblclick", ".draghandle", function(event) {
      var boxID, dblclickbox;
      boxID = $(event.target).parent().attr("id");
      console.log('id', boxID);
      event.stopPropagation();
      dblclickbox = Radius.allBoxes.find(boxID);
      return dblclickbox.onDoubleClick();
    });
  };

}).call(this);
