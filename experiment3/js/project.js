/* exported generateGrid, drawGrid */
/* global placeTile */


function generateGrid(numCols, numRows) {
  let grid = [];
  
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      if (noise(i / 10, j / 10) > 0.5) {
        row.push('O');
      } else {
        row.push('?');
      }
    }
    grid.push(row);
  }
  return grid;
}

function drawGrid(grid) {
  background(128);
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == 'O') {
        placeTile(i, j, floor(random(0, (random()+(millis()/5000/random()))%4)), 13);
      }
      if (grid[i][j] == '?') {
        placeTile(i, j, floor(random(0, 3)), 0);
        if (random(0,100) < 5) {
          placeTile(i, j, 26, floor(random(0,3)));
        }
        if (random(0,100) < 10) {
          placeTile(i, j, 14, floor(random(0,3)));
        }
        drawCorners(grid, i, j, "?", 0, 0);
      } 
      else {
        drawContext(grid, i, j, "?", 0, 0);
      }
    }
  }
  
  //make clouds
  
  let rectX = random(0, 100); 
  let rectY = random(150, 250);
  let rectW = 150;
  let rectH = 50;
  
  fill(169, 169, 169, 300*noise(100,200));
  noStroke();
  let z = random()
  rectX = rectW * ((random(0, 0.1) + (millis() / 30000.0) / z) % 2);
  rect(rectX, rectY, rectW, rectH);
  rect(rectX - 20, rectY - 20, rectW + 40, rectH + 40);
  
  let rectX2 = random(25, 100); 
  let rectY2 = random(0, 100);
  let rectW2 = 150;
  let rectH2 = 50;
  
  noStroke();
  let z2 = random()
  rectX2 = rectW2 * ((random(0, 0.1) + (millis() / 30000.0) / z2) % 2);
  rect(rectX2, rectY2, rectW2, rectH2);
  rect(rectX2 - 20, rectY2 - 20, rectW2, rectH2);
  
  
}


function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
    return grid[i][j] == target;
  } else {
    return false;
  }
}

function gridCode(grid, i, j, target) {
  let bit = 0;
  if (gridCheck(grid, i - 1, j, target)) { //check north
    bit += 1<<0
  }
  if (gridCheck(grid, i + 1, j, target)) { //check south
    bit += 1<<1
  }
  if (gridCheck(grid, i, j + 1, target)) { //check east
    bit += 1<<2
  }
  if (gridCheck(grid, i, j - 1, target)) { //check west
    bit += 1<<3
  }
  return bit;
}



function drawCorners(grid, i, j, target, ti, tj) {
  let code = gridCode(grid, i, j, target);
  if (code == 9) {
    placeTile((i + 1), (j + 1), ti + 13, tj + 1); //bottom right
  }
  if (code == 5) {
    placeTile((i + 1), (j - 1), ti + 12, tj + 1); //bottom left
  }
  if (code == 6) {
    placeTile((i - 1), (j - 1), ti + 12, tj + 0); //top left
  }
  if (code == 10) {
    placeTile((i - 1), (j + 1), ti + 13, tj + 0); //top right
  }
}

function drawContext(grid, i, j, target, ti, tj) {
  let code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = lookup[code]; 
  placeTile(i, j, ti + tiOffset, tj + tjOffset);
}

const lookup = [
  [10,1], //0000
  [10,0], //0001
  [10,2], //0010
  [10,1], //0011
  [11,1], //0100
  [11,0], //0101
  [11,2], //0110
  [0,0], //0111
  [9,1], //1000
  [9,0], //1001
  [9,2], //1010
  [0,0], //1011
  [0,0], //1100
  [0,0], //1101
  [0,0], //1110
  [0,0] //1111
];
