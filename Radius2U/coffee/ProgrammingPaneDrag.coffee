# code for dragging, dropping, and attaching in the Programming Pane

Radius = window.Radius

# local to this file
INDENT_AMOUNT = 14
initialEndGap = 25
attachableCandidateID = null
lastDraggedDiv = null
scrTop = 0    # scrollTop
scrLeft = 0   # scrollLeft


# called by jQuery's onReady handler
Radius.ProgrammingPaneDragOnReady = ->
	SetupDroppable()
	
	# make draggable each element of class draggable1 (all in CommandsPane)
	$('.draggable1').each (index, value) -> 
		$(value).draggable
			#stop: (event, ui) -> 
			drag: (event, ui) -> lookForAttachable(event, ui)
			helper: (event, ui) -> return $(this).clone().appendTo('body').css('zIndex',5).show()
	
	# Keep track of how much the pane has scrolled.
	$('#ProgrammingPane').on "scroll", (event) ->
		scrTop =  $('#ProgrammingPane').scrollTop()
		scrLeft =  $('#ProgrammingPane').scrollLeft()
	
	Radius.SetUpDragability()



# `RadiusSetUpDragability` is called from the HTML.
Radius.SetUpDragability = () ->
	# this code duplicates code run when a new command is dragged into
	# id=ProgrammingPane, so some refactoring is needed.
	$('.draggable2').draggable
		start: (event, ui) -> 
			$(this).attr('rad-startLeft', $(this).position().left)
			$(this).attr('rad-startTop', $(this).position().top)
		drag: onDrag     # onDrag is defined below
		handle: '.draghandle'
		zIndex: 100        # put dragging thing higher TODO: put endwhile higher as well
	$('.draggable2').find(".editable").keypress (event) -> 
		if event.which == 10 or event.which == 13
			event.preventDefault()
	return


# Keep the nextID in the DOM so that it is set when an existing block of code is read in
getNextID = () ->
	n = +$('#nextID').attr('nextID')  # the + sign casts the value to a number
	$('#nextID').attr('nextID', (n+1))
	return n

# utility functions to move a div
shift = (theDiv, x, y) ->
	currTop = parseFloat(theDiv.css("top"))
	currLeft = parseFloat(theDiv.css("left"))
	theDiv.css("top", currTop + y)
	theDiv.css("left", currLeft  + x)

setPosition = (theDiv, x, y) ->
	theDiv.css("top", y)
	theDiv.css("left", x)


# Does theDiv has a real (non "") attribute named attrString?
exists = (theDiv, attrString) ->
	console.log("ProgrammingPaneDrag.exists: theDiv?", theDiv, attrString) if not (theDiv.attr)?
	theDiv.attr(attrString)? and theDiv.attr(attrString).length


# onDrag is used only for draggable2s, and drags around children as well
# calls lookForAttachable
onDrag = (event, ui) ->
	# find how much the mouse moved, and prepare for next onDrag
	topDragDiv = $(ui.helper)   # $(ui.helper) is what's being dragged
	topDragDiv.css("z-index", 200)
	xDelta = ui.position.left - topDragDiv.attr('rad-startLeft')
	yDelta = ui.position.top - topDragDiv.attr('rad-startTop')
	topDragDiv.attr('rad-startLeft', ui.position.left)
	topDragDiv.attr('rad-startTop', ui.position.top)
	if exists topDragDiv, 'rad-parent'	  # has a parent, so detach it
		parentDiv = $('#'+topDragDiv.attr('rad-parent'))
		parentDiv.attr('rad-child', '')				# parent forgets child
		topDragDiv.attr('rad-parent', '')			# child forgets parent
		alignEntireBlock(parentDiv)                 # to adjust ifs and whiles
		#softCompile()  # here is where it should compile upon detach
		changes = true
	else if exists topDragDiv, 'rad-if'
		$('#'+topDragDiv.attr('rad-if')).attr('rad-else', '') # if forgets else
		topDragDiv.attr('rad-if', '')				# else forgets if
		$('#'+topDragDiv.attr('rad-bar')).hide()
	for attachedDiv in Radius.getAttachedDivs topDragDiv
		attachedDiv.css("z-index", 200)
		shift attachedDiv, xDelta, yDelta 
	if not exists topDragDiv, 'rad-hastobefirst'    #topDragDiv.hasClass "hastobefirst"
		lookForAttachable event, ui
	return

