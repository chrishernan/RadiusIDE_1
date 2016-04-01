### Radius1 sets up "global" variables.  It must be the first .js to be executed.
###

window.Radius = {}

Radius = window.Radius

# jQuery's onReady handler
jQuery ->
	window.Radius.PrototypesOnReady()
	initAllBoxes()
	window.Radius.ProgrammingPaneOnReady()
	$("#PrototypesPane").draggable()
	$("#ProgrammingPane").draggable()
			#drag: @onDrag
			#stop: @onDragStop
	

initAllBoxes = ->
	Radius.TheBlockList = new Radius.BlockList()
	startBlock = new Radius.Block(new Radius.Box("Start", "ProgrammingPane").setPos(20, 20))
	Radius.TheBlockList.addBlock(startBlock)

