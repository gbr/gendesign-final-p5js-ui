function executeRecordViewer() {
  let images = [];
  let numImages = 7; // The number of images you want to display

  let camX = 0;
  let camY = 0;
  let camZ; // Set initial camZ position

  let prevMouseX = 0;
  let prevMouseY = 0;

  function preload() {
    // Preload the images
    for (let i = 0; i < numImages; i++) {
      images[i] = loadImage('images/image' + (i + 1) + '.jpg'); // Replace with your image paths
    }
  }

  function setup() {
    let cnv = createCanvas(800, 800, WEBGL);
    camZ = height / 1.5 / tan((PI * 30.0) / 180.0); // The default camera position - decrease the denominator to "zoom out"
    camX = -width / 4; // start the camera offset to the left - increase this value to move further left
    camY = height / 16; // start the camera offset to the top - increase this value to move further up;
    imageMode(CENTER); // The image is drawn from the center

    // Add a mousePressed function to handle click events
    canvas.mousePressed(shiftImages);
    window.canvas = cnv;
  }

  function draw() {
    background(0);

    // Check if the mouse is being dragged
    if (mouseIsPressed) {
      // Update camera rotation based on mouse movement
      let dx = (mouseX - prevMouseX) * 0.5;
      let dy = (mouseY - prevMouseY) * 0.5;

      // Update the camera's position
      camX += dx;
      camY += dy;
    }

    // Keep track of the mouse position for the next frame
    prevMouseX = mouseX;
    prevMouseY = mouseY;

    // Set the camera's position and look at the center of the sketch
    camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

    // Reverse loop to draw images back to front
    push();
    translate(240, 100, -60);
    for (let i = numImages - 1; i >= 0; i--) {
      // Push a new drawing context
      push();
      // Translate to the desired position
      translate(i * -100, i * -100, -i * 100); // Incremental offsets, the third argument is the offset on the z axis. Adjust the second argument to raise the images higher.
      // Scale down as images get further back
      let scaleVal = 1 - i * 0.05; // Adjust scaling factor as needed
      scale(max(scaleVal, 0.1)); // Scale should be no less than 0.1 to avoid vanishing images
      // Draw the image
      image(images[i], 0, 0);
      // Pop the drawing context
      pop();
    }
    pop();
  }

  function shiftImages() {
    // Shift the first image to the end of the array
    images.push(images.shift());
  }
}
