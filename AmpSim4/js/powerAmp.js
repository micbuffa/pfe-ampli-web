function PowerAmp(ctx) {
  var bypass = false;

  var wsFactory = ctx.createWaveShaper();

  var masterVolume = ctx.createGain();
  var boostGain = ctx.createGain();
  boostGain.gain.value = 2;
  var regularBoostGainValue = 2;
  var boostOnBoost = 0;
  var currentBoostGainValue = boostGain.gain.value;

  var ws = ctx.createWaveShaper();
  var k = getRealKFrom_1_10_range(8);
  var wsFactory = new WaveShapers();
  var currentDistoName = "clean";
  ws.curve = wsFactory.distorsionCurves[currentDistoName](k);

  /*
    var presenceFilter = ctx.createBiquadFilter();
    presenceFilter.frequency.value = 3900;
    presenceFilter.type = "peaking";
    presenceFilter.Q.value = 0.7071; // To check with Lepou
*/

  var presenceGainRange = 4; // from -4db to +4db

  //var presenceFilter2 = new PresenceFilter2(ctx);

  var presenceFilter3 = new PresenceFilter3(ctx);

  // Delay but it will not be possible to set a delay value less
  // than a sample quantum (128 or 512 samples ?)
  var delay = ctx.createDelay();
  delay.delayTime.value = 128 / ctx.sampleRate; // to adjust

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
  var adjustmentGain = ctx.createGain();
  adjustmentGain.gain.value = 1;

  // lo and hi cut at the end, corresponds to output tranny (transformateur)
  var eqhicut = ctx.createBiquadFilter();
  eqhicut.frequency.value = 10000;
  eqhicut.type = "peaking";
  eqhicut.gain.value = -24;

  var eqlocut = ctx.createBiquadFilter();
  eqlocut.frequency.value = 60;
  eqlocut.type = "peaking";
  eqlocut.gain.value = -18;

  var loAndHiCutFiltersEnabled = false;

  //var buildgraph = function() {
  /*
      masterVolume.connect(wetGain).connect(adjustmentGain).connect(ws).connect(presenceFilter).connect(negativeGain);
      negativeGain.connect(ws); // feedback loop
      presenceFilter.connect(eqhicut).connect(eqlocut).connect(outputGain); // direct route from presence filter

      // bypass route
      masterVolume.connect(dryGain).connect(outputGain);
    //
*/

  masterVolume
    .connect(wetGain)
    .connect(adjustmentGain)
    .connect(ws)
    .connect(presenceFilter3.input);
  presenceFilter3.output
    .connect(negativeGain)
    .connect(delay)
    .connect(ws); // feedback loop
  //ws.connect(eqhicut).connect(eqlocut).connect(outputGain);

  //presenceFilter3.output.connect(eqhicut).connect(eqlocut).connect(outputGain); // direct route from presence filter

  // bypass route
  //masterVolume.connect(dryGain).connect(eqhicut).
  masterVolume.connect(dryGain).connect(outputGain);
  // WITH LO AND HI CUT
  //presenceFilter3.output.connect(boostGain).connect(eqhicut).connect(eqlocut).connect(outputGain);
  // WITHOUT LO AND HI CUT IN THE PA
  presenceFilter3.output.connect(boostGain).connect(outputGain);
  /*
    masterVolume.connect(wetGain).connect(adjustmentGain).connect(ws).connect(lowpass).connect(outputGain);
    ws.connect(hipass).connect(hipassgain).connect(outputGain);
    */
  // bypass route
  //masterVolume.connect(dryGain).connect(outputGain);

  function toggleHiAndLoCutFilters() {
    if (loAndHiCutFiltersEnabled) {
      // let's disconnect these filters
      boostGain.disconnect(eqhicut);
      eqlocut.disconnect(outputGain);

      // connect directly boostGain to output gain
      boostGain.connect(outputGain);
    } else {
      // Let's disconnect boostGain from outputGain
      boostGain.disconnect(outputGain);
      // let's add the filters
      boostGain
        .connect(eqhicut)
        .connect(eqlocut)
        .connect(outputGain);
    }

    loAndHiCutFiltersEnabled = !loAndHiCutFiltersEnabled;
  }

  function setHiAndLoCutFilters(enableFilters) {
    // for old presets without filters
    if (enableFilters === undefined) enableFilters = false;

    // If the power amp filters are int he requested state, do nothing
    if (enableFilters === loAndHiCutFiltersEnabled) return;

    // else toggle filters
    toggleHiAndLoCutFilters();
  }

  function toggleBypass() {
    if (!bypass) {
      dryGain.gain.value = 1;
      wetGain.gain.value = 0;
      //eqlocut.disconnect(outputGain);
    } else {
      dryGain.gain.value = 0;
      wetGain.gain.value = 1;
      //eqlocut.connect(outputGain);
    }
    bypass = !bypass;
  }

  function getBypassStatus() {
    return bypass;
  }

  function getLoHiCutFilterStatus() {
    return loAndHiCutFiltersEnabled;
  }

  function getBoostGainValue() {
    return regularBoostGainValue;
  }

  function changeBoostGainValue(val) {
    currentBoostGainValue = parseFloat(val);
    regularBoostGainValue = currentBoostGainValue;

    // boostOnBoost = 0; -> no boost when master vol is low...

    // the value we put is the slider value + boostOnBoost
    // that is an adjustment when master is too low
    boostGain.gain.value = currentBoostGainValue + boostOnBoost;
    console.log("setting boostGain.gain.value = " + boostGain.gain.value);
  }

  function adjustLowMasterVolume(val) {
    boostOnBoost = parseFloat(val);
    // call with current boost gain value. boostOnBoost will be applied
    changeBoostGainValue(currentBoostGainValue);
  }

  function changePresenceFilterGainValue(sliderVal) {
    // sliderVal is in [0, 10], gain will vary between -8 and + 8 for a presenceGainRange = 4, for example
    var value = parseFloat(sliderVal);
    var adjustedValue = map(
      value,
      0,
      10,
      -presenceGainRange,
      presenceGainRange
    );

    //presenceFilter.gain.value = adjustedValue;
    //console.log("poweramp : presence new value = " + presenceFilter.gain.value);
    //hipassgain.gain.value = value;
    //presenceFilter2.changeGainValue(value);
    // TO DO ! THINK ABOUT WHAT THE PRESENCE KNOB WOULD ADJUST IN CASE OF FILTER BANK
    //console.log("presence changee " + adjustedValue);

    if (bypass) {
      // No power amp enabled, use old presence implementation
    } else {
      // use the presence in the negative feedback loop of the power amp
      presenceFilter3.adjustPresence(adjustedValue);
    }
  }

  function changePresenceFreqValue(sliderVal) {
    var value = parseFloat(sliderVal);
    presenceFilter.frequency.value = value;
    //console.log("poweramp : presence new freq value = " + presenceFilter.frequency.value);
  }

  function changePresenceGainRange(sliderVal) {
    var value = parseFloat(sliderVal);
    presenceGainRange = value;
    //console.log("poweramp : presence gain range = +=" + presenceGainRange + " dB");
  }

  function getPresenceGainRange() {
    return presenceGainRange;
  }

  function changeNegativeGainValue(sliderVal) {
    var value = parseFloat(sliderVal);
    negativeGain.gain.value = sliderVal;
  }

  function changeDistoType(type) {
    currentDistoName = type;
    ws.curve = wsFactory.distorsionCurves[type](k);
    //console.log("power amp, transfer function = " + type);
  }

  // Returns the value of k in the [0, 10] range
  function getDistorsionValue() {
    var pos = logToPos(k);
    return parseFloat(pos).toFixed(1);
  }

  function changeK(sliderValue) {
    // sliderValue is in [0, 10] range, adjust to [0, 1500] range

    k = getRealKFrom_1_10_range(sliderValue);
    //console.log("change K current disto name = " + currentDistoName);
    ws.curve = wsFactory.distorsionCurves[currentDistoName](k);

    //console.log("power amp k = " + k);
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

  function getPresenceFilterParams() {
    return presenceFilter3.getParams();
  }

  function setPresenceFilterParams(paramArray) {
    presenceFilter3.setParams(paramArray);
  }

  function isEnabled() {
    return !bypass;
  }

  // API
  return {
    bypass: bypass,
    input: masterVolume,
    output: outputGain,
    masterVolume: masterVolume,
    ws: ws,
    k: k,
    getDistorsionValue: getDistorsionValue,
    delay: delay,
    negativeGain: negativeGain,
    toggleBypass: toggleBypass,
    getBypassStatus: getBypassStatus,
    boostGain: boostGain,
    isEnabled: isEnabled,
    adjustLowMasterVolume: adjustLowMasterVolume,
    changeBoostGainValue: changeBoostGainValue,
    getBoostGainValue: getBoostGainValue,
    changePresenceFilterGainValue: changePresenceFilterGainValue,
    changeNegativeGainValue: changeNegativeGainValue,
    changePresenceFreqValue: changePresenceFreqValue,
    getPresenceGainRange: getPresenceGainRange,
    getPresenceFilterParams: getPresenceFilterParams,
    presenceGainRange: presenceGainRange,
    changePresenceGainRange: changePresenceGainRange,
    setPresenceFilterParams: setPresenceFilterParams,
    changeDistoType: changeDistoType,
    changeK: changeK,
    toggleHiAndLoCutFilters: toggleHiAndLoCutFilters,
    getLoHiCutFilterStatus: getLoHiCutFilterStatus,
    setHiAndLoCutFilters: setHiAndLoCutFilters
  };
}

function PresenceFilter2(ctx) {
  var input = ctx.createGain();

  var lowpass = ctx.createBiquadFilter();
  lowpass.frequency.value = 2000;
  lowpass.type = "lowpass";
  lowpass.Q.value = 0.7071;

  var hipass = ctx.createBiquadFilter();
  hipass.frequency.value = 3000;
  hipass.type = "highpass";
  hipass.Q.value = 0.7071;
  var hipassgain = ctx.createGain();
  hipassgain.gain.value = -0.3;

  var output = ctx.createGain();

  input.connect(lowpass).connect(output);
  input
    .connect(hipass)
    .connect(hipassgain)
    .connect(output);

  function changeGainValue(val) {
    val = map(val, 0, 10, 0, 2);
    hipassgain.gain.value = -val;
  }

  return {
    input: input,
    output: output,
    changeGainValue: changeGainValue
  };
}

function PresenceFilter3(ctx) {
  // filter bank/GrahicEQ from -10dB to +10dB
  var bank = new FilterBank(ctx, document.querySelector("#divFilterBank"), 8);
  //console.log(bank.getCurrentSettingsJSON());

  function adjustPresence(val) {
    bank.adjustPresence(val);
  }

  function getParams() {
    return bank.getFiltersParamsAsArray();
  }

  function setParams(paramArray) {
    bank.setFiltersParams(paramArray);
  }
  // API
  return {
    input: bank.getInput(),
    output: bank.getOutput(),
    getParams: getParams,
    setParams: setParams,
    adjustPresence: adjustPresence
  };
}
