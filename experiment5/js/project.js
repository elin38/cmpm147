/* exported getInspirations, initDesign, renderDesign, mutateDesign */

function getInspirations() {
  return [
    {
      name: "Bridge over a Pond of Water Lilies", 
      assetUrl: "https://cdn.glitch.global/4099c032-48d1-4e4a-bd1b-874dd98d3656/lilypad.jpg?v=1715133527058",
      credit: "WIP",
      shape: "rect"
    },
    {
      name: "FFXIV", 
      assetUrl: "https://cdn.glitch.global/4099c032-48d1-4e4a-bd1b-874dd98d3656/endwalker.png?v=1715135253734",
      credit: "WIP",
      shape: "ellip"
    },
    {
      name: "Japanese Breakfast", 
      assetUrl: "https://cdn.glitch.global/4099c032-48d1-4e4a-bd1b-874dd98d3656/IMG_1132%20(3).jpg?v=1715139932079",
      credit: "WIP",
      shape: "tri"
    },
    {
      name: "This is Fine", 
      assetUrl: "https://cdn.glitch.global/4099c032-48d1-4e4a-bd1b-874dd98d3656/this-is-fine%20%5BMConverter.eu%5D%20(1).png?v=1715140075113",
      credit: "WIP",
      shape: "ellip"
    },
  ];
}

let fillColor;
let inverseColor = false;
let detailNum = 150;
let detailLowerBound = 50;
let detailUpperBound = 25;
let showImage = false;

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width, inspiration.image.height);
  
  let design = {
    bg: 255,
    fg: []
  }
  
  let shapeNum = (inspiration.image.width) * (inspiration.image.height * 5) / detailNum;
  
  for(let i = 0; i < shapeNum; i++) {
    let xCord = random(inspiration.image.width);
    let yCord = random(inspiration.image.height);
    fillColor = inspiration.image.get(xCord, yCord);
    if (inverseColor) {
      fillColor[0] = 255 - fillColor[0]
      fillColor[1] = 255 - fillColor[1]
      fillColor[2] = 255 - fillColor[2]
    }
    fillColor[3] = setOpacity;
    design.fg.push({x: xCord,
                    y: yCord,
                    w: random(inspiration.image.width/detailLowerBound, inspiration.image.width/detailUpperBound),
                    fill: fillColor})
  }
  return design;
}

function reColor() {
  if (inverseColor) {
    inverseColor = false;
  } else {
    inverseColor = true;
  }
}

function renderDesign(design, inspiration) {
  if (!showImage) {
    background(design.bg);
  }  
  noStroke();
  for(let box of design.fg) {
    if (inspiration.shape == "ellip") {
      // box.fill[3] = random(255);
      // box.fill[3] = opacity;
      fill(box.fill);
      ellipse(box.x, box.y, box.w);
    }
    else if (inspiration.shape == "rect") {
      // box.fill[3] = random(255);
      // box.fill[3] = opacity;
      fill(box.fill);
      rect(box.x, box.y, box.w, box.w);
    }
    else if (inspiration.shape == "tri") {
      // box.fill[3] = random(255);
      // box.fill[3] = opacity;
      fill(box.fill);
      triangle(box.x, box.y - box.w, box.x + (box.w/2), box.y, box.x - (box.w/2), box.y);
    }
  }
}

function mutateDesign(design, inspiration, rate) {
  for(let box of design.fg) {
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width / 4, rate / 2);
  }
}

function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 50), min, max);
}

/* Ideas: Opacity Slider, Inverse Color Button, Noise for shape size */

