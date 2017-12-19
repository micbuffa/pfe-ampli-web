function PowerAmp(ctx) {
    var wsFactory = ctx.createWaveShaper();
  
    var masterVolume = ctx.createGain();
    
    var ws = ctx.createWaveShaper();
    var k = getRealKFrom_1_10_range(8);
    var wsFactory = new WaveShapers();
    var currentDistoName = "clean";
    ws.curve = wsFactory.distorsionCurves[currentDistoName](k);
    
    //ws.curve = wsFactory.distorsionCurves.clean(0);
    
    var presenceFilter = ctx.createBiquadFilter();
    presenceFilter.frequency.value = 3900;
    presenceFilter.type = "peaking";
    presenceFilter.Q.value = 0.7071; // To check with Lepou
    
    // Delay but it will not be possible to set a delay value less
    // than a sample quantum (128 or 512 samples ?)
    var delay = ctx.createDelay();
    delay.delayTime.value = 0.1; // to adjust
    
    // negative gain
    var negativeGain = ctx.createGain();
    negativeGain.gain.value = -0.4; // to adjust
    
    // output gain
    var outputGain = ctx.createGain();
    
    // dry/wet gains
    var dryGain = ctx.createGain();
    dryGain.gain.value = 0;
    var wetGain = ctx.createGain();
    wetGain.gain.value = 1;
  
    //var buildgraph = function() {
      //masterVolume.connect(ws).connect(presenceFilter).connect(delay).connect(negativeGain);
      masterVolume.connect(wetGain).connect(ws).connect(presenceFilter).connect(negativeGain);
      negativeGain.connect(ws); // feedback loop
      presenceFilter.connect(outputGain); // direct route from presence filter

      // bypass route
      masterVolume.connect(dryGain).connect(outputGain);
    //
    
    function toggleBypass() {
        if(!bypass) {
            dryGain.gain.value = 1;
            wetGain.gain.value = 0;
        } else {
            dryGain.gain.value = 0;
            wetGain.gain.value = 1;
           
        }
        bypass = !bypass;
    }

    function changePresenceFilterValue(sliderVal) {
        // sliderVal is in [0, 10], gain will vary between -10 and + 10;
        var value = parseFloat(sliderVal);
        presenceFilter.gain.value = (value-5) * 2;
        console.log("poweramp : presence new value = " + presenceFilter.gain.value);
    }

    function changeDistoType(type) {
        this.currentDistoName = type;
        ws.curve = wsFactory.distorsionCurves[type](k);
        console.log("power amp, transfer function = " + type);
    }

    
    function changeK(sliderValue) {
        // sliderValue is in [0, 10] range, adjust to [0, 1500] range  
    
        k = getRealKFrom_1_10_range(sliderValue);
        ws.curve = wsFactory.distorsionCurves[currentDistoName](k);

        console.log("power amp k = " + k);
     }

     function getRealKFrom_1_10_range(val) {
        var value = 150 * parseFloat(val);
        var minp = 0;
        var maxp = 1500;

        // The result should be between 10 an 1500
        var minv = Math.log(10);
        var maxv = Math.log(1500);

        // calculate adjustment factor
        var scale = (maxv - minv) / (maxp - minp);

        value = Math.exp(minv + scale * (value - minp));
        // end of logarithmic adjustment
        return value;
     }

    // API
    return {
      input: masterVolume,
      output: outputGain,
      masterVolume: masterVolume,
      waveShaper: ws,
      k:k,
      presence: presenceFilter,
      delay: delay,
      negativeGain: negativeGain,
      toggleBypass:toggleBypass,
      changePresenceFilterValue: changePresenceFilterValue,
      changeDistoType:changeDistoType,
      changeK:changeK
    }
  }