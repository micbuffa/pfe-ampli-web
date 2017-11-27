//----------- EQUALIZER ----------- 
function Equalizer(ctx) {
    var filters = [];

    // Set filters
    // Fred: 80 for the low end. 10000 useless, use shelf instead...
    [60, 170, 350, 1000, 3500, 10000].forEach(function (freq, i) {
        var eq = ctx.createBiquadFilter();
        eq.frequency.value = freq;
        eq.type = "peaking";
        eq.gain.value = 0;
        filters.push(eq);
    });

    // Connect filters in serie
    //sourceNode.connect(filters[0]);

    for (var i = 0; i < filters.length - 1; i++) {
        filters[i].connect(filters[i + 1]);
    }

    // connect the last filter to the speakers
    //filters[filters.length - 1].connect(ctx.destination);

    function changeGain(sliderVal, nbFilter) {
        // sliderVal in [-30, +30]
        var value = parseFloat(sliderVal);
        filters[nbFilter].gain.value = value;

        // update output labels
        //var output = document.querySelector("#gain" + nbFilter);
        //output.value = value + " dB";

        // update sliders
        //var numSlider = nbFilter + 1;
        //var slider = document.querySelector("#EQ" + numSlider + "slider");
        //slider.value = value;

        // refresh amp slider state in the web component GUI
        var sliderWC = document.querySelector("#slider" + (nbFilter+1));
        // second parameter set to false will not fire an event
        sliderWC.setValue(parseFloat(sliderVal).toFixed(0), false);
    }

    function setValues(values) {
        values.forEach(function (val, index) {
            changeGain(val, index);
        });
    }

    function getValues() {
        var values = [];
        filters.forEach(function (f, index) {
            values.push(f.gain.value);
        });
        return values;
    }

    return {
        input: filters[0],
        output: filters[filters.length - 1],
        setValues: setValues,
        getValues: getValues,
        changeGain: changeGain
    };
}