# returns an array of all of the objects attached (below) to topDiv
Radius.getAttachedDivs = (topDiv) ->
	result = []
	divsToSee = [topDiv]      # initialize array
	currentDiv = null
	while (currentDiv = divsToSee.pop())?    #parens needed here!
		while currentDiv?
			result.push(currentDiv)
			if exists currentDiv, 'rad-bar'
				result.push($("#"+currentDiv.attr('rad-bar')))
			if exists currentDiv, 'rad-end'
				divsToSee.push($("#"+currentDiv.attr('rad-end')))
			if exists currentDiv, 'rad-else'
				divsToSee.push($("#"+currentDiv.attr('rad-else')))
			if exists currentDiv, 'rad-child'
				currentDiv = $("#"+currentDiv.attr('rad-child'))
			else
				currentDiv = null
	return result

# find another draggable2 that is close enough to attach this one to.
# Set attachableCandidateID to that element's id, and it will be attached
# when the dragged div is dropped.
lookForAttachable = (event, ui) -> 
	draggedDiv = $(ui.helper)
	closeEnough = 10
	thisTop = parseFloat draggedDiv.css('top')     # ui.position.top - scrTop
	thisLeft = parseFloat draggedDiv.css('left')   # ui.position.left - scrLeft
	# command templates are attached to the body and don't know anything about
	# scrolling in ProgrammingPane
	if draggedDiv.hasClass "draggable1" 	     # if a command template,
		thisTop = thisTop - $("#ProgrammingPane").offset().top + scrTop + 9     # mystery offsets
		thisLeft = thisLeft - $("#ProgrammingPane").offset().left + scrLeft + 5
	# console.log("draggedDiv:", thisTop, thisLeft, "that.position:", $("#x100").css('top'), $("#x100").css('left'))
	
	$('.attachable').removeClass "attachable"
	attachableCandidateID = null
	$('.draggable2').each (index, value) -> 
		candidateDiv = $ value        # possible block to attach to
		# same element? if so, skip to next draggable2
		return true if candidateDiv.attr("id") == draggedDiv.attr("id")
		# skip on various conditions
		return true if not okToDropHere(candidateDiv, draggedDiv)
		thatBottom = (parseFloat candidateDiv.css('top')) + candidateDiv.outerHeight() # candidateDiv.position().top + $(value).outerHeight()
		thatLeft = parseFloat candidateDiv.css('left')  # candidateDiv.position().left
		thatRight = thatLeft + candidateDiv.width()
		letsAttach = false
		if thisTop <= thatBottom + closeEnough and
				thisTop >= thatBottom - closeEnough and
				thisLeft >= thatLeft - closeEnough and
				thisLeft <= thatRight + closeEnough
			letsAttach = true
		#console.log("this:", thisTop, thisLeft, "that:",
		#		  thatBottom, thatLeft, thatRight, "==>", letsAttach)
		if letsAttach and attachableCandidateID == null 
			candidateDiv.addClass("attachable")
			attachableCandidateID = candidateDiv.attr('id')
			return false  # we're done, break out of .each loop

# use DOM attributes to remember parent-child attachments, and move
# child and grandchildren into alignment
attach = (parentID, childID) -> 
	changes = true
	parentDiv = $("#"+parentID)
	childDiv = $("#"+childID)
	if exists parentDiv, 'rad-child'    # already has a child?
		grandchildID = parentDiv.attr('rad-child')
	else
		grandchildID = ''
	parentDiv.attr('rad-child', childDiv.attr("id"))
	childDiv.attr('rad-parent', parentDiv.attr("id"))
	if grandchildID != ''
		childDiv.attr('rad-child', grandchildID)
		$('#'+grandchildID).attr('rad-parent', childID)
	$('.draggable2').each (index, value) -> 
		($ value).css("z-index", 100)
	if childDiv.hasClass("ELSE")			# block before ELSE doesn't
		parentDiv.attr('rad-child', '')		# point to ELSE block
		childDiv.attr('rad-parent', '')     # and ELSE has no parent
		ifparent = parentDiv
		while true
			if ifparent.hasClass("IF")
				ifparent.attr('rad-else', childID)
				childDiv.attr('rad-if', ifparent.attr('id'))
				alignEntireBlock(ifparent)
				return
			if exists ifparent, 'rad-parent'
				ifparent = $('#' + ifparent.attr('rad-parent'))
			else
				console.log("**Couldn't find ifparent for", childID)
				return
	alignEntireBlock(parentDiv)
	#if connectsToStart(childDiv) 
	#	newLine = getCodeLine(childDiv)
	

