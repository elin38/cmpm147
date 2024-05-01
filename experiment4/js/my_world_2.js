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
let waves = {};
let jesusLocation;
let fishLocations = {};
let metFishLocations = {};
let fishMet = 0;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  jesusLocation = {x:0, y:0};
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
  waves[key] = millis();
  
  if (canMove(i,j)) {
    jesusLocation.x = i;
    jesusLocation.y = j;
  }
  if (fishLocations[[jesusLocation.x, jesusLocation.y]] == true && metFishLocations[[jesusLocation.x, jesusLocation.y]] != true) {
    fishMet += 1;
    metFishLocations[[i, j]] = true;
  }
}


function p3_drawBefore() {
  background(84,109,167);
}


function p3_drawTile(i, j) {
  noStroke();

  push();

  if (jesusLocation.x == i && jesusLocation.y == j) {
    key = [jesusLocation.x, jesusLocation.y];
    if (millis() - waves[key] < 2000) {
      let waveAmplitude = sin(millis()/100) * 5;
      translate(0, waveAmplitude);
    }
  }
  
  let waveMotion = sin(millis() * 0.005) * 5;
  translate(0, waveMotion);
  
  
  if (noise(i, j) > 0.60) {
    let darkBlue = color(179,236,236);
    let lightBlue = color(59,214,198);
    noiseDetail(6, 0.25);
    let tileColor = lerpColor(darkBlue, lightBlue, noise(i * 0.1, j * 0.1));
    fill(tileColor);
  } else {
    let darkBlue = color(65,161,236);
    let lightBlue = color(187,219,229);
    noiseDetail(6, 0.25);
    let tileColor = lerpColor(darkBlue, lightBlue, noise(i * 0.1, j * 0.1));
    fill(tileColor);
  }
  
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  
  drawBoat(i, j, worldSeed);
  drawFish(i, j, worldSeed);
  
  if (jesusLocation.x == i && jesusLocation.y == j) {
    drawJesus(i, j);
  }
  
  pop();
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

function drawBoat(i, j, seed) {
  // Calculate a deterministic seed for this specific tile
  let boatSeed = XXH.h32("boat:" + [i, j], seed);

  // Determine if a boat should be drawn based on the seed
  if (boatSeed % 30 == 0) {
    // Boat dimensions and colors
    let boatWidth = 40; // Width of the boat
    let boatHeight = 20; // Height of the boat
    let boatColor = color(139, 69, 19); // Brown color for boat

    // Calculate boat position within tile boundaries
    let boatX = 0; // Center X position of the boat
    let boatY = 0; // Center Y position of the boat

    // Draw boat body
    fill(boatColor);
    rectMode(CENTER);
    rect(boatX, boatY, boatWidth, boatHeight, 5); // Rectangular boat body

    // Draw boat mast
    let mastHeight = boatHeight * 1.5; // Height of the mast
    stroke(boatColor);
    strokeWeight(2);
    line(boatX, boatY - boatHeight / 2, boatX, boatY - mastHeight); // Vertical mast

    // Draw boat sail
    fill(255); // White color for sail
    noStroke();
    beginShape();
    vertex(boatX, boatY - mastHeight); // Top of the sail
    vertex(boatX - boatWidth / 3, boatY - boatHeight); // Bottom left of the sail
    vertex(boatX + boatWidth / 3, boatY - boatHeight); // Bottom right of the sail
    endShape(CLOSE);
  }
}

function drawFish(i, j, seed) {
  // Calculate a deterministic seed for this specific tile
  let fishSeed = XXH.h32("fish:" + [i, j], seed);

  // Determine if a fish should be drawn based on the seed
  if (fishSeed % 20 == 0) {
    fishLocations[[i,j]] = true;
    // Fish body parameters
    let fishSize = 20; // Size of the fish body
    let bodyColor = color(255, 165, 0); // Orange color for fish body

    // Calculate fish position within tile boundaries
    let fishX = 0; // Center X position of the fish
    let fishY = 0; // Center Y position of the fish

    // Draw fish body
    fill(bodyColor);
    ellipse(fishX, fishY, fishSize, fishSize * 0.6); // Elliptical body shape

    // Draw fish tail
    let tailSize = fishSize * 0.8; // Size of the fish tail
    let tailOffset = fishSize * 0.4; // Offset for tail position

    beginShape();
    vertex(fishX + tailOffset, fishY); // Tail base
    vertex(fishX + tailSize, fishY - tailSize * 0.3); // Tail tip
    vertex(fishX + tailSize, fishY + tailSize * 0.3); // Tail bottom tip
    endShape(CLOSE);

    // Draw fish eye
    let eyeSize = 4; // Size of the fish eye
    let eyeOffset = -fishSize / 5; // Offset for eye position

    fill(0); // Black color for eye
    ellipse(fishX + eyeOffset, fishY, eyeSize, eyeSize); // Eye position
  }
}

function drawJesus() {
  fill(0, 0, 0, 32);
  ellipse(0, th/2, 10, 5);
  translate(0, -15);
  fill(color("#d3ccba"));
  rectMode(CENTER);
  rect(0, 0, 12, 50); //body
  rect(0, -th * .2, 40, 8); //arms
  ellipse(0, -th * 0.6, 20, 25); //head
  ellipse(-tw/2.5, -th * 0.2, 10, 10); //hand1
  ellipse(tw/2.5, -th * 0.2, 10, 10); //hand 2
  fill(0); // Black color for eye
  ellipse(-tw/10, -th * 0.7, 3, 3);
  ellipse(tw/10, -th * 0.7, 3, 3);
}

function canMove(i, j) {
  if ((i == jesusLocation.x + 1 || i == jesusLocation.x - 1 || i == jesusLocation.x) && (j == jesusLocation.y + 1 || j == jesusLocation.y - 1 || j == jesusLocation.y)) {
    return true;
  } else {
    return false;
  }
}

function p3_drawAfter() {
  text("Fish Met: " + fishMet, 650, 380);
}
