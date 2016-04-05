// Generated by CoffeeScript 1.10.0
(function() {
  var Block, Radius, TheBlockList,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Radius = window.Radius;

  TheBlockList = Radius.TheBlockList;

  Block = Radius.Block;

  Radius.Box = (function() {
    Box.attachableBox = null;

    Box.blockEnder = -1;

    Box.targetID = 0;

    Box.nextID = 200;

    function Box(name1, parentDivID, parm11, parm21) {
      this.name = name1;
      this.parentDivID = parentDivID;
      this.parm1 = parm11;
      this.parm2 = parm21;
      this.onDragStop = bind(this.onDragStop, this);
      this.onDrag = bind(this.onDrag, this);
      this.deleted = false;
      this.parentBlock = null;
      this.isABox = true;
      this.dragInProgress = false;
      this.isAPrototype = this.parentDivID === "PrototypesPane";
      if (this.parm1 == null) {
        this.parm1 = "";
      }
      if (this.parm2 === null) {
        this.parm2 = "";
      }
      this.id = "" + (Box.nextID++);
      if (this.name === "bar") {
        $("<div id='" + this.id + "' class='bar'></div>").appendTo($('#' + this.parentDivID));
        return;
      }
      if (this.name.startsWith("end")) {
        $("<div id='" + this.id + "' class='box'>" + "<span class='commandname'>" + this.name + "</span></div>").appendTo($('#' + this.parentDivID));
        return;
      }
      $("<div id='" + this.id + "' class=" + (this.name === 'Start' ? "'startBox box'>" : "'box'>") + "<span class='commandname draghandle'>" + this.name + "</span>" + this.makeBlockInnards(this.name, this.parm1, this.parm2) + "</div>").appendTo($("#" + this.parentDivID)).draggable({
        handle: ".draghandle",
        drag: this.onDrag,
        stop: this.onDragStop
      });
    }

    Box.prototype.setPos = function(x, y) {
      var $div;
      $div = $('#' + this.id);
      $div.css({
        left: x,
        top: y
      });
      this.x = x;
      this.y = y;
      this.target();
      return this;
    };

    Box.prototype.onDrag = function(event, ui) {
      var bx;
      if (!this.dragInProgress) {
        if (this.isAPrototype) {
          bx = new Box(this.name, 'PrototypesPane').setPos(this.x, this.y);
          Radius.TheBlockList.addBlock(new Radius.Block(this));
        }
        this.parentBlock.split(this);
        this.parentBlock.flagAsDragged();
        $('.lastDragged').removeClass('lastDragged');
        this.dragInProgress = true;
      }
      this.parentBlock.moveTo(this, ui.position.left, ui.position.top);
      return this.lookForAttachable(event, ui);
    };

    Box.prototype.lookForAttachable = function(event, ui) {
      var attBox, block, i, len, ref;
      $('.attachable').removeClass('attachable');
      if (this.name === 'Start') {
        return;
      }
      Box.attachableBox = null;
      ref = Radius.TheBlockList.blocks;
      for (i = 0, len = ref.length; i < len; i++) {
        block = ref[i];
        attBox = block.findAttachable(this);
        if (attBox != null) {
          Box.attachableBox = attBox;
          $('#' + attBox.id).addClass('attachable');
          return;
        }
      }
    };

    Box.prototype.okToAttach = function(box1) {
      return true;
      if (this.name === "else") {
        if (box1.name === "if") {
          return true;
        }
        if (box1.nextBox != null) {
          return false;
        }
        return box1.higherIf() != null;
      }
      return true;
    };

    Box.prototype.higherIf = function() {
      if (this.name === "if") {
        return this;
      }
      if (this.prevBox != null) {
        return this.prevBox.higherIf();
      } else {
        return null;
      }
    };

    Box.prototype.onDragStop = function(event, ui, prototypeID) {
      var b2, x1, y1;
      this.dragInProgress = false;
      $('.beingDragged').removeClass('beingDragged').addClass('lastDragged');
      if (this.isAPrototype) {
        x1 = this.x + $('#PrototypesPane').offset().left - $('#ProgrammingPane').offset().left;
        y1 = this.y + $('#PrototypesPane').offset().top - $('#ProgrammingPane').offset().top;
        if (x1 >= 0 && y1 >= 0 && x1 < $('#ProgrammingPane').outerWidth() && y1 < $('#ProgrammingPane').outerHeight()) {
          $('#' + this.id).appendTo('#ProgrammingPane');
          this.setPos(x1, y1);
          this.isAPrototype = false;
          if (this.name === 'while' || this.name === 'if' || this.name === 'function') {
            this.parentBlock.addEnd();
          }
        } else {
          this.parentBlock.deleteBlock();
          return;
        }
      }
      if (Box.attachableBox != null) {
        Box.attachableBox.parentBlock.append(Box.attachableBox, this);
        $('.attachable').removeClass('attachable');
        return;
      }
      if (this.x < -10 || this.y < -10) {
        this.parentBlock.deleteBlock();
        return;
      }
      return;
      b2 = Box.attachableBox;
      while (b2.prevBox != null) {
        b2 = b2.prevBox;
      }
      Box.blockEnder = -1;
      b2.setPos(b2.x, b2.y);
      Box.attachableBox = null;
      return $('.attachable').removeClass('attachable');
    };

    Box.prototype.getRight = function() {
      return this.x + $('#' + this.id).width();
    };

    Box.prototype.getBottom = function() {
      return this.y + $('#' + this.id).outerHeight();
    };

    Box.prototype.target = function() {
      if (this.prototype) {
        return;
      }
      $('.target').removeClass('target');
      $('#' + this.id).addClass('target');
      return Box.targetID = this.id;
    };

    Box.prototype.makeBlockInnards = function(name, parm1, parm2) {
      if (parm1 == null) {
        parm1 = "";
      }
      if (parm2 == null) {
        parm2 = "";
      }
      switch (name) {
        case 'show':
        case 'do':
          return "<div class='parm editable long' spellcheck='false' contentEditable='true'>" + parm1 + "</div>";
        case 'clear':
        case 'else':
        case 'Start':
          return '';
        case 'if':
        case 'while':
        case 'return':
        case 'function return':
          return "<div class='parm editable medium' spellcheck='false' contentEditable='true'>" + parm1 + "</div>";
        case 'assign':
          return "<div class='parm editable short' spellcheck='false' contentEditable='true'>" + parm1 + "</div>" + "<div class='parm2 editable medium' spellcheck='false' contentEditable='true'>" + parm2 + "</div>";
        case 'function':
          return "<div class='parm editable medium' spellcheck='false' contentEditable='true'>" + parm1 + "</div>" + "<div class='parm2 editable medium' spellcheck='false' contentEditable='true'>" + parm2 + "</div>";
        default:
          return "**UNKNOWN NAME**";
      }
    };

    Box.prototype.flagError = function(whichParm, start, length) {
      var errorParm, newtext, text;
      if (whichParm === 1) {
        errorParm = $('#' + this.id).find(".parm");
      } else {
        errorParm = $('#' + this.id).find(".parm2");
      }
      if (length === 0) {
        return errorParm.addClass("errorEmptyParm");
      } else {
        text = errorParm.text();
        newtext = text.slice(0, start) + "<span class='errorTextHighlight'>" + text.slice(start, start + length) + "</span>" + text.slice(start + length);
        errorParm.html(newtext);
        return errorParm.addClass('errorParm');
      }
    };

    return Box;

  })();

}).call(this);