alignTopPos = 0   # global, for communication within align* functions

alignEntireBlock = (div) -> 
	topDiv = div
	while true
		if exists topDiv, 'rad-parent'
			topDiv = $("#"+(topDiv.attr('rad-parent')))
		else if exists topDiv, 'rad-if'
			topDiv = $("#"+(topDiv.attr('rad-if')))
		else
			break
	leftPos = parseFloat(topDiv.css('left'))
	alignTopPos = parseFloat(topDiv.css('top'))
	align2(topDiv, leftPos)

align2 = (theDiv, leftPos) ->
	currDiv = theDiv
	while currDiv?
		setPosition(currDiv, leftPos, alignTopPos)
		alignTopPos += currDiv.outerHeight() + -1   # include padding , -1 forces overlap
		if exists currDiv, 'rad-end' 	  # does this div start a block?
			barDiv = $('#'+currDiv.attr('rad-bar'))
			endDiv = $('#'+currDiv.attr('rad-end'))
			setPosition(barDiv, leftPos, alignTopPos)
			if exists currDiv, 'rad-child'
				align2($('#'+currDiv.attr('rad-child')), leftPos+INDENT_AMOUNT)
			else
				alignTopPos += initialEndGap   # a little space for empty blocks
			barHeight = alignTopPos - parseFloat(barDiv.css('top'))
			barDiv.height(barHeight) 
			# handle else, if needed
			if exists currDiv, 'rad-else'
				elseDiv = $('#'+currDiv.attr('rad-else'))
				# console.log("handling elseDiv:", elseDiv)
				setPosition(elseDiv, leftPos, alignTopPos)
				alignTopPos += elseDiv.outerHeight() + -1
				barDiv = $('#'+elseDiv.attr('rad-bar'))
				setPosition(barDiv, leftPos, alignTopPos)
				if exists elseDiv, 'rad-child'
					align2($('#'+elseDiv.attr('rad-child')), leftPos+INDENT_AMOUNT)
				else
					alignTopPos += 5   # a little space for empty blocks
				barHeight = alignTopPos - parseFloat(barDiv.css('top'))
				barDiv.height(barHeight) 
				barDiv.show()
			setPosition(endDiv, leftPos, alignTopPos)
			alignTopPos += endDiv.outerHeight() + -1
			# continue with rad-child of the end block, if it exists
			if exists endDiv, 'rad-child'
				currDiv = $('#'+endDiv.attr('rad-child'))
			else
				return
		else # not a block
			if exists currDiv, 'rad-child'
				currDiv = $('#'+currDiv.attr('rad-child'))
			else
				return


# checks if a start block is already there, or a return block isn't 
# being attached to a function, or if there is already an else block there
okToDropHere = (candidate, dragged) ->
	# need to restore this test - really should just automatically put in one "Start" block
	# return false if dragged.hasClass("maxone") and $("#ProgrammingPane > .maxone").length > 0
	if dragged.attr('rad-command') == 'else' or dragged.attr('id')=='telse'
		return availableIFfor candidate
	if dragged.attr('rad-command') == 'return' or dragged.attr('id')=='treturn'
		return connectsToFunction(candidate)
	return true

# Return true if the block, or one of its ancestors, is an IF without an ELSE
availableIFfor = (block) ->
	ancestorDiv = block
	while true
		if ancestorDiv.attr('rad-command') == 'if'
			if exists ancestorDiv, 'rad-else'
				return false
			else
				return true
		if exists ancestorDiv, 'rad-parent'
			ancestorDiv = $('#'+ancestorDiv.attr('rad-parent'))
		else
			return false

