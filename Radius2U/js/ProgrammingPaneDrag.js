// Generated by CoffeeScript 1.10.0
(function() {
  var INDENT_AMOUNT, Radius, SetupDroppable, align2, alignEntireBlock, alignTopPos, attach, attachableCandidateID, availableIFfor, connectsToFunction, connectsToStart, deleteOnDrop, exists, getNextID, initialEndGap, lastDraggedDiv, lookForAttachable, okToDropHere, onDrag, overCommandList, removeCR, removeCRcallback, scrLeft, scrTop, setPosition, setUpClone, shift;

  Radius = window.Radius;

  INDENT_AMOUNT = 14;

  initialEndGap = 25;

  attachableCandidateID = null;

  lastDraggedDiv = null;

  scrTop = 0;

  scrLeft = 0;

  Radius.ProgrammingPaneDragOnReady = function() {
    SetupDroppable();
    $('.draggable1').each(function(index, value) {
      return $(value).draggable({
        drag: function(event, ui) {
          return lookForAttachable(event, ui);
        },
        helper: function(event, ui) {
          return $(this).clone().appendTo('body').css('zIndex', 5).show();
        }
      });
    });
    $('#ProgrammingPane').on("scroll", function(event) {
      scrTop = $('#ProgrammingPane').scrollTop();
      return scrLeft = $('#ProgrammingPane').scrollLeft();
    });
    return Radius.SetUpDragability();
  };

  Radius.SetUpDragability = function() {
    $('.draggable2').draggable({
      start: function(event, ui) {
        $(this).attr('rad-startLeft', $(this).position().left);
        return $(this).attr('rad-startTop', $(this).position().top);
      },
      drag: onDrag,
      handle: '.draghandle',
      zIndex: 100
    });
    $('.draggable2').find(".editable").keypress(function(event) {
      if (event.which === 10 || event.which === 13) {
        return event.preventDefault();
      }
    });
  };

  getNextID = function() {
    var n;
    n = +$('#nextID').attr('nextID');
    $('#nextID').attr('nextID', n + 1);
    return n;
  };

  shift = function(theDiv, x, y) {
    var currLeft, currTop;
    currTop = parseFloat(theDiv.css("top"));
    currLeft = parseFloat(theDiv.css("left"));
    theDiv.css("top", currTop + y);
    return theDiv.css("left", currLeft + x);
  };

  setPosition = function(theDiv, x, y) {
    theDiv.css("top", y);
    return theDiv.css("left", x);
  };

  exists = function(theDiv, attrString) {
    if (theDiv.attr == null) {
      console.log("ProgrammingPaneDrag.exists: theDiv?", theDiv, attrString);
    }
    return (theDiv.attr(attrString) != null) && theDiv.attr(attrString).length;
  };

  onDrag = function(event, ui) {
    var attachedDiv, changes, i, len, parentDiv, ref, topDragDiv, xDelta, yDelta;
    topDragDiv = $(ui.helper);
    topDragDiv.css("z-index", 200);
    xDelta = ui.position.left - topDragDiv.attr('rad-startLeft');
    yDelta = ui.position.top - topDragDiv.attr('rad-startTop');
    topDragDiv.attr('rad-startLeft', ui.position.left);
    topDragDiv.attr('rad-startTop', ui.position.top);
    if (exists(topDragDiv, 'rad-parent')) {
      parentDiv = $('#' + topDragDiv.attr('rad-parent'));
      parentDiv.attr('rad-child', '');
      topDragDiv.attr('rad-parent', '');
      alignEntireBlock(parentDiv);
      changes = true;
    } else if (exists(topDragDiv, 'rad-if')) {
      $('#' + topDragDiv.attr('rad-if')).attr('rad-else', '');
      topDragDiv.attr('rad-if', '');
      $('#' + topDragDiv.attr('rad-bar')).hide();
    }
    ref = Radius.getAttachedDivs(topDragDiv);
    for (i = 0, len = ref.length; i < len; i++) {
      attachedDiv = ref[i];
      attachedDiv.css("z-index", 200);
      shift(attachedDiv, xDelta, yDelta);
    }
    if (!exists(topDragDiv, 'rad-hastobefirst')) {
      lookForAttachable(event, ui);
    }
  };

  Radius.getAttachedDivs = function(topDiv) {
    var currentDiv, divsToSee, result;
    result = [];
    divsToSee = [topDiv];
    currentDiv = null;
    while ((currentDiv = divsToSee.pop()) != null) {
      while (currentDiv != null) {
        result.push(currentDiv);
        if (exists(currentDiv, 'rad-bar')) {
          result.push($("#" + currentDiv.attr('rad-bar')));
        }
        if (exists(currentDiv, 'rad-end')) {
          divsToSee.push($("#" + currentDiv.attr('rad-end')));
        }
        if (exists(currentDiv, 'rad-else')) {
          divsToSee.push($("#" + currentDiv.attr('rad-else')));
        }
        if (exists(currentDiv, 'rad-child')) {
          currentDiv = $("#" + currentDiv.attr('rad-child'));
        } else {
          currentDiv = null;
        }
      }
    }
    return result;
  };

  lookForAttachable = function(event, ui) {
    var closeEnough, draggedDiv, thisLeft, thisTop;
    draggedDiv = $(ui.helper);
    closeEnough = 10;
    thisTop = parseFloat(draggedDiv.css('top'));
    thisLeft = parseFloat(draggedDiv.css('left'));
    if (draggedDiv.hasClass("draggable1")) {
      thisTop = thisTop - $("#ProgrammingPane").offset().top + scrTop + 9;
      thisLeft = thisLeft - $("#ProgrammingPane").offset().left + scrLeft + 5;
    }
    $('.attachable').removeClass("attachable");
    attachableCandidateID = null;
    return $('.draggable2').each(function(index, value) {
      var candidateDiv, letsAttach, thatBottom, thatLeft, thatRight;
      candidateDiv = $(value);
      if (candidateDiv.attr("id") === draggedDiv.attr("id")) {
        return true;
      }
      if (!okToDropHere(candidateDiv, draggedDiv)) {
        return true;
      }
      thatBottom = (parseFloat(candidateDiv.css('top'))) + candidateDiv.outerHeight();
      thatLeft = parseFloat(candidateDiv.css('left'));
      thatRight = thatLeft + candidateDiv.width();
      letsAttach = false;
      if (thisTop <= thatBottom + closeEnough && thisTop >= thatBottom - closeEnough && thisLeft >= thatLeft - closeEnough && thisLeft <= thatRight + closeEnough) {
        letsAttach = true;
      }
      if (letsAttach && attachableCandidateID === null) {
        candidateDiv.addClass("attachable");
        attachableCandidateID = candidateDiv.attr('id');
        return false;
      }
    });
  };

  attach = function(parentID, childID) {
    var changes, childDiv, grandchildID, ifparent, parentDiv;
    changes = true;
    parentDiv = $("#" + parentID);
    childDiv = $("#" + childID);
    if (exists(parentDiv, 'rad-child')) {
      grandchildID = parentDiv.attr('rad-child');
    } else {
      grandchildID = '';
    }
    parentDiv.attr('rad-child', childDiv.attr("id"));
    childDiv.attr('rad-parent', parentDiv.attr("id"));
    if (grandchildID !== '') {
      childDiv.attr('rad-child', grandchildID);
      $('#' + grandchildID).attr('rad-parent', childID);
    }
    $('.draggable2').each(function(index, value) {
      return ($(value)).css("z-index", 100);
    });
    if (childDiv.hasClass("ELSE")) {
      parentDiv.attr('rad-child', '');
      childDiv.attr('rad-parent', '');
      ifparent = parentDiv;
      while (true) {
        if (ifparent.hasClass("IF")) {
          ifparent.attr('rad-else', childID);
          childDiv.attr('rad-if', ifparent.attr('id'));
          alignEntireBlock(ifparent);
          return;
        }
        if (exists(ifparent, 'rad-parent')) {
          ifparent = $('#' + ifparent.attr('rad-parent'));
        } else {
          console.log("**Couldn't find ifparent for", childID);
          return;
        }
      }
    }
    return alignEntireBlock(parentDiv);
  };

  alignTopPos = 0;

  alignEntireBlock = function(div) {
    var leftPos, topDiv;
    topDiv = div;
    while (true) {
      if (exists(topDiv, 'rad-parent')) {
        topDiv = $("#" + (topDiv.attr('rad-parent')));
      } else if (exists(topDiv, 'rad-if')) {
        topDiv = $("#" + (topDiv.attr('rad-if')));
      } else {
        break;
      }
    }
    leftPos = parseFloat(topDiv.css('left'));
    alignTopPos = parseFloat(topDiv.css('top'));
    return align2(topDiv, leftPos);
  };

  align2 = function(theDiv, leftPos) {
    var barDiv, barHeight, currDiv, elseDiv, endDiv;
    currDiv = theDiv;
    while (currDiv != null) {
      setPosition(currDiv, leftPos, alignTopPos);
      alignTopPos += currDiv.outerHeight() + -1;
      if (exists(currDiv, 'rad-end')) {
        barDiv = $('#' + currDiv.attr('rad-bar'));
        endDiv = $('#' + currDiv.attr('rad-end'));
        setPosition(barDiv, leftPos, alignTopPos);
        if (exists(currDiv, 'rad-child')) {
          align2($('#' + currDiv.attr('rad-child')), leftPos + INDENT_AMOUNT);
        } else {
          alignTopPos += initialEndGap;
        }
        barHeight = alignTopPos - parseFloat(barDiv.css('top'));
        barDiv.height(barHeight);
        if (exists(currDiv, 'rad-else')) {
          elseDiv = $('#' + currDiv.attr('rad-else'));
          setPosition(elseDiv, leftPos, alignTopPos);
          alignTopPos += elseDiv.outerHeight() + -1;
          barDiv = $('#' + elseDiv.attr('rad-bar'));
          setPosition(barDiv, leftPos, alignTopPos);
          if (exists(elseDiv, 'rad-child')) {
            align2($('#' + elseDiv.attr('rad-child')), leftPos + INDENT_AMOUNT);
          } else {
            alignTopPos += 5;
          }
          barHeight = alignTopPos - parseFloat(barDiv.css('top'));
          barDiv.height(barHeight);
          barDiv.show();
        }
        setPosition(endDiv, leftPos, alignTopPos);
        alignTopPos += endDiv.outerHeight() + -1;
        if (exists(endDiv, 'rad-child')) {
          currDiv = $('#' + endDiv.attr('rad-child'));
        } else {
          return;
        }
      } else {
        if (exists(currDiv, 'rad-child')) {
          currDiv = $('#' + currDiv.attr('rad-child'));
        } else {
          return;
        }
      }
    }
  };

  okToDropHere = function(candidate, dragged) {
    if (dragged.attr('rad-command') === 'else' || dragged.attr('id') === 'telse') {
      return availableIFfor(candidate);
    }
    if (dragged.attr('rad-command') === 'return' || dragged.attr('id') === 'treturn') {
      return connectsToFunction(candidate);
    }
    return true;
  };

  availableIFfor = function(block) {
    var ancestorDiv;
    ancestorDiv = block;
    while (true) {
      if (ancestorDiv.attr('rad-command') === 'if') {
        if (exists(ancestorDiv, 'rad-else')) {
          return false;
        } else {
          return true;
        }
      }
      if (exists(ancestorDiv, 'rad-parent')) {
        ancestorDiv = $('#' + ancestorDiv.attr('rad-parent'));
      } else {
        return false;
      }
    }
  };

  deleteOnDrop = function(event, ui, draggedID) {
    var attachedDiv, changes, draggedElement, i, len, ref, results;
    changes = true;
    if (draggedID != null) {
      draggedElement = $('#' + draggedID);
    } else {
      draggedElement = $(ui.helper);
    }
    if (draggedElement.hasClass("draggable2") && overCommandList(ui)) {
      ref = Radius.getAttachedDivs(draggedElement);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        attachedDiv = ref[i];
        results.push(attachedDiv.remove());
      }
      return results;
    }
  };

  overCommandList = function(thisOne) {
    var thatBot, thatLeft, thatRight, thatTop, thisLeft, thisTop;
    thisTop = thisOne.position.top + $("#ProgrammingPane").position().top;
    thisLeft = thisOne.position.left + $("#ProgrammingPane").position().left;
    thatTop = $("#CommandsPane").position().top;
    thatLeft = $("#CommandsPane").position().left;
    thatRight = $("#CommandsPane").position().top + $("#CommandsPane").width();
    thatBot = $("#CommandsPane").position().left + $("#CommandsPane").height();
    return thisTop <= thatBot && thisTop >= thatTop && thisLeft <= thatRight && thisLeft >= thatLeft;
  };

  connectsToStart = function(block) {
    var parID, parentBlock;
    parentBlock = block;
    if (parentBlock.attr('rad-command') === 'start') {
      return true;
    }
    parID = parentBlock.attr('rad-parent');
    while ((parID != null) && parID.length) {
      parentBlock = $('#' + parID);
      if (parentBlock.attr('rad-command') === 'start') {
        return true;
      }
      parID = parentBlock.attr('rad-parent');
    }
    return false;
  };

  connectsToFunction = function(block) {
    var parID, parentBlock;
    parentBlock = block;
    if (parentBlock.attr('rad-command') === 'functiondef') {
      return true;
    }
    parID = parentBlock.attr('rad-parent');
    while ((parID != null) && parID.length) {
      parentBlock = $('#' + parID);
      if (parentBlock.attr('rad-command') === 'functiondef') {
        return true;
      }
      parID = parentBlock.attr('rad-parent');
    }
    return false;
  };

  SetupDroppable = function() {
    return $('#ProgrammingPane').droppable({
      drop: function(event, ui) {
        var barID, barTemplate, changes, endID, endTemplate, myclone, parentBottom, parentLeft, parentTop;
        if (ui.draggable.hasClass("draggable2")) {
          if (exists(ui.draggable, 'rad-hastobefirst')) {
            return;
          }
          if (attachableCandidateID == null) {
            return;
          }
          attach(attachableCandidateID, $(ui.draggable).attr("id"));
          attachableCandidateID = null;
          $('.attachable').removeClass('attachable');
          changes = true;
          return;
        }
        if (!ui.draggable.hasClass("draggable1")) {
          return;
        }
        if (overCommandList($(ui.draggable))) {
          return;
        }
        changes = true;
        myclone = ui.helper.clone();
        setUpClone(myclone, ui.draggable, ui.offset);
        myclone.appendTo($(this)).draggable({
          start: function(event, ui) {
            myclone.attr('rad-startLeft', myclone.position().left + scrLeft);
            myclone.attr('rad-startTop', myclone.position().top + scrTop);
            $(".selected").removeClass("selected");
            return lastDraggedDiv = myclone;
          },
          drag: onDrag,
          containment: "parent",
          handle: '.draghandle',
          zIndex: 100
        });
        if (myclone.attr("rad-end").length > 0) {
          parentTop = parseFloat(myclone.css("top"));
          parentBottom = parentTop + 29;
          parentLeft = parseFloat(myclone.css("left"));
          endID = myclone.attr('rad-end');
          if (myclone.attr('rad-command') === "while") {
            endTemplate = $("#endwhiletemplate");
            barTemplate = $("#whilebartemplate");
          } else if (myclone.attr('rad-command') === "if") {
            endTemplate = $("#endiftemplate");
            barTemplate = $("#ifelsebartemplate");
            myclone.attr('rad-else', '');
          }
          endTemplate.clone().attr('id', endID).attr('rad-parent', myclone.attr("id")).css('position', 'absolute').css('top', parentBottom + initialEndGap).css('left', parentLeft).addClass("draggable2").appendTo($(this)).show();
          barTemplate.clone().attr('id', myclone.attr('rad-bar')).css('position', 'absolute').css('top', parentTop + myclone.outerHeight()).css('left', parentLeft).height(parseFloat($('#' + endID).css("top")) - (parentTop + myclone.outerHeight())).appendTo($(this)).show();
          if (myclone.attr('rad-command') === "while") {
            $("#" + endID).attr('rad-command', 'endwhile');
          } else if (myclone.attr('rad-command') === "if") {
            $("#" + endID).attr('rad-command', 'endif');
          }
        }
        if (myclone.attr('rad-command') === "else") {
          barID = "xxx" + getNextID();
          myclone.attr('rad-bar', barID);
          barTemplate = $("#ifelsebartemplate");
          barTemplate.clone().attr('id', barID).css('position', 'absolute').css('top', parentTop + myclone.outerHeight()).css('left', parentLeft).width(8).height(30 - myclone.outerHeight()).appendTo($(this)).hide();
        }
        if (attachableCandidateID == null) {
          return;
        }
        if (exists(myclone, 'rad-hastobefirst')) {
          return;
        }
        attach(attachableCandidateID, myclone.attr("id"));
        attachableCandidateID = null;
        $('.attachable').removeClass('attachable');
      }
    });
  };

  removeCRcallback = function(event) {
    var text1;
    console.log("callback event", event);
    console.log("event.target", event.target);
    text1 = $(event.target).html();
    console.log("pasted", text1);
    return $(event.target).html(text1.replace(/[\n\r]+/g, "#"));
  };

  removeCR = function(event) {
    console.log("removeCR: before setTimeout");
    setTimeout(removeCRcallback(event), 1000);
    return console.log("removeCT: after setTimeout");
  };

  setUpClone = function(clone, original, offset) {
    clone.attr('id', 'x' + getNextID());
    clone.attr("class", "draggable2 ui-widget-content");
    clone.css("position", "absolute");
    clone.css("top", offset.top - $("#ProgrammingPane").offset().top + 9 + scrTop);
    clone.css("left", offset.left - $("#ProgrammingPane").offset().left + 5 + scrLeft);
    clone.css("z-index", 100);
    clone.attr('rad-child', '');
    clone.attr('rad-parent', '');
    clone.attr('rad-end', '');
    clone.attr('rad-bar', '');
    clone.attr('rad-command', original.attr('id').substring(1));
    if (original.hasClass('maxone')) {
      clone.attr('rad-maxone', true);
    }
    if (original.hasClass('hastobefirst')) {
      clone.attr('rad-hastobefirst', true);
    }

    /*
    	if original.attr('id')=='tstart'
    		clone.addClass('START')
    	if original.attr('id')=='tshow'
    		clone.addClass('SHOW')
    	if original.attr('id')=='tclear'
    		clone.addClass('CLEAR')
    	if original.attr('id')=='twhile'
    		clone.addClass('WHILE')
    	if original.attr('id')=='tif'
    		clone.addClass('IF')
    	if original.attr('id')=='telse'
    		clone.addClass('ELSE')
    	if original.attr('id')=='tassign'
    		clone.addClass('ASSIGN')
    	if original.attr('id')=='tfunctiondef'
    		clone.addClass('FUNCDEF')
    	if original.attr('id')=='treturn'
    		clone.addClass('RETURN')
    	if original.attr('id')=='tfndo'
    		clone.addClass('FUNCDO')
    	if original.hasClass('maxone')
    		clone.addClass('maxone')
    	if original.hasClass('hastobefirst')
    		clone.addClass('hastobefirst')
     */
    clone.find(".editable").on("paste", removeCR);
    clone.find(".short").attr('minwidth', 40).attr('maxwidth', 300);
    clone.find(".medium").attr('minwidth', 80).attr('maxwidth', 400);
    clone.find(".long").attr('minwidth', 180).attr('maxwidth', 500);
    if (original.hasClass("has-end")) {
      clone.attr('rad-end', "x" + getNextID());
      return clone.attr('rad-bar', "x" + getNextID());
    }
  };

}).call(this);