function executeBinPacking() {
  let DEBUG_MODE = false; // Set to false to turn off debugging
  const GOLDEN_RATIO = 1.61803398875;
  const GAP = 5; // Gap between rectangles
  const TOTAL_IMAGES = 50;

  function getRandomImageNames() {
    let selectedIndices = [];
    while (selectedIndices.length < 7) {
      let randomIndex = Math.floor(Math.random() * TOTAL_IMAGES) + 1;
      if (!selectedIndices.includes(randomIndex)) {
        selectedIndices.push(randomIndex);
      }
    }
    return selectedIndices.map((index) => `image${index}.jpg`);
  }

  function getImageDataFromLocal() {
    let imageNames = getRandomImageNames();
    let imageDataList = [];

    imageNames.forEach((imageName, index) => {
      let imgElement = loadImage(`images/${imageName}`, () => {
        console.log(`found image ${imageName}, index ${index}`);
        let colorThief = new ColorThief();

        // Use the p5.Image object directly
        let dominantColor = colorThief.getColor(imgElement.canvas);

        let aspectRatio = imgElement.width / imgElement.height;

        let scaledWidth = 100; // arbitrary width
        let scaledHeight = scaledWidth / aspectRatio;

        imageDataList.push({
          w: scaledWidth,
          h: scaledHeight,
          url: `images/${imageName}`,
          aspectRatio: aspectRatio,
          dominantColor: `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`,
        });
        console.log(`pushed image ${imageName}, index ${index}`);

        if (index === imageNames.length - 1) {
          // Continue to the next step with the imageDataList
          packedImages = packImages(imageDataList);
          createComposition(packedImages); // Call the function here
        }
      });
    });
  }

  function packImages(imageDataList) {
    // Duplicate the first rectangle a few times for repetition
    let firstRect = imageDataList[0];
    for (let i = 0; i < 3; i++) {
      imageDataList.push(firstRect);
    }

    // Group by dominant color for harmony and unity
    imageDataList.sort((a, b) =>
      a.dominantColor.localeCompare(b.dominantColor)
    );

    // Shuffle for asymmetry
    imageDataList = imageDataList.sort(() => Math.random() - 0.5);

    let packer = new GrowingPacker();
    packer.fit(imageDataList);

    // The blocks (imageDataList) now have a 'fit' property if they fit inside the bin
    let packedImages = imageDataList
      .filter((imgData) => imgData.fit)
      .map((imgData) => {
        return {
          ...imgData,
          assignedX: imgData.fit.x + GAP,
          assignedY: imgData.fit.y + GAP,
          assignedWidth: imgData.w * GOLDEN_RATIO,
          assignedHeight: imgData.h * GOLDEN_RATIO,
        };
      });

    return packedImages;
  }

  function getContrastingBackground(packedImages) {
    let totalR = 0,
      totalG = 0,
      totalB = 0;

    packedImages.forEach((img) => {
      let colorValues = img.dominantColor.match(/\d+/g).map(Number);
      totalR += colorValues[0];
      totalG += colorValues[1];
      totalB += colorValues[2];
    });

    let avgR = totalR / packedImages.length;
    let avgG = totalG / packedImages.length;
    let avgB = totalB / packedImages.length;

    let grayscale = (avgR + avgG + avgB) / 3;

    // If the average is closer to white, return black; otherwise, return white
    return grayscale > 128 ? 0 : 255;
  }

  function shouldDrawBorder(backgroundColor) {
    // Calculate the difference between the grayscale background color and white
    let contrastDifference = Math.abs(backgroundColor - 255);

    // Set a threshold for contrast. For example, if the difference is less than 50, it's considered low contrast.
    return contrastDifference < 50;
  }

  function drawBorderIfNecessary(backgroundColor) {
    if (shouldDrawBorder(backgroundColor)) {
      noFill(); // Transparent fill
      stroke(0); // White stroke
      strokeWeight(1);
      rect(0, 0, width - 1, height - 1); // Draw a rectangle around the entire canvas
    }
  }

  function createComposition(packedImages) {
    let cnv = createCanvas(800, 800);
    // cnv.parent('canvasContainer');
    let backgroundColor = getContrastingBackground(packedImages);
    background(backgroundColor);

    let maxX = Math.max(
      ...packedImages.map((img) => img.assignedX + img.assignedWidth)
    );
    let maxY = Math.max(
      ...packedImages.map((img) => img.assignedY + img.assignedHeight)
    );
    let scaleFactorX = width / maxX;
    let scaleFactorY = height / maxY;
    let scaleFactor = Math.min(scaleFactorX, scaleFactorY);

    packedImages.forEach((img, index) => {
      let scaledWidth = img.assignedWidth * scaleFactor;
      let scaledHeight = img.assignedHeight * scaleFactor;
      let scaledX = img.assignedX * scaleFactor;
      let scaledY = img.assignedY * scaleFactor;

      push(); // Save current drawing settings

      // Randomly decide to use the original image or the dominant color
      if (Math.random() > 0.75) {
        let imgElement = loadImage(img.url, () => {
          // Adjust the size for photos
          scaledWidth *= 0.75;
          scaledHeight *= 0.75;

          // Adjust the placement for photos
          scaledX += width * 0.05;
          scaledY += height * 0.05;

          image(imgElement, scaledX, scaledY, scaledWidth, scaledHeight);
        });
      } else {
        if (backgroundColor == 0) {
          noFill();
          stroke(img.dominantColor);
          strokeWeight(1);
        } else {
          fill(img.dominantColor);
          noStroke();
        }
        rect(scaledX, scaledY, scaledWidth, scaledHeight);
      }

      pop(); // Restore saved drawing settings

      if (DEBUG_MODE) {
        // Debugging: Draw an outline and index number on each rectangle
        noFill();
        stroke(255, 0, 0); // Red outline
        rect(scaledX, scaledY, scaledWidth, scaledHeight);
        fill(255);
        text(index + 1, scaledX + 5, scaledY + 15); // Display the image index
      }
    });

    drawBorderIfNecessary(backgroundColor);
    window.canvas = cnv;
  }

  function setup() {
    noLoop(); // Ensure p5.js doesn't continuously loop
    getImageDataFromLocal();
  }
}
