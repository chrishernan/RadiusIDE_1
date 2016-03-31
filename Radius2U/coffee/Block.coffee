Radius = window.Radius
TheBlockList = Radius.TheBlockList
Block = Radius.Block

blockIndent = 15
closeEnoughToAttach = 10
barStack = []  # used in lineupBlock recursive calls


# BlockList class is a singleton, holding several lists of Blocks	
# ------------------------

class Radius.BlockList
	constructor: () ->
		#@prototypes = []	# disjoint from @blocks - now not used
		@blocks = []		# all blocks in the programming pane
		#@start = null		# points at an element in @blocks
		@functions = []		# subset of @blocks
	
	#getPrototypesBlock: () ->
	#	return @prototypes
	
	addBlock: (block1) ->
		@blocks.push(block1)
		#if block1.list.length > 0 and block1.list[0].name == "Start"
		#	@start = @blocks[@blocks.length - 1]		# points to that newly pushed block1
		# And something similar for @functions

	deleteBlock: (block) ->
		n = @blocks.indexOf(block)
		if n == -1
			console.log("**ERROR** in BlockList.deleteBlock, could not find", block, "in", this)
		else
			@blocks.splice(n, 1)

	getStartBlock: () ->
		for bl in @blocks
			if bl.list[0].name == 'Start'
				return bl
		console.log('**getStartBlock returns null')
		return null

	display: () ->
		console.log('--------', @blocks.length, 'blocks --------')
		for bl in @blocks
			bl.blockDisplay()
		return
		for bl, i in @blocks
			out = "blk " + i + " "
			for b in bl.list
				out += b.id + " " + b.name + ", "
			console.log(out)

	loadFromStorage: (o) ->
		$('#ProgrammingPane').empty()   # zap all Box DOM objects


# Block class holds one or more Box objects and/or (interior) Block objects
# ------------------------

