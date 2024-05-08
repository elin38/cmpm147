/* exported preload, setup, draw */
/* global memory, dropper, restart, rate, slider, activeScore, bestScore, fpsCounter */
/* global getInspirations, initDesign, renderDesign, mutateDesign */

let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;
let setOpacity = 255;

function preload() {
  

  let allInspirations = getInspirations();

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }
  dropper.onchange = e => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () => {
    inverseColor = false;
    detailNum = 150;
    detailLowerBound = 50;
    detailUpperBound = 25;
    showImage = false;
    setOpacity = (225, 255);
    inspirationChanged(allInspirations[dropper.value]);
  }
  
  recolor.onclick = () => {
    reColor();
    inspirationChanged(allInspirations[dropper.value]);
  }
  
  //change opacity buttons
  opac0.onclick = () => {
    setOpacity = 0;
    showImage = true;
    inspirationChanged(allInspirations[dropper.value]);
  }
  opac75.onclick = () => {
    setOpacity = random(160, 191);
    showImage = false;
    inspirationChanged(allInspirations[dropper.value]);
  }
  opac50.onclick = () => {
    setOpacity = random(100, 127);
    showImage = false;
    inspirationChanged(allInspirations[dropper.value]);
  }
  opac100.onclick = () => {
    setOpacity = (225, 255);
    showImage = false;
    inspirationChanged(allInspirations[dropper.value]);
  }
  opac25.onclick = () => {
    setOpacity = random(23, 50);
    showImage = false;
    inspirationChanged(allInspirations[dropper.value]);
  }
  
  //change detail buttons
  lowframe.onclick = () => {
    detailNum = 150;
    detailLowerBound = 50;
    detailUpperBound = 25;
    inspirationChanged(allInspirations[dropper.value]);
  }
  medframe.onclick = () => {
    detailNum = 100;
    detailLowerBound = 75;
    detailUpperBound = 50;
    inspirationChanged(allInspirations[dropper.value]);
  }
  hiframe.onclick = () => {
    detailNum = 25;
    detailLowerBound = 100;
    detailUpperBound = 75;
    inspirationChanged(allInspirations[dropper.value]);
  }
}

function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  setup();
}



function setup() {
  currentCanvas = createCanvas(width, height);
  currentCanvas.parent(document.getElementById("active"));
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = initDesign(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0,0, width, height);
  loadPixels();
  currentInspirationPixels = pixels;
}

function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;
  
  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1/(1+error/n);
}



function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
}

let mutationCount = 0;

function draw() {
  
  if(!currentDesign) {
    return;
  }
  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  mutateDesign(currentDesign, currentInspiration, slider.value/100.0);
  
  randomSeed(0);
  // opacity.innerHTML = Math.round((opacitySlider.value/255) * 100);
  renderDesign(currentDesign, currentInspiration);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
  }
  
  fpsCounter.innerHTML = Math.round(frameRate());
}
