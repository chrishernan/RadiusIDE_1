Radius = window.Radius
TheBlockList = Radius.TheBlockList
Block = Radius.Block

# A Box object represents one command.
# ------------------------------------

class Radius.Box
	# static (class) variables
	@attachableBox = null  # set by lookForAttachable; is the Box the being-dragged Box could attach to
	@blockEnder = -1
	@targetID = 0		# set by target(); used by swooping
	@nextID = 200
	
	# Contructing a box object creates the corresponding DOM div,
	# using jQuery.
	constructor: (@name, @parentDivID, @parm1, @parm2) ->		# id, owner, 
		@deleted = false
		@parentBlock = null
		@isABox = true
		@dragInProgress = false
		@isAPrototype = (@parentDivID == "PrototypesPane")
		@parm1 = "" if not @parm1?    # for storing parms typed in by user in localStorage
		@parm2 = "" if @parm2 == null
		@id = ""+(Box.nextID++)

		if @name == "bar"
			$("<div id='" + @id + "' class='bar'></div>")
				.appendTo($('#'+@parentDivID))		# add to DOM parent
			return
		if @name.startsWith("end")
			$("<div id='" + @id + "' class='box'>" +
				"<span class='commandname'>" + @name + "</span></div>")
				.appendTo($('#'+@parentDivID))		# add to DOM parent
			return

		$("<div id='" + @id + "' class=" + 
			(if @name == 'Start' then "'startBox box'>" else "'box'>") +
			"<span class='commandname draghandle'>" + @name + "</span>" +
			@makeBlockInnards(@name, @parm1, @parm2) +
			"</div>")
			.appendTo($("#"+@parentDivID))		# add to DOM parent
			.draggable
				handle: ".draghandle"
				drag: @onDrag
				stop: @onDragStop

	# setPos positions `this`, both Box and DOM
	setPos: (x, y) ->
		#!console.log('setPos', @id, @name, x, y)
		$div = $('#'+@id)
		$div.css      # relative to the DOM parent
			left: x
			top: y
		@x = x
		@y = y
		@target()
		this		# returning this allows aBlock.add(new Box().setPos())

	onDrag: (event, ui) =>
		# Start of drag?
		if not @dragInProgress
			if @isAPrototype 
				# create a new prototype Box that stays in the Prototypes Pane
				bx = new Box(@name, 'PrototypesPane').setPos(@x, @y)
				# make a new Block for this Box
				Radius.TheBlockList.addBlock(new Radius.Block(this))
				#! Remove double-clickability
				#console.log('off', @id, @name, $('#'+@id))
				#$('#'+@id).off 'dblclick', ".draghandle"
			@parentBlock.split(this)  # pretty sure only do this at start of drag
			@parentBlock.flagAsDragged()
			$('.lastDragged').removeClass('lastDragged')
			@dragInProgress = true
		@parentBlock.moveTo(this, ui.position.left, ui.position.top)
		@lookForAttachable(event, ui)

	lookForAttachable: (event, ui) ->
		#!console.log("lookForAttachable ui", ui?, "this:", this.name)
		$('.attachable').removeClass 'attachable'
		return if @name == 'Start'
		Box.attachableBox = null
		for block in Radius.TheBlockList.blocks
			attBox = block.findAttachable(this)  # returns null if nothing attachable found
			if attBox?
				Box.attachableBox = attBox
				$('#'+attBox.id).addClass('attachable')
				return

	# Returns true if it's OK to attach this box to box1
	okToAttach: (box1) ->
		#!console.log("okToAttach", box1.name, box1.id)
		# An else can only attach to a box which is an elseless if, or which
		# descends from an elseless if
		return true   # stub this out for now
		if @name == "else"
			if box1.name == "if"
				return true
			# Can't stick an else in the middle of a block
			if box1.nextBox?
				return false
			return box1.higherIf()?
		return true

	higherIf: () ->
		#!console.log("looking for the higherIf of", @name)
		return this if @name == "if"
		#!return null if @bar?   # some other block starter, such as while
		if @prevBox?
			return @prevBox.higherIf()
		else
			return null
	
	# I think none of the parameters are used
	onDragStop: (event, ui, prototypeID) =>
		@dragInProgress = false
		$('.beingDragged').removeClass('beingDragged').addClass('lastDragged')
		
		if @isAPrototype
			x1 = @x + $('#PrototypesPane').offset().left - $('#ProgrammingPane').offset().left
			y1 = @y + $('#PrototypesPane').offset().top - $('#ProgrammingPane').offset().top
			#!console.log('prototype dropped, x:', @x, 'y:', @y, 'x1:', x1, 'y1:', y1)
			if x1 >= 0 and y1 >= 0 and x1 < $('#ProgrammingPane').outerWidth() and
						y1 < $('#ProgrammingPane').outerHeight()
				$('#'+@id).appendTo('#ProgrammingPane')
				@setPos(x1, y1)
				@isAPrototype = false
				if @name == 'while' or @name == 'if' or @name == 'function'
					@parentBlock.addEnd()
			else
				@parentBlock.deleteBlock()
				return
			
		if Box.attachableBox?
			Box.attachableBox.parentBlock.append(Box.attachableBox, this)
			$('.attachable').removeClass 'attachable'
			#Radius.TheBlockList.display()
			return
		
		# Boxes and blocks are deleted by dragging them to the left of the programming pane.
		if @x < -10 or @y < -10
			@parentBlock.deleteBlock()
			#Radius.TheBlockList.display()
			return
		
		#Radius.TheBlockList.display()
		return
				
		# If an `else`, make the `else` the "end" of its `if`.
		#if @name == "else"
		#	if @prevBox.name isnt "if"
		#		@prevBox = Box.attachableBox.higherIf()
		#	Box.attachableBox.nextBox = null  # else is never a nextBox
		#	@end = @prevBox.end
		#	@prevBox.end = this
		
		# Call setPos on the top of the block containing attachableBox
		b2 = Box.attachableBox
		while b2.prevBox?
			b2 = b2.prevBox
		
		Box.blockEnder = -1	# maybe not necessary
		b2.setPos(b2.x, b2.y)
		
		Box.attachableBox = null
		$('.attachable').removeClass 'attachable'


	getRight: () ->
		@x + $('#'+@id).width()
	
	getBottom: () ->
		@y + $('#'+@id).outerHeight()

	target: () ->
		return if @prototype
		#!console.log("target", @name, @id)
		$('.target').removeClass 'target'
		$('#'+@id).addClass 'target'
		Box.targetID = @id


	makeBlockInnards: (name, parm1, parm2) ->
		parm1 = "" if not parm1?
		parm2 = "" if not parm2?
		switch name
			when 'show', 'do'
				"<div class='parm editable long' spellcheck='false' contentEditable='true'>"+
					parm1+"</div>"
			when 'clear', 'else', 'Start'
				''
			when 'if', 'while', 'return', 'function return'
				"<div class='parm editable medium' spellcheck='false' contentEditable='true'>"+
					parm1+"</div>"
			when 'assign'
				"<div class='parm editable short' spellcheck='false' contentEditable='true'>"+
					parm1+"</div>"+
				"<div class='parm2 editable medium' spellcheck='false' contentEditable='true'>"+
					parm2+"</div>"
			when 'function'
				"<div class='parm editable medium' spellcheck='false' contentEditable='true'>"+
					parm1+"</div>"+
				"<div class='parm2 editable medium' spellcheck='false' contentEditable='true'>"+
					parm2+"</div>"
			else
				"**UNKNOWN NAME**"
	
	flagError: (whichParm, start, length) ->
		#console.log("Box.flagError", whichParm, start, length)
		if whichParm == 1
			errorParm = $('#'+@id).find(".parm")
		else
			errorParm = $('#'+@id).find(".parm2")
		if length == 0
			errorParm.addClass("errorEmptyParm")
		else
			text = errorParm.text()
			newtext = text.slice(0, start) + "<span class='errorTextHighlight'>" +
				  text.slice(start, start+length) + "</span>" +
				  text.slice(start+length)
			#console.log(' errorParm', errorParm)
			#console.log(' newtext:', newtext)
			errorParm.html(newtext)
			errorParm.addClass('errorParm')