# delete when dropped in the left box
deleteOnDrop = (event, ui, draggedID) -> 
	changes = true
	if draggedID?
		draggedElement = $('#'+draggedID)
	else
		draggedElement = $(ui.helper)
	if draggedElement.hasClass("draggable2") and overCommandList(ui)
		attachedDiv.remove() for attachedDiv in Radius.getAttachedDivs(draggedElement)
		# softCompile() #compile here when you delete something, like a function

# Returns true if the div being dragged, thisOne, has its upper left hand
# corner in the Command List area.
# probably should use .offset which is in relation to the window
overCommandList = (thisOne) ->
	thisTop = thisOne.position.top + $("#ProgrammingPane").position().top # relative position
	thisLeft = thisOne.position.left + $("#ProgrammingPane").position().left
	thatTop = $("#CommandsPane").position().top
	thatLeft = $("#CommandsPane").position().left
	thatRight = $("#CommandsPane").position().top + $("#CommandsPane").width()
	thatBot = $("#CommandsPane").position().left + $("#CommandsPane").height()
	return thisTop <= thatBot and thisTop >= thatTop and 
			thisLeft <= thatRight and thisLeft >= thatLeft


#until rad-parent is null
connectsToStart = (block) -> 
	parentBlock = block
	return true if parentBlock.attr('rad-command') == 'start' 
	parID = parentBlock.attr('rad-parent')
	while parID? and parID.length
		parentBlock = $('#'+parID)
		return true if parentBlock.attr('rad-command') == 'start' 
		parID = parentBlock.attr('rad-parent')
	return false


connectsToFunction = (block) -> 
	parentBlock = block
	return true if parentBlock.attr('rad-command') == 'functiondef' 
	parID = parentBlock.attr('rad-parent')
	while parID? and parID.length
		parentBlock = $('#'+parID)
		return true if parentBlock.attr('rad-command') == 'functiondef' 
		parID = parentBlock.attr('rad-parent')
	return false



SetupDroppable = ->
	# The only .droppable is the programming box, #ProgrammingPane.
	# Two cases are handled, 1) the dropped div is already in the programming
	# area, so just see if it should be attached; 2) the dropped div was dragged
	# over from the command pane, so make a clone, and then see if it should be
	# attached.
	$('#ProgrammingPane').droppable
		drop: (event, ui) ->
			#console.log('drop', event)
			if ui.draggable.hasClass("draggable2")
				return if exists ui.draggable, 'rad-hastobefirst'   # no can attach
				return if not attachableCandidateID?
				attach(attachableCandidateID, $(ui.draggable).attr("id"))
				attachableCandidateID = null
				$('.attachable').removeClass('attachable')
				changes = true
				return
			return if not ui.draggable.hasClass("draggable1") # new command?
			return if overCommandList($(ui.draggable))  # not fully dragged in?
			changes = true
			# put the clone in the DOM with a new unique ID and no helper clone when dragged
			myclone = ui.helper.clone()	           # clone of the clone !!
			setUpClone(myclone, ui.draggable, ui.offset)

			# append myclone to the HTML of this (id='ProgrammingPane'), and make it draggable
			myclone.appendTo($(this)).draggable
				start: (event, ui) -> 
					myclone.attr('rad-startLeft', myclone.position().left + scrLeft)
					myclone.attr('rad-startTop', myclone.position().top + scrTop)
					$(".selected").removeClass("selected")
					lastDraggedDiv = myclone
				drag: onDrag     # onDrag is defined above
				containment: "parent"
				handle: '.draghandle'
				zIndex: 100        # put dragging thing higher TODO: put endwhile higher as well
			if myclone.attr("rad-end").length > 0
				parentTop = parseFloat(myclone.css("top"))
				parentBottom = parentTop + 29 # should use parseFloat(myclone.css("outerHeight"))
				parentLeft = parseFloat(myclone.css("left"))
				endID = myclone.attr('rad-end')
				if myclone.attr('rad-command') == "while"
					endTemplate = $("#endwhiletemplate")
					barTemplate = $("#whilebartemplate")
				else if myclone.attr('rad-command') == "if"
					endTemplate = $("#endiftemplate")
					barTemplate = $("#ifelsebartemplate")
					myclone.attr('rad-else', '')
				endTemplate.clone()
					.attr('id', endID)
					.attr('rad-parent', myclone.attr("id"))
					.css('position', 'absolute')
					.css('top', parentBottom + initialEndGap)
					.css('left', parentLeft)
					.addClass("draggable2")  # so it can be attached to, but it isn't really draggable
					.appendTo($(this))
					.show()
				#console.log("end div:", $('#'+endID).css('top'), parentTop + 50)
				barTemplate.clone()
					.attr('id', myclone.attr('rad-bar'))
					.css('position', 'absolute')
					.css('top', parentTop + myclone.outerHeight())
					.css('left', parentLeft)
					.height(parseFloat($('#'+endID).css("top")) - (parentTop + myclone.outerHeight()))
					.appendTo($(this))
					.show()
				if myclone.attr('rad-command') == "while"
					$("#"+endID).attr('rad-command', 'endwhile')
				else if myclone.attr('rad-command') == "if"
					$("#"+endID).attr('rad-command', 'endif')
			if myclone.attr('rad-command') == "else"
				barID = "xxx" + getNextID()
				myclone.attr('rad-bar', barID)
				barTemplate = $("#ifelsebartemplate")
				barTemplate.clone()
					.attr('id', barID)
					.css('position', 'absolute')
					.css('top', parentTop + myclone.outerHeight())
					.css('left', parentLeft)
					.width(8)
					.height(30 - myclone.outerHeight())
					.appendTo($(this))
					.hide()

			return if not attachableCandidateID?
			return if exists myclone, 'rad-hastobefirst'    #myclone.hasClass("hastobefirst")
			attach(attachableCandidateID, myclone.attr("id"))
			attachableCandidateID = null
			$('.attachable').removeClass('attachable')
			return

