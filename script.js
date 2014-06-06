window.requestAnimationFrame = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame;

var context = new AudioContext || webkitAudioContext;
context = new AudioContext();

var analyser = context.createAnalyser();
analyser.frequencyBinCount = 256;

var source;
var filter = context.createBiquadFilter();

$('<audio/>', {
  'controls': 'true',
  'autoplay': 'true',
  'style': 'display: none;'
}).appendTo('div.playlist');

var audio = $('audio');
var audioHTML = audio[0];

var canvas, ctx;

$(document).ready(function () {
  var input = $('table input')[0];
  input.addEventListener('drop', handleDrop, false);

  $('#bassFilter').on('change', function (evt) {
    filter.frequency.value = (1 - $(this).val()) * 22050;
  });

  $('td').on('click', 'tbody', function(e) {
    console.log('clicked');
  });

  canvas = $('canvas');
  ctx = canvas[0].getContext('2d');
});

function handleDrop(evt) {
  evt.stopPropagation();
  var files = evt.dataTransfer.files;
  var validFiles = [];
  for (var file in files) {
    if (files[file].type == 'audio/mp3' || files[file].type == 'audio/ogg') {
      validFiles.push(files[file]);
      var newRow = '<tr><td>' + files[file].name + '</td></tr>';
      $('tbody').prepend($(newRow));
    }
  }
  parseFiles(validFiles);
  audio.css('display', 'block');
  source = context.createMediaElementSource($('audio')[0]);
  source.connect(analyser);
  analyser.connect(filter);
  filter.connect(context.destination);
  filter.type = 0;
  filter.frequency.value = 22050;
  paintCanvas();
}

function parseFiles(files) {
  var fileReader = new FileReader();

  for (var i = 0, file; file = files[i]; i++) {

    // Closure to capture the file information.
    fileReader.onload = (function(file) {
      return function(e) {
        var parsedFile = e.currentTarget.result;
        $('tbody tr')[i].setAttribute('data-src', parsedFile);
        $('audio').append('<source src="' + parsedFile + '" type="audio/mp3">')
      };
    })(file);

    // Read in the image file as a data URL.
    fileReader.readAsDataURL(file);
  }
}

function paintCanvas() {
  ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
  ctx.fillStyle = 'ffdc00';
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(frequencyData);
  for (var i = 0; i < frequencyData.length; i += 2) {
    ctx.fillRect(i, 0, 4, frequencyData[i]);
  }
  requestAnimationFrame(paintCanvas);
}
