import $ from "jquery";

const noten = [];

translate();

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

$(function() {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser();

  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  setInterval(draw, 200);

  function draw() {
    // let drawVisual = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    $(".output").text(
      noten[Math.floor((indexOfMax(dataArray) + 1) * audioCtx.sampleRate / analyser.fftSize)] || 0
    );
    
  }

  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      {
        audio: true
      },
      function(stream) {
        var source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        draw();
      },
      function(err) {
        console.log("The following error occurred: " + err.name);
      }
    );
  }
});



function translate(){
  for(var i = 160; i < 670; i++){
    
    if(i > 160 && i < 169){
      noten[i] = 'E';
    }
    if(i > 170 && i < 179){
      noten[i] = 'F';
    }
    if(i > 180 && i < 190){
      noten[i] = 'Fis';
    }
    if(i > 190 && i < 200){
      noten[i] =  'G';
    }
    if(i > 200 && i < 210){
      noten[i] =  'Gis';
    }
    if(i > 220 && i < 230){
      noten[i] =  'A';
    }
    if(i > 160 && i < 169){
      noten[i] =  'B';
    }
  }
}