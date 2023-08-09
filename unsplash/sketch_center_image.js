function executeCenterImageAperture() {
  let fStopSlider;
  let mask; // Variable to hold the mask image
  let centerImg; // Variable for center image
  let centerImgEl;
  let centerImgLoaded = false; // Variable to check if center image is loaded
  let colorThief = new ColorThief();
  let domColor;
  let colorExtracted = false;

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

        // Moved inside the callback function
        centerImgEl = new Image();
        centerImgEl.crossOrigin = 'Anonymous'; // Required when fetching image from another domain
        centerImgEl.src = img.canvas.toDataURL();
        centerImgEl.onload = function () {
          if (centerImgEl.complete) {
            let rgb = colorThief.getColor(centerImgEl);
            domColor = color(rgb[0], rgb[1], rgb[2]);
            colorExtracted = true;
          }
        };
      },
      (img) => {
        console.log('Failed to load center image');
      }
    );
  }

  function drawCenterImage(img, fStopValue) {
    if (centerImgLoaded) {
      // let blurAmount = map(fStopValue, 0, 240, 0, 10); // Maps fStopValue from range 0-240 to 0-10
      // img.filter(BLUR, blurAmount);
      push();
      scale(1 / 4);
      imageMode(CENTER);
      scale(2);
      image(img, 0, 0);
      pop();
    }
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

    drawCenterImage(centerImg, fStopValue);

    let blackColor = color(0, 0, 0);
    let fillValue = map(fStopValue, 0, 240, 0, 1);
    let strokeValue = map(fStopValue, 0, 240, 1, 0);

    let fillCol = lerpColor(domColor, blackColor, fillValue);
    let strokeCol = lerpColor(blackColor, domColor, strokeValue);

    let strokeWeightValue = map(abs(fStopValue - 120), 0, 120, 1, 3.2); // Stroke weight varies between 1 and 3.2
    if (colorExtracted) {
      for (let i = 0; i < 8; i++) {
        push();
        rotate((i * PI) / 4 + t);
        translate(0, -fStopValue);
        scale(8);
        stroke(domColor);
        strokeWeight(2.2); // Use the mapped stroke weight
        fill(fillCol);
        drawShape();
        pop();
      }
    }

    // Draw the mask image over everything else
    imageMode(CENTER);
    image(mask, 0, 0);
  }

  function drawShape() {
    // fill(0);  // Comment this line out so the texture can be seen
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
