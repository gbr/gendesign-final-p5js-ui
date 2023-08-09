function executeDuotone() {
  let albumImg, artistImg;
  let colorThief = new ColorThief();
  let colorPalette = [];
  let duotoneColors = [0, 1]; // indices of colors to be used for duotone effect

  function preload() {
    albumImg = loadImage(
      'album.jpg',
      (img) => {
        console.log('Album image loaded successfully');
      },
      (img) => {
        console.log('Failed to load album image');
      }
    );

    artistImg = loadImage(
      'artist.jpg',
      (img) => {
        console.log('Artist image loaded successfully');
      },
      (img) => {
        console.log('Failed to load artist image');
      }
    );
  }

  function setup() {
    let cnv = createCanvas(800, 800);
    cnv.parent('canvasContainer');
    noLoop();
    imageMode(CENTER);
    background(0);

    let albumImgEl = new Image();
    albumImgEl.crossOrigin = 'Anonymous'; // Required when fetching image from another domain
    albumImgEl.src = albumImg.canvas.toDataURL();
    albumImgEl.onload = function () {
      if (albumImgEl.complete) {
        colorPalette = colorThief.getPalette(albumImgEl, 5); // getting 5 colors
        drawImageWithDuotoneEffect();
      }
    };

    window.canvas = cnv;
  }

  function drawImageWithDuotoneEffect() {
    // Apply duotone effect and draw artist image
    let c2 = color(
      colorPalette[duotoneColors[0]][0],
      colorPalette[duotoneColors[0]][1],
      colorPalette[duotoneColors[0]][2]
    );
    let c1 = color(
      colorPalette[duotoneColors[1]][0],
      colorPalette[duotoneColors[1]][1],
      colorPalette[duotoneColors[1]][2]
    );

    let modifiedImg = artistImg.get(); // copy the original image so we can modify it without changing the original
    modifiedImg.loadPixels();
    for (let y = 0; y < modifiedImg.height; y++) {
      for (let x = 0; x < modifiedImg.width; x++) {
        let index = (x + y * modifiedImg.width) * 4;
        let r = modifiedImg.pixels[index];
        let g = modifiedImg.pixels[index + 1];
        let b = modifiedImg.pixels[index + 2];

        let bw = (r + g + b) / 3; // grayscale

        if (bw < 128) {
          modifiedImg.pixels[index] = red(c1);
          modifiedImg.pixels[index + 1] = green(c1);
          modifiedImg.pixels[index + 2] = blue(c1);
        } else {
          modifiedImg.pixels[index] = red(c2);
          modifiedImg.pixels[index + 1] = green(c2);
          modifiedImg.pixels[index + 2] = blue(c2);
        }
      }
    }
    modifiedImg.updatePixels();

    background(0); // clear the canvas before drawing the new image

    // Draw three images at different positions and sizes
    let baselineY = height * 0.9;

    // Draw three images at different positions and sizes
    let imgHeight = modifiedImg.height * 0.5;
    let imgY = baselineY - imgHeight / 2; // Adjust Y to match the baseline
    image(modifiedImg, width * 0.2, imgY, modifiedImg.width * 0.5, imgHeight);

    imgHeight = modifiedImg.height * 0.75;
    imgY = baselineY - imgHeight / 2; // Adjust Y to match the baseline
    image(modifiedImg, width * 0.4, imgY, modifiedImg.width * 0.75, imgHeight);

    imgHeight = modifiedImg.height;
    imgY = baselineY - imgHeight / 2; // Adjust Y to match the baseline
    image(modifiedImg, width * 0.6, imgY, modifiedImg.width, imgHeight);
  }

  function mousePressed() {
    if (mouseButton === LEFT) {
      duotoneColors[0] = (duotoneColors[0] + 1) % 5;
      duotoneColors[1] = (duotoneColors[1] + 1) % 5;
    } else if (mouseButton === RIGHT) {
      let temp = duotoneColors[0];
      duotoneColors[0] = duotoneColors[1];
      duotoneColors[1] = temp;
    }
    drawImageWithDuotoneEffect();
  }
}
