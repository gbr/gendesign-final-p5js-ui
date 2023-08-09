function visualize() {
  console.log('visualize is running');
  let api = document.getElementById('apiSelect').value;
  let algorithm = document.getElementById('algorithmSelect').value;

  // Remove existing canvas
  if (window.canvas) {
    window.canvas.remove();
  }

  switch (api) {
    case 'unsplash':
      switch (algorithm) {
        case 'binPacking':
          executeBinPacking();
          break;
        case 'centerImage':
          executeCenterImageAperture();
          break;
        case 'domeAperture':
          executeDomeAperture();
          break;
        case 'filledBlades':
          executeFilledBladeAperture();
          break;
      }
      break;
    case 'spotify':
      switch (algorithm) {
        case 'duotone':
          executeDuotone();
          break;
        case 'slice':
          executeSlice();
          break;
        case 'vinylVisualizer':
          executeRecordViewer();
          break;
        case 'yearEndViewer':
          executeYearEndViewer();
          break;
      }
      break;
  }
}

function setup() {}

// add event listener for when the window loads to reset the selection for all dropdowns
window.addEventListener('load', function () {
  document.getElementById('apiSelect').selectedIndex = 0;
  document.getElementById('algoDropdown').style.display = 'none';
  document.getElementById('visualizeBtn').style.display = 'none';
});

document.getElementById('apiSelect').addEventListener('change', function () {
  let api = document.getElementById('apiSelect').value;
  let algorithmSelect = document.getElementById('algorithmSelect');

  // Clear existing options
  algorithmSelect.innerHTML =
    '<option value="" disabled selected>Select an Algorithm</option>';

  let options = [];

  if (api === 'unsplash') {
    options = [
      { value: 'binPacking', text: 'Bin Packing' },
      { value: 'centerImage', text: 'Center Image' },
      { value: 'domeAperture', text: 'Dome Aperture' },
      { value: 'filledBlades', text: 'Filled Blades Aperture' },
    ];
  } else if (api === 'spotify') {
    options = [
      { value: 'duotone', text: 'Duotone' },
      { value: 'slice', text: 'Slice' },
      { value: 'vinylVisualizer', text: 'Vinyl Visualizer' },
      { value: 'yearEndViewer', text: 'Year End Viewer' },
    ];
  }

  options.forEach((opt) => {
    let option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.text;
    algorithmSelect.appendChild(option);
  });

  // Display the algorithm dropdown
  document.getElementById('algoDropdown').style.display = 'block';
});

document
  .getElementById('algorithmSelect')
  .addEventListener('change', function () {
    // Display the visualize button when an algorithm is selected
    document.getElementById('visualizeBtn').style.display = 'block';
  });

document.getElementById('visualizeBtn').addEventListener('click', visualize);
