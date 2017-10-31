export default function(callback) {
  const LOUDNESSTRESHOLD = 200;
  const CLAMPMIN = 150;
  const CLAMPMAX = 3000;
  const FOURIERSIZE = 2048;
  const INTERVAL = 10;

  let lastIteration = {
    didExceed: false,
    frequency: 0
  }

  var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = FOURIERSIZE;

  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

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

  function clamp(x, min, max) {
    if (x > max) {
      return max;
    } else if (x < min) {
      return min;
    } else {
      return x;
    }
  }

  function normalize(freq) {
    let output = (clamp(freq, CLAMPMIN, CLAMPMAX) - CLAMPMIN) / CLAMPMAX;
    return output;
  }

  function process() {
    analyser.getByteFrequencyData(dataArray);

    let frequency = Math.floor((indexOfMax(dataArray) + 1) * audioCtx.sampleRate / analyser.fftSize);
    let loudness = dataArray[indexOfMax(dataArray)];

    if (loudness > LOUDNESSTRESHOLD && lastIteration.didExceed) { // still runnin'
      lastIteration.didExceed = true;
      //   callback();
    } else if (loudness > LOUDNESSTRESHOLD && !lastIteration.didExceed) { // start
      lastIteration.didExceed = true;
      callback('start', normalize(frequency));
    } else if (loudness <= LOUDNESSTRESHOLD && lastIteration.didExceed) { // stop
      lastIteration.didExceed = false;
      callback('stop', normalize(frequency));
    } else {
      lastIteration.didExceed = false;
      // nothing happens here
    }
  }


  if (navigator.getUserMedia) {
    navigator.getUserMedia({
        audio: true
      },
      function(stream) {
        var source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        setInterval(process, INTERVAL);
      },
      function(err) {
        console.log("The following error occurred: " + err.name);
      }
    );
  } else {
    console.log('no get user media');
  }
}
