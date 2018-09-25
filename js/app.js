$(document).ready(function() {

/* ===== Model ==== */
  // Seeder Base
  var variables = ['a','b','c','d','e','f','g','h','i'];

  // Fill Options
  var numbers = [1,2,3,4,5,6,7,8,9];

  var shapes = ['&#9733','&#9829','&#9790','&#9635',
                '&#9650','&#9673','&#10047','&#9728','&#9729'];

  var colors = ["<div class=\"color-button\" id=\"red\"></div>",
                "<div class=\"color-button\" id=\"orange\"></div>",
                "<div class=\"color-button\" id=\"yellow\"></div>",
                "<div class=\"color-button\" id=\"green\"></div>",
                "<div class=\"color-button\" id=\"blue\"></div>",
                "<div class=\"color-button\" id=\"purple\"></div>",
                "<div class=\"color-button\" id=\"pink\"></div>",
                "<div class=\"color-button\" id=\"grey\"></div>",
                "<div class=\"color-button\" id=\"lime\"></div>"];

  var shuffledShapes = shuffle(shapes);
  var shuffledNumbers = shuffle(numbers);

  var colorsAndShapes = ["<span class=\"red\">" + shuffledShapes[0] + "</span>",
                      "<span class=\"orange\">" + shuffledShapes[1] + "</span>",
                      "<span class=\"yellow\">" + shuffledShapes[2] + "</span>",
                      "<span class=\"green\">" + shuffledShapes[3] + "</span>",
                      "<span class=\"blue\">" + shuffledShapes[4] + "</span>",
                      "<span class=\"purple\">" + shuffledShapes[5] + "</span>",
                      "<span class=\"pink\">" + shuffledShapes[6] + "</span>",
                      "<span class=\"grey\">" + shuffledShapes[7] + "</span>",
                      "<span class=\"lime\">" + shuffledShapes[8] + "</span>"];

  var colorsAndNumbers = ["<span class=\"red\">" + shuffledNumbers[0] + "</span>",
                      "<span class=\"orange\">" + shuffledNumbers[1] + "</span>",
                      "<span class=\"yellow\">" + shuffledNumbers[2] + "</span>",
                      "<span class=\"green\">" + shuffledNumbers[3] + "</span>",
                      "<span class=\"blue\">" + shuffledNumbers[4] + "</span>",
                      "<span class=\"purple\">" + shuffledNumbers[5] + "</span>",
                      "<span class=\"pink\">" + shuffledNumbers[6] + "</span>",
                      "<span class=\"grey\">" + shuffledNumbers[7] + "</span>",
                      "<span class=\"lime\">" + shuffledNumbers[8] + "</span>"];

  // Starting Seeder Puzzle
  var startingSeeder = [[["i", "h", "a"], ["e", "c", "d"], ["g", "f", "b"]],
                        [["g", "c", "b"], ["h", "i", "f"], ["d", "e", "a"]],
                        [["e", "d", "f"], ["b", "g", "a"], ["c", "i", "h"]],
                        [["h", "b", "i"], ["c", "g", "f"], ["d", "a", "e"]],
                        [["c", "g", "e"], ["a", "b", "d"], ["f", "h", "i"]],
                        [["a", "f", "d"], ["h", "e", "i"], ["g", "c", "b"]],
                        [["a", "i", "g"], ["f", "e", "h"], ["b", "d", "c"]],
                        [["b", "d", "c"], ["i", "a", "g"], ["e", "f", "h"]],
                        [["f", "h", "e"], ["d", "b", "c"], ["i", "a", "g"]]];

  // Blank Seeder
  var seeder = [[[0,0,0],[0,0,0],[0,0,0]],
                [[0,0,0],[0,0,0],[0,0,0]],
                [[0,0,0],[0,0,0],[0,0,0]],
                [[0,0,0],[0,0,0],[0,0,0]],
                [[0,0,0],[0,0,0],[0,0,0]],
                [[0,0,0],[0,0,0],[0,0,0]],
                [[0,0,0],[0,0,0],[0,0,0]],
                [[0,0,0],[0,0,0],[0,0,0]],
                [[0,0,0],[0,0,0],[0,0,0]]];

  // Rows and Columns of Seeder for verification
  var rowsSeed = [[],[],[],[],[],[],[],[],[]];
  var columnsSeed = [[],[],[],[],[],[],[],[],[]];

  // Puzzle to update DOM
  var puzzle = [[],[],[],[],[],[],[],[],[]];

  // Verification Arrays
  var solution = [[],[],[],[],[],[],[],[],[]];
  var rows = [[],[],[],[],[],[],[],[],[]];
  var columns = [[],[],[],[],[],[],[],[],[]];
  var squares = [[],[],[],[],[],[],[],[],[]];

  // Game Type and Difficulty


  // Cells to Empty to render the Puzzle
  var coordinatesToRemove = [];

  var boxSelected = false;
  var variableSelected = false;

  var boxLocation = '';
  var variableValue = '';
  var cellCoordinates = [];

/* ===== View ===== */

  function makeButtons(insert) {
    console.log("Making Buttons");
    var buttons = '';
    var buttonVal = insert.sort();
    for (l = 0; l < variables.length; l++) {
      buttons += "<div class=\"button\">" + buttonVal[l] + "</div>";
    }
    $(".footer").append(buttons);
    console.log("Buttons Made")
  }

  function renderHTMLRows(insert) {
    var tableRows = '';
    for (var n = 0; n < puzzle.length; n++) {
      var row = puzzle[n];
      tableRows += "<tr class=\"row" + n + "\">";
      tableRows += renderHTMLColumns(row, insert);
      tableRows += "</tr>"
    }
    return tableRows;
  }

  function renderHTMLColumns(list, insert) {
    var tableColumns = '';
    for (var n = 0; n < list.length; n++) {
      var content = list[n];
      var classNumber = insert.indexOf(content);
      if (content !== '') {
        tableColumns += "<td class=\"col" + n + "\"><div class=\"box\" id=\"" + classNumber + "\">" + content + "</div></td>"
      } else {
        tableColumns += "<td class=\"col" + n + "\"><div class=\"box\" id=\"blank\"></div></td>"
      }
    }
    return tableColumns;
  }

  function popupMask() {
    var mHeight = $(document).height();
    var mWidth = $(window).width();
    $('.mask').css({
      'width': mWidth,
      'height': mHeight
    });
    $('.mask').fadeIn(500);
    $('.mask').fadeTo('slow', 0.9);
  };

  function startPopup() {
    var popupStart = '#start-popup';
    popupMask();
    $(popupStart).fadeIn(1000);
    $('.start').click(function() {
      $('.mask').hide();
      $('#start-popup').hide();
      loadGame();
    });
    $('.mask').click(function() {
      $(this).hide();
      $('#start-popup').hide();
      loadGame();
    });
  };

  function populateDOM(seed, insert, difficulty) {
    console.log("Rendering DOM");
    formatPuzzleForHTML(seed);
    populateSeed(insert);
    renderPuzzle(difficulty);
    makeButtons(insert);
    $(".puzzle").append(renderHTMLRows(insert));
    console.log("DOM Rendered");
  }

/* == Controller == */

  function shuffle(array) {
    var i = array.length;
    var j = 0;
    var temp;
    while (i--) {
        j = Math.floor(Math.random() * (i+1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  }

  function setRowCount(val) {
    var counter = 0;
    if (val < 3) {
      counter = 0;
    }
    if ((val > 2) && (val < 6)) {
      counter = 3;
    }
    if (val > 5) {
      counter = 6;
    }
    return counter;
  }

  function pushToPuzzle(row, rowI, loc) {
    for (var n = 0; n < row.length; n++) {
      var item = row[n];
      puzzle[loc + rowI].push(item);
      solution[loc + rowI].push(item);
    }
  }

  function selectRowToFormat(square, rowI) {
    for (var n = 0; n < square.length; n++) {
      var row = square[n]
      pushToPuzzle(row, rowI, n);
    }
  }

  function formatPuzzleForHTML(seed) {
    console.log("Formatting Puzzle for HTML");
    var rowCounter = 0;
    for (n = 0; n < puzzle.length; n++) {
      rowCounter = setRowCount(n);
      var square = seed[n];
      selectRowToFormat(square, rowCounter);
    }
    console.log("Formatted");
  }

  function squareFinder(rowNumber, colNumber) {
    var squareNumber = 0;
    if (rowNumber < 3) {
      if (colNumber < 3) {
        squareNumber = 0;
      }
      if ((colNumber > 2) && (colNumber < 6)) {
        squareNumber = 1;
      }
      if (colNumber > 5) {
        squareNumber = 2;
      }
    }
    if ((rowNumber > 2) && (rowNumber < 6)) {
      if (colNumber < 3) {
        squareNumber = 3;
      }
      if ((colNumber > 2) && (colNumber < 6)) {
        squareNumber = 4;
      }
      if (colNumber > 5) {
        squareNumber = 5;
      }
    }
    if (rowNumber > 5) {
      if (colNumber < 3) {
        squareNumber = 6;
      }
      if ((colNumber > 2) && (colNumber < 6)) {
        squareNumber = 7;
      }
      if (colNumber > 5) {
        squareNumber = 8;
      }
    }
    return squareNumber;
  }

  function populateColumns(rowCount, varIn, insertIn) {
    for (var n = 0; n < puzzle[rowCount].length; n++) {
      var squareCount = squareFinder(rowCount, n);
      var currentVar = varIn.indexOf(puzzle[rowCount][n]);
      if (currentVar !== -1) {
        var insertVar = insertIn[currentVar];
        puzzle[rowCount][n] = insertVar;
        solution[rowCount][n] = insertVar;
        if (rows[rowCount].length < 9) {
          rows[rowCount].push(insertVar);
        }
        if (columns[n].length < 9) {
          columns[n].push(insertVar);
        }
        if (squares[squareCount].length < 9) {
          squares[squareCount].push(insertVar);
        }
      }
    }
  }

  function populateRows(varIn, insertIn) {
    for (var n = 0; n < puzzle.length; n++) {
      populateColumns(n, varIn, insertIn);
    }
  }

  function populateSeed(insert) {
    console.log("Populating Seed");
    var shuffledVars = shuffle(variables);
    var shuffledInsert = shuffle(insert);
    for (var n = 0; n < shuffledVars.length; n++) {
      populateRows(shuffledVars, shuffledInsert);
    }
    console.log("Puzzle Seeded");
  }

  function renderPuzzle(difficulty) {
    console.log("Rendering Puzzle");
    while (coordinatesToRemove.length < difficulty) {
      var random1 = Math.floor(Math.random() * 9);
      var random2 = Math.floor(Math.random() * 9);
      var location = puzzle[random1][random2];
      var currentSquare = squareFinder(random1, random2);
      if (location !== '') {
        if (coordinatesToRemove.length > 0) {
          removeCoordinates(random1, random2);
        }
        removeVariable(random1, random2, currentSquare);
      }
    }
  }

  function removeVariable(var1, var2, square) {
    var newRow = [];
    var variable = puzzle[var1][var2];
    var nixRow = rows[var1].indexOf(variable);
    var nixCol = columns[var2].indexOf(variable);
    var nixSqr = squares[square].indexOf(variable);
    if ((nixRow !== -1) && (nixCol !== -1) && (nixSqr !== -1)) {
      rows[var1].splice(nixRow, 1);
      columns[var2].splice(nixCol, 1);
      squares[square].splice(nixSqr, 1);
    }
    newRow.push(var1);
    newRow.push(var2);
    variable = '';
    coordinatesToRemove.push(newRow);
  }

  function removeCoordinates(var1, var2) {
    for (var n = 0; n < coordinatesToRemove.length; n++) {
      var remove = coordinatesToRemove[n];
      var removeRow = remove[0];
      var removeCol = remove[1];
      var removeSqr = squareFinder(removeRow, removeCol);
      var removeVariable = puzzle[removeRow][removeCol];
      var nixRow = rows[var1].indexOf(removeVariable);
      var nixCol = columns[var2].indexOf(removeVariable);
      var nixSqr = squares[removeSqr].indexOf(removeVariable);
      if ((nixRow !== -1) && (nixCol !== -1) && (nixSqr !== -1)) {
        rows[removeRow].splice(nixRow, 1);
        columns[removeCol].splice(nixCol, 1);
        squares[removeSqr].splice(nixSqr, 1);
      }
      puzzle[removeRow][removeCol] = '';
    }
  }

  function validateRemoval() {

  }

  function selectBox() {
    var column = '';
    var row = '';
    $('.box').click(function() {
      var boxID = $(this).attr('id');
      if (boxID === 'blank') {
        boxSelected = true;
        if ((column !== '') && (row !== '')) {
          $("tr." + row).find("td." + column).children().removeClass("selected");
        }
        column = $(this).parent().attr("class");
        row = $(this).parent().parent().attr("class");
        cellCoordinates = [];
        cellCoordinates.push(parseInt(row.substr(row.length - 1)));
        cellCoordinates.push(parseInt(column.substr(column.length - 1)));
        console.log(cellCoordinates);
        $(this).addClass('selected');
        boxLocation = $("tr." + row).find("td." + column).children();
      }
    });
  }

  function fillPuzzle() {
    if (variableSelected === false) {
      selectBox();
      $('.button').click(function() {
        variableSelected = true;
        variable = $(this).html();
        variableValue = variable;
        if ((boxSelected === true) && (variableSelected === true)) {
          boxLocation.html(variableValue);
          boxSelected = false;
          variableSelected = false;
          boxLocation.removeClass('selected');
          $('.button').removeClass('selected');
          if (gameStyle === numbers) {
            puzzle[cellCoordinates[0]][cellCoordinates[1]] = parseInt(variable);
          } else {
            puzzle[cellCoordinates[0]][cellCoordinates[1]] = variable;
          }
        }
        checkSolution(true);
        if (assist === true) {
          checkEntry();
        }
      });
    }
  }

  function checkSolution(user) {
    var solvedByRow = [];
    for (var n = 0; n < puzzle.length; n++) {
      var solved = compareRows(solution[n], puzzle[n]);
      solvedByRow.push(solved);
    }
    var isValid = solvedByRow.indexOf(false);
    if (isValid === -1) {
      if (user === true) {
        alert("You've Won!");
      } else {
        return true;
      }
    }
  }

  function compareRows(a, b) {
    if (a === b) return true;
    for (var n = 0; n < a.length; n++) {
      if (a[n] !== b[n]) return false;
    }
    return true;
  }

  function checkEntry() {
    var row = cellCoordinates[0];
    var column = cellCoordinates[1];
    if (puzzle[row][column] !== solution[row][column]) {
      boxLocation.addClass('wrong');
    } else {
      boxLocation.removeClass('wrong');
    }
  }



  var difficulty = 40;
  var gameStyle = colors;
  var assist = true;


populateDOM(startingSeeder, gameStyle, difficulty);
fillPuzzle();
console.log(solution);

});
