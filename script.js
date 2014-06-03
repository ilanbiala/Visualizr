var context = new AudioContext || webkitAudioContext;
context = new AudioContext();

$(document).ready(function () {
  var input = $('input')[0];
  input.addEventListener('drop', handleDrop, false);
});

function handleDrop(evt) {
  evt.stopPropagation();
  var files = evt.dataTransfer.files;
  var validFiles = [];
  for (var file in files) {
    if (files[file].type == 'audio/mp3' || files[file].type == 'audio/ogg') {
      validFiles.push(files[file]);
    }
  }
  parseFiles(validFiles);
  $('<audio/>', {
    'controls': 'true'
  }).appendTo('body');
}

function parseFiles(files) {
  var fileReader = new FileReader();

  for (var i = 0, file; file = files[i]; i++) {

    // Closure to capture the file information.
    fileReader.onload = (function(file) {
      return function(e) {
        var parsedFile = e.currentTarget.result;
        $('audio').append('<source src="' + parsedFile + '" type="audio/mp3">')
      };
    })(file);

    // Read in the image file as a data URL.
    fileReader.readAsDataURL(file);
  }
}
