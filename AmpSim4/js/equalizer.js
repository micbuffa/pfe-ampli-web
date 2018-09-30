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

    // Connect the last filter to the speakers
    //filters[filters.length - 1].connect(ctx.destination);

    function changeGainEQ(sliderVal, numFilter) {
        // sliderVal in [-12, +12]
        var value = parseFloat(sliderVal);
        filters[numFilter].gain.value = value;
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
        getValues: getValues,
        changeGainEQ: changeGainEQ
    };
}