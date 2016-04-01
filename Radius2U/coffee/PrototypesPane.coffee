# define some variables and constants
Radius = window.Radius
Commands = Radius.Commands
Box = Radius.Box

VERTICAL_COMMAND_SEPARATION = 10

# called by jQuery's onReady handler
Radius.PrototypesOnReady = ->
	console.log("in Radius.PrototypesOnReady")
	
	commandNames = ['clear', 'show', 'while', 'assign', 'if', 'else', 'function',
					'function return', 'do']
	offset = $('#PrototypesPane').offset()
	left = offset.left + 10
	top = offset.top + VERTICAL_COMMAND_SEPARATION
	for c in commandNames
		bx = new Box(c, 'PrototypesPane').setPos(left, top)
		#Radius.TheBlockList.addBoxToPrototypes(bx)
		top += $('#'+bx.id).outerHeight() + VERTICAL_COMMAND_SEPARATION
	
	# Double-click on a block over the name (its draghandle) selects it and all children
	# This applies to all boxes, prototypes and real command boxes
	$('#PageBody').on "dblclick", ".draghandle", (event) ->
		#console.log("double clicked on ", event.target)
		#console.log("parent", $(event.target).parent())
		boxID = $(event.target).parent().attr("id")
		console.log('id', boxID)
		event.stopPropagation()     # don't bubble up to #ProgrammingPane
		#!console.log("allPrototypes:", Radius.allPrototypes.boxList())
		dblclickbox = Radius.allBoxes.find(boxID)
		dblclickbox.onDoubleClick()
