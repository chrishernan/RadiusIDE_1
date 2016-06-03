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

    Box.swoopTargetBox = null;

    Box.nextID = 200;

    function Box(name1, parentDivID, parm11, parm21) {
      this.name = name1;
      this.parentDivID = parentDivID;
      this.parm1 = parm11;
      this.parm2 = parm21;
      this.onPrototypeDoubleClick = bind(this.onPrototypeDoubleClick, this);
      this.onDragStop = bind(this.onDragStop, this);
      this.onDrag = bind(this.onDrag, this);
      this.onDragStart = bind(this.onDragStart, this);
      this.deleted = false;
      this.parentBlock = null;
      this.isABox = true;
      this.isAPrototype = this.parentDivID === "PrototypesPane";
      if (this.parm1 == null) {
        this.parm1 = "";
      }
      if (this.parm2 == null) {
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
        start: this.onDragStart,
        drag: this.onDrag,
        stop: this.onDragStop
      });
      if (this.isAPrototype) {
        Radius.TheBlockList.addPrototypeBlock(this);
      }
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
      if (!this.isAPrototype) {
        this.setSwoopTarget();
      }
      return this;
    };

    Box.prototype.onDragStart = function() {
      var bx;
      Radius.dragInProgress = true;
      if (this.isAPrototype && (this.name === 'function' || this.name === 'function return' || this.name === 'do')) {
        $('#' + this.id).draggable('destroy');
        return;
      }
      if (this.isAPrototype) {
        Radius.TheBlockList.removePrototypeBlock(this);
        bx = new Box(this.name, 'PrototypesPane').setPos(this.x, this.y);
        Radius.TheBlockList.addBlock(new Radius.Block(this));
      }
      this.parentBlock.split(this);
      this.parentBlock.flagAsDragged();
      $('.lastDragged').removeClass('lastDragged');
      $('.lastDragged').removeClass('lastPasted');
      return $('.selected').removeClass('selected');
    };

    Box.prototype.onDrag = function(event, ui) {
      this.parentBlock.moveTo(ui.position.left, ui.position.top);
      return this.lookForAttachable(event, ui);
    };

    Box.prototype.lookForAttachable = function(event, ui) {
      var attBox, block, i, len, ref;
      $('.attachable').removeClass('attachable');
      Box.attachableBox = null;
      if (this.name === 'Start') {
        return;
      }
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
      if (this.name === "else") {
        if (box1.name === "if" && box1.ifHasNoElse()) {
          return true;
        }
        if (box1.controlledByIfWithoutElse()) {
          return true;
        }
        return false;
      }
      return true;
    };

    Box.prototype.ifHasNoElse = function() {
      var b, i, len, ref;
      if (this.parentBlock == null) {
        console.log("this if has no parent block:", this);
        return false;
      }
      ref = this.parentBlock.list;
      for (i = 0, len = ref.length; i < len; i++) {
        b = ref[i];
        if (b.name === 'else') {
          return false;
        }
      }
      return true;
    };

    Box.prototype.controlledByIfWithoutElse = function() {
      var b, i, len, ref;
      if ((this.parentBlock != null) && (this.parentBlock.parentBlock != null) && (this.parentBlock.parentBlock.list[0].name = 'if')) {
        ref = this.parentBlock.parentBlock.list;
        for (i = 0, len = ref.length; i < len; i++) {
          b = ref[i];
          if (b.name === 'else') {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    };

    Box.prototype.onDragStop = function(event, ui, prototypeID) {
      var x1, y1;
      Radius.dragInProgress = false;
      $('.beingDragged').removeClass('beingDragged').addClass('lastDragged');
      if (this.isAPrototype) {
        x1 = this.x + $('#PrototypesPane').offset().left - $('#ProgrammingPane').offset().left;
        y1 = this.y + $('#PrototypesPane').offset().top - $('#ProgrammingPane').offset().top;
        if (x1 >= 0 && y1 >= 0 && x1 < $('#ProgrammingPane').outerWidth() && y1 < $('#ProgrammingPane').outerHeight()) {
          $('#' + this.id).appendTo('#ProgrammingPane');
          this.setPos(x1, y1);
          this.isAPrototype = false;
          this.parentDivID = 'ProgrammingPane';
          if (this.name === 'while' || this.name === 'if' || this.name === 'else' || this.name === 'function') {
            this.parentBlock.addEnd();
          }
        } else {
          this.parentBlock.deleteBlock();
          Radius.checkPoint();
          return;
        }
      }
      if (Box.attachableBox != null) {
        Box.attachableBox.parentBlock.append(Box.attachableBox, this);
        $('.attachable').removeClass('attachable');
        Radius.checkPoint();
        return;
      }
      if (this.x < -10 || this.y < -10) {
        this.parentBlock.deleteBlock();
        Radius.checkPoint();
        return;
      }
      Radius.checkPoint();
    };

    Box.prototype.onPrototypeDoubleClick = function() {
      return this.swoopTo();
    };

    Box.prototype.swoopTo = function() {
      var goalx, goaly;
      if (Box.swoopTargetBox == null) {
        return;
      }
      goalx = $('#ProgrammingPane').offset().left - $('#PrototypesPane').offset().left + Box.swoopTargetBox.x;
      goaly = $('#ProgrammingPane').offset().top - $('#PrototypesPane').offset().top + Box.swoopTargetBox.getBottom() - 1;
      this.onDragStart();
      return this.takeAStep(50, goalx, goaly);
    };

    Box.prototype.takeAStep = function(stepsLeft, destX, destY) {
      var fake_ui;
      if (stepsLeft === 0) {
        this.onDragStop();
        return;
      }
      fake_ui = {
        position: {
          left: this.x + (destX - this.x) / stepsLeft,
          top: this.y + (destY - this.y) / stepsLeft
        }
      };
      this.onDrag(null, fake_ui);
      setTimeout(((function(_this) {
        return function() {
          return _this.takeAStep(stepsLeft - 1, destX, destY);
        };
      })(this)), 10);
      return true;
    };

    Box.prototype.matchingEnd = function() {
      var p;
      if (this.name === 'if' || this.name === 'while' || this.name === 'function') {
        p = this.parentBlock.list.indexOf(this);
        if (p === -1) {
          console.log('**ERROR in Box.matchingEnd(), could not find', this, 'in', this.parentBlock);
        }
        return this.parentBlock.list[p + 3];
      } else {
        return null;
      }
    };

    Box.prototype.matchingBar = function() {
      var p;
      if (this.name === 'if' || this.name === 'while' || this.name === 'function') {
        p = this.parentBlock.list.indexOf(this);
        if (p === -1) {
          console.log('**ERROR in Box.matchingBar(), could not find', this, 'in', this.parentBlock);
        }
        return this.parentBlock.list[+1];
      } else {
        return null;
      }
    };

    Box.prototype.getRight = function() {
      return this.x + $('#' + this.id).width();
    };

    Box.prototype.getBottom = function() {
      return this.y + $('#' + this.id).outerHeight();
    };

    Box.prototype.setSwoopTarget = function() {
      $('.swoopTarget').removeClass('swoopTarget');
      $('#' + this.id).addClass('swoopTarget');
      return Box.swoopTargetBox = this;
    };

    Box.prototype.getParms = function() {
      this.parm1 = $('#' + this.id + " .parm").text();
      return this.parm2 = $('#' + this.id + " .parm2").text();
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
