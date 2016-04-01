# The Token class represents one Token
# ---------------

Radius = window.Radius

class Radius.Token
	@String = "ST"
	@Number = "NU"
	@Word = "WD"
	@Symbol = "SY"
	@Operator = "OP"
	@Function = "FN"
	@Label = "LB"
	@Counter = "CT"
	@Array = "[]"
	@Object = "OB"
	@LVal = "LV"
	@RVal = "RV"
	@Command = "CM"
	@NoVal = "??"
	@Bool = "BL"
	@Eject = "!!"
	
	# Note: @start is relative to the text in the .parm or in the .parm2
	# OK to call constructor supplying only first two args
	constructor: (@type, @text, @id='none', @whichParm=0, @start=0, @length=0) ->  
		@val = @text  # @val is the processed and normalized value of the token
		@error = false
		@sym = ""     # can be ( or ) or [ or ] but only if Operator, not if String
		@depth = 0    # keep track of nesting with parens, brackets, etc.
		@serial = 0   # also for making sure that parens and brackets line up
		if @type == Token.Word or @type == Token.Operator
			@val = @text.toLowerCase()
		if @type == Token.Counter
			@val = +@text     # convert to number
		if @type == Token.Number
			sn = SchemeNumber.fn["string->number"]("#e" + @text)
			if sn
				@val = sn
			else  # SchemeNumber returns false when it cannot parse the text into a number
				console.log("Token ctor: this token couldn't be handled by SchemeNumber:", @text)
				@val = null
				@error = true
		if @type == Token.Symbol
			@sym = @text


### a token is an object with these attributes:

  .va     a string, later also a SchemeNumber
  .ty     NUMBER, COMMAND, LVAL, RVAL, LABEL, FUNCTION, SYMBOL, OPERATOR (and WORD temporarily)
  .id     a DOM id
  .st     starting location in the DOM id's text
  .sy     same as .va for SYMBOLs or [ or ], otherwise ""
  .depth  nesting depth for (, ), [, ], comma, or operator
          also used in IF and WHILE blocks
  
  NUMBER:  starts with a digit, ok'd by SchemeNumber
  COMMAND: starts with #   (this will have to change)
  STRING:  anything enclosed in "" or ''
  SYMBOL:  matches validSymbol + - * / [ ] ? ( ) & . = , ! :
            or validSymbol2    <= >= != <- &&
  WORD:    anything else delimited; later transformed into one of the following
   OPERATOR:  a WORD or SYMBOL that matches validOperator
                + - * / & && and or not ? [ . ?O ?B < = != <=
   FUNCTION:  a user-defined or built-in function name
   LABEL:     when followed by :  (as in [mylabel: 10]
              or when preceded by .  (as in variable.mylabel)
   LVAL:      when preceded by #ASSIGN
   RVAL:      a WORD that isn't one of the previous cases
   
###
