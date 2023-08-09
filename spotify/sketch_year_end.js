function executeYearEndViewer() {
  let svg1, svg2, svg3, svg4; // SVG layers
  let artistImg;
  let colorThief = new ColorThief();
  let colorPalette = [];
  let tintColors = [0, 1, 2]; // indices of colors to be used for tinting
  let paletteReady = false;

  // Declare scale factors for each SVG
  let scaleFactors = [1, 1, 1, 1];

  function preload() {
    svg1 = loadImage('images/svg1.png');
    svg2 = loadImage('images/svg2.png');
    svg3 = loadImage('images/svg3.png');
    svg4 = loadImage('images/svg4.png');
    artistImg = loadImage('artist.jpg');
    albumImg = loadImage('album.jpg');
  }

  function setup() {
    let cnv = createCanvas(800, 800);
    cnv.parent('canvasContainer');
    imageMode(CENTER);
    noLoop();

    let artistImgEl = new Image();
    artistImgEl.crossOrigin = 'Anonymous'; // Required when fetching image from another domain
    artistImgEl.src = artistImg.canvas.toDataURL();
    artistImgEl.onload = function () {
      if (artistImgEl.complete) {
        colorPalette = colorThief.getPalette(artistImgEl, 3); // getting 3 colors
        paletteReady = true;
        drawImageWithTints();
      }
    };

    window.canvas = cnv;
  }

  function drawImageWithTints() {
    if (!paletteReady) {
      return;
    }

    push(); // save current drawing settings
    background(0);
    translate(width / 2, height / 2); // Center all shapes

    // Draw SVG layers with color tints and scale factors
    tint(
      color(
        colorPalette[tintColors[0]][0],
        colorPalette[tintColors[0]][1],
        colorPalette[tintColors[0]][2]
      )
    );
    scale(scaleFactors[0]);
    image(svg1, 0, 0);
    scale(scaleFactors[1] / scaleFactors[0]); // Reset the previous scale and apply the new one
    image(svg2, 0, 0);
    tint(
      color(
        colorPalette[tintColors[1]][0],
        colorPalette[tintColors[1]][1],
        colorPalette[tintColors[1]][2]
      )
    );
    scale(scaleFactors[2] / scaleFactors[1]); // Reset the previous scale and apply the new one
    image(svg3, 0, 0);
    tint(
      color(
        colorPalette[tintColors[2]][0],
        colorPalette[tintColors[2]][1],
        colorPalette[tintColors[2]][2]
      )
    );
    scale(scaleFactors[2] / scaleFactors[1]); // Reset the previous scale and apply the new one
    image(svg4, 0, 0);
    resetMatrix(); // Reset transformations (scale/translate)

    translate(width / 2, height / 2); // Center all shapes
    noTint();
    image(albumImg, 0, 0, 400, 400);
    pop(); // restore saved drawing settings
  }

  function mousePressed() {
    if (mouseButton === LEFT) {
      tintColors = tintColors.map((colorIndex) => (colorIndex + 1) % 3); // rotate the color indices
      drawImageWithTints();
    }

    if (mouseButton === RIGHT) {
      // Randomly toggle the sizes of the SVGs
      scaleFactors = scaleFactors.map(() => random(0.8, 1.2)); // Random scales between 0.8 and 1.2 for demonstration, but you can adjust the range
      drawImageWithTints();
    }
  }
}
