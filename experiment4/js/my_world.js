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

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let treeTiles = {};
let grassTiles = {};
let crystalTiles = {};

let drawingMode = "Grass";

function p3_tileClicked(i, j) {
  let key = [i, j];
  if (keyIsDown(67)) {
    crystalTiles[key] = 1 + (crystalTiles[key] | 0);
  } 
  else if (keyIsDown(84)) {
    treeTiles[key] = 1 + (treeTiles[key] | 0);
  } else {
    grassTiles[key] = 1 + (grassTiles[key] | 0);
  }
}


function p3_drawBefore() {
  background(252, 160, 188);
}

function p3_drawTile(i, j) {
  noStroke();

  let darkPink = color(248,126,140);
  let lightPink = color(249,240,239);
  
  let tileColor = lerpColor(darkPink, lightPink, noise(i * 0.1, j * 0.1));
  
  fill(tileColor);
  push();
  
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  let n = crystalTiles[[i, j]] | 0;
  if (n % 2 == 1) {
    push();
    noFill();
    stroke(color(255,136,136, 175));
    strokeWeight(5);
    ellipse(0, -th * 7, tw*2.5, tw*2.5);
    stroke(color(255,221,168, 175));
    strokeWeight(5);
    ellipse(0, -th * 7, tw*2.25, tw*2.25);
    stroke(color(249,255,147, 175));
    strokeWeight(5);
    ellipse(0, -th * 7, tw*2, tw*2);
    stroke(color(213,255,181, 175));
    strokeWeight(5);
    ellipse(0, -th * 7, tw*1.75, tw*1.75);
    stroke(color(179,253,255, 175));
    strokeWeight(5);
    ellipse(0, -th * 7, tw*1.5, tw*1.5);
    pop();
    fill("#f1dbe0");
    triangle(th, 0, -th, 0, 0, -th*8);
    fill("#e6f0ee");
    triangle(th/2, 0, -th/2, 0, 0, -th*5);
    
  }

  n = treeTiles[[i, j]] | 0;
  if (n % 2 == 1) {
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
    ellipse(0, treeY * 4, tw*2.5, tw*2.5);
    fill(tileColor);
    ellipse(treeX * 2 , treeY * 4, tw * 2, tw * 2);
    fill(tileColor);
    ellipse(-treeX * 2 , treeY * 4, tw * 2, tw * 2);
  }
  
  n = grassTiles[[i, j]] | 0;
  if (n % 2 == 1) {
    push();
    let grassSeed = XXH.h32("grass:" + [i, j], worldSeed);
    // Check if a grass patch should be drawn based on tile coordinates and seed
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
    pop();
  }
  
  drawCrystal(i, j, worldSeed);
  drawTree(i, j, worldSeed);
  drawGrassPatch(i, j, worldSeed);
  pop();
}

function p3_drawSelectedTile(i, j) {
  if (keyIsDown(67)) {
    drawingMode = "crystals";
  } 
  else if (keyIsDown(84)) {
    drawingMode = "trees";
  } else {
    drawingMode = "grass";
  }
  
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
  text("Place " + drawingMode + " at " + [i, j], 0, 0);
}


function drawCrystal(i, j, seed) {
  if (XXH.h32("crystal:" + [i, j], seed) % 500 == 0) {
    push();
    noFill();
    stroke(color(255,136,136, 175));
    strokeWeight(5);
    ellipse(0, -th * 7, tw*2.5, tw*2.5);
    stroke(color(255,221,168, 175));
    strokeWeight(5);
    ellipse(0, -th * 7, tw*2.25, tw*2.25);
    stroke(color(249,255,147, 175));
    strokeWeight(5);
    ellipse(0, -th * 7, tw*2, tw*2);
    stroke(color(213,255,181, 175));
    strokeWeight(5);
    ellipse(0, -th * 7, tw*1.75, tw*1.75);
    stroke(color(179,253,255, 175));
    strokeWeight(5);
    ellipse(0, -th * 7, tw*1.5, tw*1.5);
    pop();
    fill("#f1dbe0");
    triangle(th, 0, -th, 0, 0, -th*8);
    fill("#e6f0ee");
    triangle(th/2, 0, -th/2, 0, 0, -th*5);
  }
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
    ellipse(0, treeY * 4, tw*2.5, tw*2.5);
    fill(tileColor);
    ellipse(treeX * 2 , treeY * 4, tw * 2, tw * 2);
    fill(tileColor);
    ellipse(-treeX * 2 , treeY * 4, tw * 2, tw * 2);
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

function p3_drawAfter() {
  
}
