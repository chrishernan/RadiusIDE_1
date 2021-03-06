// Generated by CoffeeScript 1.10.0

/*
 doCompile.coffee
 contains these methods:
 RadiusCompile(codeMirror)  // public score
 buildCommandList()         // turns tokens array into commandList array
 buildParseTree(n1, n2)     // called by buildCommandList, works on a single command
 getIndexOfNextCommand()    // helper for buildCommandList
 tokenize(String, linenum)  //
 cleanUpTokens
 makeReadableCommandList()  //
 */

(function() {
  var Radius, Token, buildCommandList, compileAssign, compileClear, compileElse, compileEndfunction, compileEndif, compileEndwhile, compileFunction, compileIf, compileReturn, compileShow, compileWhile, currToken, findColon, getSubscripts, multiCommandStack, noteError, noteErrorToken, parseNpush, rad, stringifyToken, tokenFind;

  Radius = window.Radius;

  rad = Radius.Code;

  Token = Radius.Token;

  currToken = null;

  multiCommandStack = [];

  rad.precedence = {
    ".": 900,
    "[": 900,
    "?": 800,
    "?s": 800,
    "?n": 800,
    "?o": 800,
    "?b": 800,
    "not": 700,
    "U-": 700,
    "*": 500,
    "/": 500,
    "+": 400,
    "-": 400,
    "=": 300,
    "!=": 300,
    "<": 300,
    ">": 300,
    ">=": 300,
    "<=": 300,
    "and": 200,
    "or": 150,
    "&": 100,
    "&&": 100,
    ",": 50
  };

  Radius.RadiusCompile = function() {
    var errors3;
    buildCommandList();
    if (rad.errors.length > 0) {
      errors3 = rad.errors.splice(0, 3);
      errors3.push(null);
      return errors3;
    }
    return [rad.commandList];
  };

  buildCommandList = function() {
    var closingCommand, donothing, endPos, functionList, start;
    start = 0;
    endPos = 0;
    functionList = [];
    multiCommandStack = [];
    while (start < rad.tokens.length) {
      currToken = rad.tokens[start];
      if (currToken.val.indexOf('#') === 0) {
        if (currToken.val === '#WHILE' || currToken.val === '#IF') {
          closingCommand = '#ENDCONDITION';
        } else if (currToken.val === "#FUNCTION") {
          closingCommand = '#ENDPARMS';
        } else if (currToken.val === '#ENDWHILE' || currToken.val === '#ELSE' || currToken.val === '#ENDIF' || currToken.val === '#ENDFUNCTION') {
          closingCommand = currToken.val;
        } else {
          closingCommand = '#END' + currToken.val.substring(1);
        }
      } else {
        console.log("***doCompile.buildCommandList, expected command with #, found", currToken);
        return;
      }
      endPos = tokenFind(closingCommand, start);
      if (endPos <= -1) {
        console.log("in buildCommandList, could not find", '#END' + currToken.val, start);
        return;
      }
      switch (currToken.val) {
        case "#START":
          donothing = 1;
          break;
        case "#ASSIGN":
          compileAssign(start, endPos);
          break;
        case "#SHOW":
          compileShow(start, endPos);
          break;
        case "#CLEAR":
          compileClear(start, endPos);
          break;
        case "#IF":
          compileIf(start, endPos);
          break;
        case "#ENDIF":
          compileEndif(start, endPos);
          break;
        case "#ELSE":
          compileElse(start, endPos);
          break;
        case "#WHILE":
          compileWhile(start, endPos);
          break;
        case "#ENDWHILE":
          compileEndwhile(start, endPos);
          break;
        case "#FUNCTION":
          compileFunction(start, endPos);
          break;
        case "#ENDFUNCTION":
          compileEndfunction(start, endPos);
          break;
        case "#RETURN":
          compileReturn(start, endPos);
          break;
        default:
          console.log("in buildCommandList, unexpected command:", currToken.val, start);
          return;
      }
      start = endPos + 1;
    }
  };

  compileAssign = function(start, endPos) {
    var getsPos, varname;
    getsPos = tokenFind("#GETS", start);
    if (getsPos - start === 1 || getsPos < 0) {
      noteError(rad.tokens[start].id, 1, 0, 0, "No variable to assign value to.  (C30A)");
      return;
    }
    if (endPos - getsPos === 1) {
      noteError(rad.tokens[start].id, 2, 0, 0, "No value to assign.  (C30B)");
      return;
    }
    parseNpush(getsPos + 1, endPos - 1);
    parseNpush(start + 1, getsPos - 1);
    if (start + 1 === getsPos - 1 && (rad.tokens[start + 1].type = Token.LVal)) {
      varname = rad.tokens[start + 1].val;
      if (varname === "true" || varname === "false") {
        noteErrorToken(rad.tokens[start + 1], "Cannot redefine " + varname + ". (C30)");
      }
    }
    return rad.commandList.push(rad.tokens[start]);
  };

  compileShow = function(start, endPos) {
    var w, windowIndex, wtok;
    if (endPos > (start + 1) && rad.tokens[start + 1].sym === "@") {
      if (endPos <= start + 2) {
        return noteErrorToken(rad.tokens[start + 1], "@ must be followed by a number between 1 and 100. (C30a)");
      } else if (rad.tokens[start + 2].type !== NUMBER) {
        return noteErrorToken(rad.tokens[start + 2], "@ must be followed by a number between 1 and 100. (C30b)");
      } else {
        wtok = rad.tokens[start + 2];
        w = wtok.val;
        if (SchemeNumber.fn["<"](w, Radius.SN1)) {
          noteErrorToken(wtok, "Window index cannot be less than 1. (C31)");
        }
        if (SchemeNumber.fn[">"](w, Radius.SN100)) {
          noteErrorToken(wtok, "Window index must be 100 or less. (C32)");
        }
        if (!SchemeNumber.fn["integer?"](w)) {
          noteErrorToken(wtok, "Window index must be an integer. (C33)");
        }
        windowIndex = parseInt(w.toString(), 10);
        if (endPos - start === 3) {
          noteError(currToken.id, 1, 0, 0, "Nothing to show has been entered. (C34)");
        }
        parseNpush(start + 3, endPos - 1);
        return rad.commandList.push($.extend(currToken, {
          windowIndex: windowIndex
        }));
      }
    } else {
      if (endPos - start === 1) {
        return noteError(currToken.id, 1, 0, 0, "Nothing to show has been entered. (C35)");
      } else {
        parseNpush(start + 1, endPos - 1);
        return rad.commandList.push(rad.tokens[start]);
      }
    }
  };

  compileClear = function(start, endPos) {
    rad.commandList.push(rad.tokens[start]);
  };

  compileWhile = function(start, endPos) {
    if (endPos - start === 1) {
      noteError(currToken.id, 0, 0, "No test specified in while.  (C42A)");
      return;
    }
    currToken = rad.tokens[start];
    currToken.startOfCond = rad.commandList.length;
    parseNpush(start + 1, endPos - 1);
    multiCommandStack.push(currToken);
    currToken.depth = multiCommandStack.length;
    rad.commandList.push(currToken);
  };

  compileEndwhile = function(start, endPos) {
    var matchingWhileToken;
    matchingWhileToken = multiCommandStack.pop();
    if ((matchingWhileToken != null) && matchingWhileToken.val === "#WHILE") {
      currToken.depth = matchingWhileToken.depth;
      currToken.getBack = rad.commandList.length - matchingWhileToken.startOfCond;
      rad.commandList.push(currToken);
    } else {
      noteError(currToken.id, currToken.start, 4, currToken.val + " is not preceded by a matching #WHILE. (C43)");
    }
  };

  compileIf = function(start, endPos) {
    parseNpush(start + 1, endPos - 1);
    multiCommandStack.push(currToken);
    currToken.depth = multiCommandStack.length;
    currToken.sawElse = false;
    return rad.commandList.push(currToken);
  };

  compileElse = function(start, endPos) {
    if (multiCommandStack.length > 0 && multiCommandStack[multiCommandStack.length - 1].val === "#IF") {
      if (multiCommandStack[multiCommandStack.length - 1].sawElse) {
        return noteError(currToken.id, currToken.start, 4, currToken.val + " is a second ELSE. (C40)");
      } else {
        multiCommandStack[multiCommandStack.length - 1].sawElse = true;
        currToken.depth = multiCommandStack.length;
        return rad.commandList.push(currToken);
      }
    } else {
      return noteError(currToken.id, currToken.start, 4, currToken.val + " is not preceded by a matching IF. (C41)");
    }
  };

  compileEndif = function(start, endPos) {
    var matchingIfToken;
    matchingIfToken = multiCommandStack.pop();
    if ((matchingIfToken != null) && matchingIfToken.val === "#IF") {
      currToken.depth = matchingIfToken.depth;
      return rad.commandList.push(currToken);
    } else {
      return noteError(currToken.id, currToken.start, 4, currToken.val + " is not preceded by a matching IF. (C42)");
    }
  };

  compileFunction = function(start, endPos) {
    var comma, endnamePos, fnName, fnStart, n, numItems, numParms, parm;
    if (multiCommandStack.length > 0) {
      noteError(currToken.id, currToken.st, 4, "define function must be used at the top level. (C45!)");
    }
    fnStart = rad.commandList.length;
    fnName = "";
    rad.commandList.push(currToken);
    endnamePos = tokenFind("#ENDNAME", start);
    if (endnamePos === start + 1) {
      noteError(currToken.id, 0, 0, "No name specified for function.  (C44A)");
      return;
    }
    if (endnamePos > start + 2) {
      noteError(currToken.id, currToken.st, currToken.length, "Invalid name specified for function.  (C44B)");
      return;
    }
    if (rad.tokens[start + 1].type !== Token.Function) {
      noteError(currToken.id, currToken.st, currToken.length, "Not a valid function name. (C47)");
      return;
    }
    rad.commandList.push(rad.tokens[start + 1]);
    fnName = rad.tokens[start + 1].val;
    numItems = endPos - (endnamePos + 1);
    numParms = 0;
    if (numItems > 0) {
      numParms - (numItems + 1) / 2;
    }
    rad.commandList.push(new Token(Token.Counter, numParms, currToken.id, 0));
    n = endnamePos + 1;
    while (n < endPos) {
      parm = rad.tokens[n];
      if (parm.type === RVAL) {
        rad.commandList.push(parm);
      } else {
        noteError(parm.id, parm.start + 0.5, parm.length, "Not a valid function parameter: " + parm.val + ". (C46)");
        return;
      }
      if (n + 1 < endPos) {
        comma = rad.tokens[n + 1];
      }
      if (comma.val !== ",") {
        noteError(parm.id, parm.start + 0.5, parm.length, parm.va + " should be followed by a comma.  (C46A)");
        return;
      }
      if (n + 2 >= endPos) {
        noteError(comma.id, comma.start + 0.5, comma.length, "Comma should be followed by a parameter. (C46B)");
        return;
      }
      n = n + 2;
    }
    if (fnName !== "") {
      return functionList.push({
        name: fnName,
        start: fnStart,
        end: -1
      });
    }
  };

  compileEndfunction = function(start, endPos) {};

  compileReturn = function(start, endPos) {};

  parseNpush = function(start, end) {
    var c, colonPos, commas, donothing, eEnd, eStart, end2, firstToken, i, indexOfLowest, isArray, isObject, j, k, key, lastToken, lowestPrecedenceSoFar, n, numArgs, opPrecedence, opToken, ref, ref1, ref2, secondToken, tok;
    if (rad.parsingError) {
      return;
    }
    if (start === end) {
      rad.commandList.push(rad.tokens[start]);
      return;
    }
    if (rad.tokens[start].sym === "[" && rad.tokens[end].sym === "]" && rad.tokens[start].serial === rad.tokens[end].serial) {
      if (start + 1 === end) {
        rad.commandList.push(new Token(Token.Counter, 0));
        rad.commandList.push(new Token(Token.Operator, "[]"));
        return;
      }
      isArray = false;
      isObject = false;
      commas = (function() {
        var j, ref, ref1, results;
        results = [];
        for (i = j = ref = start + 1, ref1 = end - 1; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
          if (rad.tokens[i].val === "," && rad.tokens[i].depth === rad.tokens[start].depth + 1) {
            results.push(i);
          }
        }
        return results;
      })();
      commas.push(end);
      eStart = start + 1;
      for (c = j = 0, ref = commas.length; j < ref; c = j += 1) {
        eEnd = commas[c] - 1;
        if (eStart > eEnd) {
          noteErrorToken(rad.tokens[commas[c]], "Something is missing before the " + rad.tokens[commas[c]].val + ". (C70)");
          return;
        }
        colonPos = findColon(eStart, eEnd, rad.tokens[eStart].depth);
        if (colonPos === -1) {
          if (isObject) {
            noteErrorToken(rad.tokens[eStart], "A label is missing here. (C71)");
            return;
          } else {
            isArray = true;
          }
          parseNpush(eStart, eEnd);
        } else {
          key = rad.tokens[colonPos - 1];
          if (isArray) {
            noteErrorToken(key, "A label can't be used in an array. (C72)");
            return;
          } else {
            isObject = true;
          }
          if (colonPos === eStart) {
            noteErrorToken(key, "Identifier is missing before the colon. (C73)");
          } else if (colonPos > eStart + 1) {
            noteErrorToken(key, "Put a single identifier before the colon. (C74)");
          } else if (key.type === NUMBER) {
            noteErrorToken(key, "Label must be an identifier, not a number. (C75)");
          } else if (key.type === STRING) {
            noteErrorToken(key.id, key.whichParm, key.start, key.val.length + 2, "Label must be an identifier, not a string in quotes. (C76)");
          } else if (key.type !== LABEL) {
            noteErrorToken(key, "Label must be an identifier. (C77)");
          } else if (rad.tokens[colonPos + 1].sym === "," || rad.tokens[colonPos + 1].sym === "]") {
            noteErrorToken(rad.tokens[colonPos], "Value is missing after the colon. (C78)");
          } else if (key.val.toLowerCase() === "false" || key.val.toLowerCase() === "true") {
            noteErrorToken(key, "Cannot use " + key.val + " as a label. (C79)");
          } else {
            parseNpush(colonPos + 1, eEnd);
            rad.commandList.push(key);
            rad.commandList.push(new Token(Token.Operator, "attr"));
          }
        }
        eStart = commas[c] + 1;
      }
      rad.commandList.push(new Token(Token.Counter, commas.length));
      rad.commandList.push(new Token(Token.Operator, "[]"));
      return;
    }
    if (end > start + 1 && (rad.tokens[start].type === Token.Function || rad.tokens[start].type === Token.RVal) && rad.tokens[start + 1].sym === "(" && rad.tokens[end].sym === ")" && rad.tokens[start + 1].serial === rad.tokens[end].serial) {
      if (rad.tokens[start].type === RVAL) {
        noteError(rad.tokens[start].id, rad.tokens[start].start, rad.tokens[start].length, rad.tokens[start].val + " is not a function. (C90A)");
        return;
      }
      if (start + 2 === end) {
        numArgs = 0;
      } else {
        commas = (function() {
          var k, ref1, ref2, results;
          results = [];
          for (i = k = ref1 = start + 1, ref2 = end - 1; ref1 <= ref2 ? k <= ref2 : k >= ref2; i = ref1 <= ref2 ? ++k : --k) {
            if (rad.tokens[i].sym === "," && rad.tokens[i].depth === rad.tokens[start].depth + 1) {
              results.push(i);
            }
          }
          return results;
        })();
        commas.push(end);
        numArgs = commas.length;
        c = 0;
        eStart = start + 2;
        while (c < commas.length) {
          eEnd = commas[c] - 1;
          if (eStart > eEnd) {
            noteError(rad.tokens[commas[c]].id, rad.tokens[commas[c]].start, 1, "Something is missing before the " + rad.tokens[commas[c]].val + ". (C90)");
            return;
          }
          parseNpush(eStart, eEnd);
          eStart = commas[c] + 1;
          c++;
        }
      }
      rad.commandList.push({
        va: numArgs,
        ty: COUNTER
      });
      rad.commandList.push(rad.tokens[start]);
      rad.commandList.push({
        va: "fncall",
        ty: OP
      });
      return;
    }
    if (rad.tokens[start].sym === "(" && rad.tokens[end].sym === ")" && rad.tokens[start].serial === rad.tokens[end].serial) {
      parseNpush(start + 1, end - 1);
      return;
    }
    lowestPrecedenceSoFar = 9999;
    for (n = k = ref1 = start, ref2 = end; k <= ref2; n = k += 1) {
      tok = rad.tokens[n];
      if (tok.type === Token.Operator && tok.depth === rad.tokens[start].depth) {
        if (tok.val === "not" || (tok.val === "-" && (n === start || rad.tokens[n - 1].type === Token.Operator))) {
          donothing = 1;
        } else {
          opPrecedence = rad.precedence[tok.val];
          if (opPrecedence <= lowestPrecedenceSoFar) {
            indexOfLowest = n;
            lowestPrecedenceSoFar = opPrecedence;
          }
        }
      }
    }
    if (rad.parsingError) {
      return;
    }
    if (lowestPrecedenceSoFar < 9999) {
      if (indexOfLowest === start) {
        noteErrorToken(rad.tokens[start], "Operator " + rad.tokens[start].val + " is out of place or missing a value to its left. (C91)");
      } else if (indexOfLowest === end) {
        noteErrorToken(rad.tokens[end], "Operator " + rad.tokens[end].val + " is out of place or missing a value to its right. (C92)");
      } else {
        opToken = rad.tokens[indexOfLowest];
        if (opToken.sym === "[") {
          if (rad.tokens[end].sym !== "]") {
            console.log("*** found", rad.tokens[end]);
          }
          parseNpush(start, indexOfLowest - 1);
          parseNpush(indexOfLowest + 1, end - 1);
          opToken.val = "index";
          rad.commandList.push(opToken);
        } else {
          parseNpush(start, indexOfLowest - 1);
          parseNpush(indexOfLowest + 1, end);
          if (opToken.val === ".") {
            opToken.val = "index";
          }
          rad.commandList.push(opToken);
        }
      }
      return;
    }
    firstToken = rad.tokens[start];
    if (firstToken.sym === "-") {
      parseNpush(start + 1, end);
      firstToken.val = "U-";
      rad.commandList.push(firstToken);
      return;
    }
    if (firstToken.sym === "not") {
      parseNpush(start + 1, end);
      rad.commandList.push(firstToken);
      return;
    }
    lastToken = rad.tokens[end];
    secondToken = rad.tokens[start + 1];
    end2 = secondToken.start + secondToken.length;
    noteError(firstToken.id, firstToken.whichParm, firstToken.start, end2 - firstToken.start, "An operator seems to be missing between " + stringifyToken(firstToken) + " and " + stringifyToken(secondToken) + " (C93)");
  };

  tokenFind = function(name, pos) {
    var i, j, ref, ref1;
    for (i = j = ref = pos, ref1 = rad.tokens.length; ref <= ref1 ? j < ref1 : j > ref1; i = ref <= ref1 ? ++j : --j) {
      if (name === rad.tokens[i].val) {
        return i;
      }
      if (name.indexOf("#END") === 0 && rad.tokens[i].val === "#END") {
        return i;
      }
    }
    console.log("Could not find " + name + ", starting at " + pos);
    return -1;
  };

  getSubscripts = function(start, end) {
    var leftPos, leftSerial, pos, subscripts;
    subscripts = [];
    pos = start;
    while (pos <= end) {
      if (rad.tokens[pos].sym === ".") {
        subscripts.push(pos);
        if (pos === end) {
          return [];
        }
        pos = pos + 2;
      } else if (rad.tokens[pos].sym === "[") {
        leftPos = pos;
        leftSerial = rad.tokens[pos].serial;
        while (!(pos > end || (rad.tokens[pos].sym === "]" && (rad.tokens[pos].serial = leftSerial)))) {
          pos++;
        }
        if (pos > end || rad.tokens[pos].sym !== "]") {
          return [];
        }
        subscripts.push(leftPos);
        pos++;
      } else {
        pos++;
      }
    }
    return subscripts;
  };

  stringifyToken = function(token) {
    console.assert(token.val != null);
    if (typeof token.val === 'string') {
      return token.val;
    }
    if (token.val instanceof SchemeNumber) {
      return token.val.toString();
    }
    return token.val;
  };

  findColon = function(eStart, eEnd, depth) {
    var i, j, ref, ref1;
    for (i = j = ref = eStart, ref1 = eEnd; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      if (rad.tokens[i].sym === ":" && rad.tokens[i].depth === depth) {
        return i;
      }
    }
    return -1;
  };

  noteErrorToken = function(token, message) {
    return noteError(token.id, token.whichParm, token.start, token.length, message);
  };

  noteError = function(id, whichParm, startPos, length, message) {
    if (typeof startPos === "number" && typeof length === "number" && (message != null)) {
      console.log("noteError", id, whichParm, startPos, length, message);
      rad.errors.push([id, whichParm, startPos, length, message]);
    } else {
      console.log("bad parms to noteError: ", id, whichParm, startPos, length, message);
    }
    return rad.parsingError = true;
  };

}).call(this);
