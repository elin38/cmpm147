// sketch.js - purpose and description here
// Author: Ethan Lin
// Date: 4/16/2024

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let seed = 239;

const grassColor = "#588a04";
const skyColor = "#d8e9f9";
const stoneColor = "#858290";
const leafColor = "#c69295";
const riverColor = "#3c709e";
const snowColor = "#d9f1ff"
const barkColor = "#443d30";
const cloudColor = "#e7eff6"

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {  
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}
const element = document.getElementById("reimagine");
element.addEventListener("click", reimagineFunction);

function reimagineFunction() {
  seed++;
}

function draw() {
  randomSeed(seed);

  background(100);

  noStroke();
  
  //draw sky
  fill(skyColor);
  rect(0, 0, width, height / 2);

  //draw clouds
  fill(231, 239, 246, 200);
  const clouds = 10 * random();
  for (let i = 0; i < clouds; i++) {
    let z = random();
    let x = width * ((random() + (millis() / 50000.0) / z) % 1);
    let y = height / 15 / z;
    let w = random(width*0.0625, width*0.125);
    let h = random(height*0.05, height*0.1);
    ellipse(x, y, w, h);
  }
  
  //draw grass
  fill(grassColor);
  rect(0, height / 2, width, height / 2);

  //draw mountain
  fill(stoneColor);
  beginShape();
  vertex(0, height / 2);
  const steps = 10;
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y =
      height / 2 - (random() * random() * random() * height) / 3 - height / 10;
    // if (y < height / 4) {
    //   fill(snowColor);
    // }
    // else {
    //   fill(stoneColor);
    // }
    vertex(x, y);
  }
  vertex(width, height / 2);
  endShape(CLOSE);
  
  //draw trees
  let treeStartx;
  let treeStarty;
  let numTrees = 3;
  for (let i = 1; i < numTrees + 1; i++) {
    fill(barkColor);
    treeStartx = random(width*0.0375, (i * (width*0.125)) + (width*0.365));
    treeStarty = random(height/3, height/2);
    rect(treeStartx, treeStarty, width*0.0125, height*0.35);
    //draw leaves
    for (let i = 0; i < random(width*0.05,width*0.1); i++) {
      fill(198, 146, 149, random(63, 255));
      let angle = random(TWO_PI);
      let leafx = treeStartx + cos(angle) * random(width*0.1125);
      let leafy = treeStarty + sin(angle) * random(height*0.15);
      ellipse(leafx, leafy, width*0.0325);
    }
  }
  
  const leaves = random (5,10);
  for (let i = 0; i < leaves; i++) {
    let z = random();
    let x = treeStartx * ((random() + (millis() / 50000.0) / z) % 1) + treeStartx;
    let y = treeStarty * ((random() + (millis() / 50000.0) / z) % 1) + treeStarty;
    ellipse(x, y, width*0.0125, width*0.0125);
  }
  
  // draw river (using the help of ChatGPT)
  fill(riverColor);
  beginShape();
  vertex(0, height + 100); // Start at the bottom-left corner
  let riverEndX = width; // End river at a random point between half and full width
  let riverEndY = (height / 2, height / 2 + 30); // End river at a random height above the bottom
  let controlPointX = random(0, width / 2); // Random control point for curvature
  let controlPointY = random(height - 20, height - 50); // Random control point for curvature
  bezierVertex(controlPointX, controlPointY, controlPointX, controlPointY, riverEndX, riverEndY); // Bezier curve to the base of the mountains
  vertex(width, height); // Connect to the bottom-right corner
  endShape(CLOSE);
  //Draw some grass on the other side of the river
  fill(grassColor);
  beginShape();
  vertex(50, height + 1500);
  riverEndY += 50; //base off of the initial river curve
  // controlPointX = random(0, width / 2); // Random control point for curvature
  // controlPointY = random(height - 20, height - 75); // Random control point for curvature
  bezierVertex(controlPointX, controlPointY, controlPointX, controlPointY, riverEndX, riverEndY);
  vertex(width, height);
  endShape(CLOSE);
  
}
