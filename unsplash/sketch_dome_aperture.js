function executeDomeAperture() {
  let images = []; // Declare an empty array
  let fStopSlider; // declare the slider

  function preload() {
    for (let i = 1; i < 53; i++) {
      let img = loadImage('images/image' + i + '.jpg');
      images.push(img);
    }
  }

  function setup() {
    let cnv = createCanvas(800, 800);
    // cnv.parent('#canvasContainer');
    angleMode(DEGREES);
    rectMode(CENTER);

    // Create the slider
    fStopSlider = createSlider(1, 10, 5, 0.1); // f-stop values from 1 to 10, initial value 5, increment 0.1
    fStopSlider.position(10, 10);

    window.canvas = cnv;
  }

  function draw() {
    let fStopValue = fStopSlider.value(); // Get the value of the slider

    background(0);
    translate(width / 2, height / 2);

    let layers = 10; // number of layers
    let layerDistance = 30; // distance between layers

    for (let i = 0; i < layers; i++) {
      let imagesInLayer = 6 * (i + 1) * (1 / fStopValue); // number of images in each layer
      let imageSize = 100 / (i + fStopValue); // size of images in each layer

      for (let j = 0; j < imagesInLayer; j++) {
        let angle = map(j, 0, imagesInLayer, 0, 360);
        let x = layerDistance * i * cos(angle);
        let y = layerDistance * i * sin(angle);
        push();
        translate(x, y);
        rotate(angle);

        let img = images[j % images.length];
        image(img, 0, 0, imageSize, imageSize);
        pop();
      }
    }
  }
}
