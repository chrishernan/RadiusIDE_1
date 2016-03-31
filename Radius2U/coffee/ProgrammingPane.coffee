# define some variables and constants
Radius = window.Radius
Block = Radius.Block
Box = Radius.Box
TheBlockList = Radius.TheBlockList

# local to this file
changes = true
clickToSelect = true

# called by jQuery's onReady handler
Radius.ProgrammingPaneOnReady = ->
	console.log("in Radius.ProgrammingPaneOnReady")
	$('#ProgrammingPane').on "click", ".parm", (event) ->
		$(this).focus()
	$('#ProgrammingPane').on "click", ".parm2", (event) ->
		$(this).focus()
	
	# Remove 'errorHighlight' highlight and the message box when a parm is edited.
	$('#ProgrammingPane').on "keyup", "div.errorParm", (event) -> 
		Radius.clearErrors(true)

	# Mouse down on a block's draghandle removes error messages, and may invoke the popup menu
	$('#ProgrammingPane').on "mousedown", ".draghandle", (event) ->
		#console.log('event', event)
		Radius.clearErrors(true)
		if event.altKey or event.ctrlKey or event.metaKey or event.shiftKey
			# If this block is already selected (and perhaps others are too),
			# then don't "reselect" it, and most importantly, don't deselect other selected blocks
			# (shift-double click is not impacted by clickToSelect, who knows whether that's right)
			if $(this).parent().hasClass("selected")
				#console.log("yes, this one is selected")
				clickToSelect = false
			# doPopup(this, event)  need to implement

	# For testing
	#box1 = new Box("clear", "ProgrammingPane", "", "")
	#box2 = new Box("show", "ProgrammingPane", "3+4", "")
	#box3 = new Box("assign", "ProgrammingPane", "x", "9 + 10")
	#box4 = new Box("show", "ProgrammingPane", "x", "")
	startBlock = Radius.TheBlockList.getStartBlock()
	#startBlock.add(box1)
	#startBlock.add(box2)
	##startBlock.add(box3)
	#startBlock.add(box4)
	
	#box5 = new Box("show", "ProgrammingPane", "Hello").setPos(200, 30)
	#Radius.TheBlockList.addBlock(new Radius.Block(box5))


radCode = ""
Radius.generateCode = ->
	console.log("in ProgrammingPane's Radius.generateCode")
	radCode = ""
	Radius.allBoxes.getParms()
	generateCode2 Radius.Box.startBox, 0
	
	# have to handle function definitions as well
	
	console.log("No code generated.") if radCode.length == 0
	return radCode

spaces = (n) ->
	return "          " if n >= 5
	return "        "   if n == 4
	return "      "     if n == 3
	return "    "       if n == 2
	return "  "         if n == 1
	return ""

generateCode2 = (box, level) ->
	currBox = box
	while currBox?
		radCode += (spaces level) + (generateCodeLine currBox)
		if currBox.name == 'while'
			generateCode2 currBox.nextBox, level+1  	# in `while` block
			currBox = currBox.end  						# `endwhile` and all following
		else if currBox.name == 'if'
			generateCode2 currBox.nextBox, level+1  	# in `if` block
			if currBox.else?
				generateCode2 currBox.else, level
			currBox = currBox.end  						# `endif` and all following
		else if currBox.name == 'else'
			generateCode2 currBox.nextBox, level+1  	# in else block
			currBox = null
		else
			if currBox.nextBox?
				currBox = currBox.nextBox
			else
				currBox = null

generateCodeLine = (box) ->
	switch box.name
		when 'Start'
			return ""
		when 'show'
			return '##' + box.id + ' #SHOW ' + box.parm1 + ' #ENDSHOW\n'
		when 'clear'
			return '##' + box.id + ' #CLEAR #ENDCLEAR\n'
		when 'while'
			return '##' + box.id + ' #WHILE ' + box.parm1 + ' #ENDCONDITION\n'
		when 'endwhile'
			return '##' + box.id + ' #ENDWHILE\n'
		when 'if'
			return '##' + box.id + ' #IF '+box.parm1 + ' #ENDCONDITION\n'
		when 'endif'
			return '##' + box.id + ' #ENDIF\n'
		when 'else'
			return '##' + box.id + ' #ELSE\n'
		when 'assign'
			return '##' + box.id + ' #ASSIGN '+box.parm1+' #GETS '+box.parm2+' #ENDASSIGN\n'
		when 'functiondef'
			return '##' + box.id + ' #FUNCTION '+box.parm1+' #ENDNAME '+box.parm2+' #ENDPARMS\n'
		when 'do'
			return '##' + box.id + ' #FUNCDO ' + box.parm1 + ' #ENDFUNCDO\n'
		when 'return'
			return '##' + box.id + ' #RETURN '+box.parm1+' #ENDRETURN\n'
		else
			console.log("unknown in generateCodeLine:", box.name)
	return ''

Radius.showError = (id, whichParm, startPos, length, message) ->
	#console.log("showError:", id, whichParm, startPos, length, message)
	errorBox = Radius.allBoxes.find(id)
	errorBox.flagError(whichParm, startPos, length)

	errorTop = errorBox.y
	errorLeft = errorBox.getRight() + 8
	$('#ProgrammingPane').append('<div class="errorMessageBox" ' +
		'style="top: ' + errorTop + 'px; left: ' + errorLeft + 'px;">' +
		message + '</div>')

Radius.clearErrors = (fadeOutSlowly) ->
	#console.log("**clearErrors**", fadeOutSlowly)
	$('.errorParm').removeClass('errorParm')
	$('.errorEmptyParm').removeClass('errorEmptyParm')
	$('.errorTextHighlight').removeClass('errorTextHighlight')  # ok to leave the <span>...</span>?
	if fadeOutSlowly
		$(".errorMessageBox").fadeOut(1000, -> $(this).remove())
	else
		$(".errorMessageBox").remove()