class Radius.Block
	constructor: (box) ->
		@list = []		# the elements in list are either Blocks or Boxes
		if box?
			if Array.isArray(box)		#is the parameter an array (a Block.list)?
				@list = box
				for b in @list
					b.parentBlock = this
			else						# it's just a single Box object
				@list.push(box)
				box.parentBlock = this
		@isABox = false
		@parentBlock = null

	# OBSOLETE:
	# if box is the first element in this block, move all elements;
	# otherwise, split this block and start moving the new block
	# NEW:
	# moveTo assumes that box is the first box in the block
	moveTo: (box, newX, newY) ->
		if box == @list[0]	# is this the first box in the block?
			@lineUpBlock(newX, newY)
		else
			console.log("***ERROR*** in Block.moveTo, not first box", box, "in", this)
			#pos = @list.indexOf(box)
			#boxesInNewBlock = @list.splice(0, pos)
			#new Block()
			# TODO - figure this out
			#newBlock = TheBlockList.newLooseBlock(restoflist)
			#newBlock.moveBlock(xDelta, yDelta)

	lineUpBlock: (xStart, yStart) ->
		# An empty block (inside a while or if) still is given some height.
		return (yStart + 20) if @list.length == 0
		if xStart? and yStart?
			xPos = xStart
			yPos = yStart
		# can @list[0] be a block? -- think not
		# should this go to the topmost parent?
		# should barstack = [] be done here?
		else
			if @parentBlock?
				return @parentBlock.lineUpBlock()
			xPos = @list[0].x
			yPos = @list[0].y
		for b in @list
			#console.log("xPos", xPos, "yPos", yPos)
			if b.isABox
				b.setPos(xPos, yPos)
				if b.name == 'bar'
					barStack.push(b)
				else
					yPos = (b.getBottom() - 1)   # -1 to force overlap
			else # b is a block
				blockBottom = b.lineUpBlock(xPos + blockIndent, yPos)
				yPos = blockBottom
				if barStack.length > 0
					theBar = barStack.pop()
					$('#'+theBar.id).height(yPos - theBar.y)
		return yPos
	
	# Split this block into two blocks, so that box is the first box in the new block
	split: (box) ->
		n = @list.indexOf(box)
		if n == 0				# if box is the start of the block, then 
			if @parentBlock?
				n = @parentBlock.list.indexOf(this)
				if n == -1
					console.log("**ERROR** in Block.split, could not find", this, "in", @parentBLock)
				else
					# move this out of parentBlock and replace it with an empty block
					newBlock = new Block()
					newBlock.parentBlock = @parentBlock
					@parentBlock.list.splice(n, 1, newBlock)  # replace this with newBlock
					@parentBlock = null
					Radius.TheBlockList.addBlock(this)
					barStack = []
					newBlock.parentBlock.lineUpBlock()
					return
			else
				return				# this method is a no-op
		if n == -1
			console.log("**ERROR** in Block.split, could not find", box, "in", this)
			return
		newList = @list.splice(n, 9999)
		newBlock = new Block(newList)
		console.log('in split, newblock:', n)
		newBlock.blockDisplay()
		newBlock.lineUpBlock()
		Radius.TheBlockList.addBlock(newBlock)
		return
	
	# Append box2 after box1, in the same block (the one box1 is in).
	# Also appends all boxes after box2 in box2's block.
	# If box1 is a 'while' or an 'if', box2 and its followers are inserted
	# at the beginning of the box controlled by the 'while' or 'if'.
	append: (box1, box2) ->
		box2Parent = box2.parentBlock
		insertLoc = @list.indexOf(box1)
		if insertLoc == -1
			console.log("***ERROR*** in Block.append, could not find", box1, "in", this)
			return
		if box1.name == 'while' or box1.name == 'if' or box1.name == 'function'
			insertBlock = @list[insertLoc+2]
			insertLoc = -1
		else
			insertBlock = this
		for b in box2Parent.list
			insertLoc++
			insertBlock.list.splice(insertLoc, 0, b)
			b.parentBlock = insertBlock
		Radius.TheBlockList.deleteBlock(box2Parent)
		barStack = []
		@lineUpBlock()


	# add attaches a box or block to this block at the end, and then re-aligns the block
	# only used by ProgrammingPaneOnReady
	add: (boxOrBlock) ->
		boxOrBlock.parentBlock = this
		@list.push boxOrBlock
		barStack = []
		@lineUpBlock()

	# get rid of entire block, and flag all boxes as delete'd
	deleteBlock: () ->
		@delete1()
		if @list[0].name == "Start"
			@list.splice(1, @list.length)		# remove all but the 0th element
			$('#'+@list[0].id).animate {left:20, top:20}, 600, () => 
					@list[0].setPos(20, 20)
					@list[0].target()
		else
			Radius.TheBlockList.deleteBlock(this)

	# recursive helper method to fadeout and delete dom elements
	delete1: () ->
		for b in @list
			if b.isABox
				if b.name != "Start"
					$('#'+b.id).fadeOut("normal", => $('#'+b.id).remove())
					b.deleted = true
			else	# b is a block
				b.delete1()

	# adds the beingDragged class to all boxes in the block, recursively
	flagAsDragged: () ->
		for b in @list
			if b.isABox
				$('#'+b.id).addClass 'beingDragged'
			else
				b.flagAsDragged()
		return

	remove: (box) ->
		n = @list.indexOf(box)
		if n == -1
			console.log("**ERROR** in Block.remove, could not find", box, "in", this)
		else
			@list.splice(n, 1)

	# addEnd is called on while and if prototypes as they are dropped in the ProgrammingPane.
	# The @list for a while is 0: while  1: bar  2: enclosed block (can be empty)  
	# 3: endwhile
	addEnd: () ->
		if @list.length > 1
			console.log("**ERROR** in Block.addEnd, @list is too long:", @list.length)
			return
		@add(new Radius.Box('bar', 'ProgrammingPane'))
		@add(new Block())
		@add(new Radius.Box('endwhile', 'ProgrammingPane'))

	find: (id) ->

	boxList: () ->  # TODO: make work for Blocks as well
		@list

	getParms: () ->
		for box in @boxes
			box.getParms()

	findAttachable: (movingBox) ->
		x1 = movingBox.x
		y1 = movingBox.y
		#!If a prototype, convert to ProgrammingPane coordinates
		if movingBox.isAPrototype
			x1 += $('#PrototypesPane').offset().left - $('#ProgrammingPane').offset().left 
			y1 += $('#PrototypesPane').offset().top - $('#ProgrammingPane').offset().top
		for boxOrBlock in @list
			if boxOrBlock.isABox
				b = boxOrBlock
				if b isnt movingBox and not b.deleted and b.name isnt 'bar' and
				y1 <= b.getBottom() + closeEnoughToAttach and
				y1 >= b.y - closeEnoughToAttach and
				x1 >= b.x - closeEnoughToAttach and
				x1 <= b.getRight() + closeEnoughToAttach and
				movingBox.okToAttach(b)
					return b
			else # list element is a block
				attBox = boxOrBlock.findAttachable(movingBox)
				if attBox?
					return attBox
		# end for loop
		return null
	
	blockDisplay: (d) ->
		if not d?
			d = '>'
			if @list.length > 0
				console.log('at (', @list[0].x, @list[0].y, ')')
		if @list.length == 0
			console.log(d, '--empty block--')
			return
		for b in @list
			if b.isABox
				console.log(d, b.name, b.parm1, b.parm2)
			else
				b.blockDisplay(d+' >')



