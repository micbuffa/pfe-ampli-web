// maps a value from [istart, istop] into [ostart, ostop]
function map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

// utils functions for some waveshapers
function tanh(n) {
    return (Math.exp(n) - Math.exp(-n)) / (Math.exp(n) + Math.exp(-n));
}

function sign(x) {
    if (x === 0) {
        return 1;
    } else {
        return Math.abs(x) / x;
    }
}

function logToPos(logValue) {
    var minp = 0;
    var maxp = 1500;

    // The result should be between 10 an 1500
    var minv = Math.log(10);
    var maxv = Math.log(1500);

    // calculate adjustment factor
    var scale = (maxv - minv) / (maxp - minp);

    return (minp + (Math.log(logValue) - minv) / scale) / 150;
}

// Loads a sample and decode it using ES6 new syntax
// returns a promise
function loadSample(audioContext, url){
          console.log('done');
    return new Promise(function(resolve, reject){
        fetch(url)
        .then((response) => {
            return response.arrayBuffer();
        })
        .then((buffer) =>{
            audioContext.decodeAudioData(buffer, (decodedAudioData) =>{
                resolve(decodedAudioData);
            });
        });
    });
}