# This stuff doesn't work in Chrome, because when multi-line text is
# pasted in, Chrome creates new divs.
# Solution may lie here:
# http://stackoverflow.com/questions/2176861/javascript-get-clipboard-data-on-paste-event-cross-browser
removeCRcallback = (event) ->
	console.log("callback event", event)
	console.log("event.target", event.target)
	text1 = $(event.target).html()
	console.log("pasted", text1)
	$(event.target).html(text1.replace(/[\n\r]+/g, "#"))

removeCR = (event) ->
	console.log("removeCR: before setTimeout")
	setTimeout(removeCRcallback(event), 1000)
	console.log("removeCT: after setTimeout")

# When a command is dragged onto the programming area, a clone of it is
# created, which remains in the programming area.  This function sets up
# that clone, based on the original.
setUpClone = (clone, original, offset) ->
	clone.attr('id', 'x' + getNextID())  # its own unique id
	clone.attr("class", "draggable2 ui-widget-content")
	clone.css("position", "absolute")
	# I don't know why it is necessary to add 9 and 5 below.
	clone.css("top", offset.top - $("#ProgrammingPane").offset().top + 9 + scrTop)
	clone.css("left", offset.left - $("#ProgrammingPane").offset().left + 5 + scrLeft)
	clone.css("z-index", 100)
	clone.attr('rad-child', '')
	clone.attr('rad-parent', '')
	clone.attr('rad-end', '')      # used by while and if
	clone.attr('rad-bar', '')      # used by while and if and else
	clone.attr('rad-command', original.attr('id').substring(1))  # remember the id, except for the inition 't'
	if original.hasClass('maxone')
		clone.attr('rad-maxone', true)
	if original.hasClass('hastobefirst')
		clone.attr('rad-hastobefirst', true)
	###
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
	###

	clone.find(".editable").on("paste", removeCR)
	clone.find(".short").attr('minwidth', 40).attr('maxwidth', 300)
	clone.find(".medium").attr('minwidth', 80).attr('maxwidth', 400)
	clone.find(".long").attr('minwidth', 180).attr('maxwidth', 500)
	if original.hasClass("has-end")
		clone.attr('rad-end', "x" + getNextID())
		clone.attr('rad-bar', "x" + getNextID())

