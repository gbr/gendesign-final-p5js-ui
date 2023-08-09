function executeFilledBladeAperture() {
  let fStopSlider;
  let mask; // Variable to hold the mask image
  let centerImg; // Variable for center image
  let centerImgEl;
  let centerImgLoaded = false; // Variable to check if center image is loaded
  let colorThief = new ColorThief();
  let palette; // Variable for color palette
  let paletteExtracted = false; // Variable to check if palette is extracted

  let t = 0; // Time

  function preload() {
    mask = loadImage(
      'aperture-exterior.png',
      (img) => {
        console.log('Image loaded successfully');
      },
      (img) => {
        console.log('Failed to load image');
      }
    );

    centerImg = loadImage(
      'images/image' + floor(random(1, 57)) + '.jpg',
      (img) => {
        console.log('Center image loaded successfully');
        centerImgLoaded = true;

        centerImgEl = new Image();
        centerImgEl.crossOrigin = 'Anonymous'; // Required when fetching image from another domain
        centerImgEl.src = img.canvas.toDataURL();
        centerImgEl.onload = function () {
          if (centerImgEl.complete) {
            let colors = colorThief.getPalette(centerImgEl, 8);
            // If less than 8 colors are returned, duplicate colors
            while (colors.length < 8) {
              colors = colors.concat(colors);
            }
            // If more than 8 colors are returned, trim the array
            colors.length = 8;
            palette = colors.map((c) => color(c[0], c[1], c[2]));
            paletteExtracted = true; // Indicate that palette has been extracted successfully
          }
        };
      },
      (img) => {
        console.log('Failed to load center image');
      }
    );
  }

  function setup() {
    let cnv = createCanvas(800, 800, WEBGL);
    fStopSlider = createSlider(0, 240, 180);
    fStopSlider.position(10, 10);
    window.canvas = cnv;
  }

  function draw() {
    background(0);
    pixelDensity(4);

    let fStopValue = map(sin(t), -1, 1, 0, 240); // Oscillates between 0 and 240
    fStopSlider.value(fStopValue); // Update slider value
    t += 0.01; // Adjust this value to change the speed of the oscillation

    // Only draw the aperture blades if the palette has been successfully extracted
    if (paletteExtracted) {
      for (let i = 0; i < 8; i++) {
        push();
        rotate((i * PI) / 4 + t);
        translate(0, -fStopValue);
        scale(8);
        stroke(0);
        strokeWeight(4);
        fill(palette[i]);
        noStroke();
        drawShape();
        pop();
      }
    }

    // Draw the mask image over everything else
    imageMode(CENTER);
    image(mask, 0, 0);
  }

  function drawShape() {
    strokeCap(PROJECT);
    strokeJoin(MITER);
    beginShape();
    vertex(32, 0);
    bezierVertex(31, 17, 17, 32, 0, 33);
    bezierVertex(8, 40, 18, 44, 29, 44);
    bezierVertex(30, 44, 31, 44, 31, 44);
    bezierVertex(42, 32, 42, 13, 32, 0);
    vertex(32, 0);
    endShape();
  }
}
