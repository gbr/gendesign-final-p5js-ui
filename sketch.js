let DEBUG_MODE = false; // Set to false to turn off debugging
const IMAGE_PATH = 'album_cover-6.jpeg';
const MAX_SLICES = 35; // Maximum number of slices to generate
let img;

function preload() {
  // Preload the image for synchronous loading
  img = loadImage(IMAGE_PATH);
}

function setup() {
  createCanvas(800, 800);
  noLoop(); // Ensure p5.js doesn't continuously loop

  let colorThief = new ColorThief();
  let dominantColor = colorThief.getColor(img.canvas);

  background(`rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`); // Set background to dominant color
  // background(255);
  // background(0);

  let slices = generateSlices(img, MAX_SLICES);
  let packedSlices = packSlices(slices);

  displaySlices(packedSlices);
}

function generateSlices(img, numSlices) {
  let slices = [];
  for (let i = 0; i < numSlices; i++) {
    let aspectRatio = random(0.5, 2); // Random aspect ratio between 0.5 and 2
    let width = random(100, 300); // Adjust the width range
    let height = width / aspectRatio;

    let x = random(0, img.width - width);
    let y = random(0, img.height - height);

    slices.push({
      x: x,
      y: y,
      w: width,
      h: height
    });
  }
  return slices;
}

function packSlices(slices) {
  let packer = new GrowingPacker();
  packer.fit(slices);
  return slices.filter(slice => slice.fit);
}

function displaySlices(packedSlices) {
  packedSlices.forEach(slice => {
    // Extract the image slice
    let imgSlice = img.get(slice.x, slice.y, slice.w, slice.h);
    
    // Display the image slice on the canvas
    image(imgSlice, slice.fit.x, slice.fit.y, slice.w, slice.h);

    if (DEBUG_MODE) {
      // Debugging: Draw an outline around each slice
      noFill();
      stroke(255, 0, 0); // Red outline
      rect(slice.fit.x, slice.fit.y, slice.w, slice.h);
    }
  });
}
