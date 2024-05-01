"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;
let [tw, th] = [p3_tileWidth(), p3_tileHeight()];
let clicks = {};
let jesusLocation;
let treasureLocation;
let treasureFound = 0;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  jesusLocation = {x:0, y:0};
  treasureLocation = {x:floor(random(-10, 10)), y:floor(random(-10, 10))}
  // treasureLocation = {x:floor(random(1, 1)), y:floor(random(1, 1))}
}

function p3_tileWidth() {
  return 48;
}
function p3_tileHeight() {
  return 32;
}




function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  
  if (canMove(i,j)) {
    jesusLocation.x = i;
    jesusLocation.y = j;
  }
  if (treasureLocation.x == jesusLocation.x && treasureLocation.y == jesusLocation.y) {
    treasureLocation = {x:floor(random(i-20, i+20)), y:floor(random(j-20, j+20))}
    treasureFound += 1;
  }
}


function p3_drawBefore() {
  background(165,91,68);
}

function p3_drawTile(i, j) {
  noStroke();

  let darkTan = color(241,209,156);
  let lightTan = color(231,213,199);
  
  let tileColor = lerpColor(darkTan, lightTan, noise(i * 0.1, j * 0.1));
  
  fill(tileColor);
  push();
  
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  
  drawTree(i, j, worldSeed);
  drawGrassPatch(i, j, worldSeed);
  pop();
  
  if (jesusLocation.x == i && jesusLocation.y == j) {
    drawShovel();
  }
  if (treasureLocation.x == i && treasureLocation.y == j) {
    drawTreasure();
  }
}

function p3_drawSelectedTile(i, j) {
  
  noFill();
  stroke(0, 0, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("Tile: " + [i, j], 0, 0);
  
}



function drawTree(i, j, seed) {
  if (XXH.h32("tree:" + [i, j], seed) % 75 == 0) {
    
    //make the trees sway in the wind
    let windTranslate = (sin(frameCount * 0.03) + noise(i * 0.5, j * 0.5)) * 6;
    translate(windTranslate, 0);
    // console.log(windTranslate);
    
    rectMode(CENTER);
    let treeHeight = th * 2;
    let treeWidth = tw * 0.1;
    let treeX = th;
    let treeY = -th;
    
    //draw a brown tree trunk
    fill("#725b40");
    rect(0, treeY, treeWidth, treeHeight);

    let darkGreen = color(121,133,88);
    let lightGreen = color(203,217,156);
    let tileColor = lerpColor(darkGreen, lightGreen, noise(i * 0.2, j * 0.4));
    
    //draw leaves
    //each tree will be a slightly different shade depending on the 
    fill(tileColor);
    ellipse(0, treeY * 3.5, tw*2.5, tw*2.5);
    fill(tileColor);
    ellipse(treeX * 1.5 , treeY * 3.5, tw * 2, tw * 2);
    fill(tileColor);
    ellipse(-treeX * 1.5 , treeY * 3.5, tw * 2, tw * 2);
  }
}

function drawGrassPatch(i, j) {
  let grassSeed = XXH.h32("grass:" + [i, j], worldSeed);
  // Check if a grass patch should be drawn based on tile coordinates and seed
  if (grassSeed % 20 == 0) {
    let windTranslate = (sin(millis() * 0.003) + noise(i * 0.75, j * 0.8)) * 3;
    translate(windTranslate, 0);
    // Use a consistent number of grass blades based on the seed
    let numBlades = (grassSeed % 11) + 5; // Vary between 5 to 15 blades

    // Determine positions of grass blades based on tile indices
    for (let k = 0; k < numBlades; k++) {
      // Use a different seed value for each grass blade based on its index
      let bladeSeed = XXH.h32(k.toString(), grassSeed);

      // Calculate pseudo-random x and y offsets for the grass blade
      let xOffset = (bladeSeed % 1000) / 1000 * tw - (tw / 2); // Range: -tw/2 to tw/2
      let yOffset = (bladeSeed % 10000) / 10000 * th - (th / 2); // Range: -th/2 to th/2

      // Draw grass blade as a line
      stroke("#3CB371"); // Green color for grass
      strokeWeight(1);
      line(xOffset, yOffset, xOffset + 0.1 * tw, yOffset - 1 * th); // Adjust line length and direction
    }
  }
}

function drawShovel() {
  push();
  fill(0, 0, 0, 32);
  ellipse(0, th/2, 25, 10);
  translate(0, -40);
  fill(color("#8f8a82"));
  rectMode(CENTER);
  rect(0, 0, 6, 50); //handle/stem
  fill("#4b4a48")
  rect(0, th/1.2, 27, 15); //shovel head
  ellipse(0, th, 27, 30); //shovel head
  noFill();
  stroke("#4b4a48");
  strokeWeight(4);
  rect(0, -th, 15, 10); //shovel head
  pop();
}

function drawTreasure() {
  push(); // Save the current drawing style

  // Draw the treasure chest components
  // Chest base
  rectMode(CENTER);
  fill("#8B4513"); // Brown color for the chest base
  rect(0, 0, 40, 30, 5); // Base rectangle with rounded corners

  // Chest lid
  fill("#8B4513"); // Brown color for the lid
  rect(0, -th/1.5, 40, 15, 5); // Lid rectangle with rounded corners

  // Chest lock
  fill("#FFD700"); // Gold color for the lock
  ellipse(0, -th/2, 8, 8); // Lock ellipse

  // Chest jewels
  fill("#00CED1"); // Cyan color for jewels
  ellipse(-tw/4, -5, 5, 5); // Left jewel
  ellipse(tw/4, -5, 5, 5); // Right jewel

  pop();
}

function canMove(i, j) {
  if ((i == jesusLocation.x + 1 || i == jesusLocation.x - 1 || i == jesusLocation.x) && (j == jesusLocation.y + 1 || j == jesusLocation.y - 1 || j == jesusLocation.y)) {
    return true;
  } else {
    return false;
  }
}

function p3_drawAfter() {
  text("Treasure Found: " + treasureFound, 20, 30);
  text("Treasure at: " + treasureLocation.x + ", " + treasureLocation.y, 650, 380);
}
