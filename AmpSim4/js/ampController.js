class AmpController {
  constructor(amp, ampViewer) {
    this.amp = amp;
    this.ampViewer = ampViewer;
    this.guitarPluggedIn = false;
    this.presets = amp.presets;
    this.normalBuild = true;
    this.nbLampPairs = 2;
  }

  // ------- Amp related handlers -------

  //
  // Preamp handlers
  //

  // Distortions

  changeDistorsionValues(sliderValue, numDisto, doNotUpdateKnob) {
    // update processing 
    this.amp.preamp.changeDistorsionValuesPA(sliderValue, numDisto);
    // update view
    this.ampViewer.changeDistoLabels(sliderValue, numDisto, doNotUpdateKnob);

    if(!doNotUpdateKnob) {
      this.currentK = parseFloat(sliderValue);
    }
  }

  // Bezier
  changeBezierValues(sliderValue, numDisto) {
    if (amp.preamp.distoTypes[numDisto] == "bezier") {
      // update processing values
      this.amp.preamp.changeBezierValuesPA(sliderValue, numDisto);
      // update view
      this.ampViewer.changeBezierLabels(sliderValue, numDisto);
    }
  }

  changeDisto1Type(sliderVal) {
    this.amp.preamp.changeDisto1TypePA(sliderVal);
    this.changeDrive(this.amp.preamp.currentK);
  }

  changeDisto1FromPreset(name) {
    this.amp.preamp.changeDisto1TypeFromPreset(name);
    this.ampViewer.updateDisto1Name(name);
  }

  changeDisto2Type(sliderVal) {
    this.amp.preamp.changeDisto2TypePA(sliderVal);
    this.changeDrive(this.amp.preamp.currentK);
  }

  changeDisto2FromPreset(name) {
    this.amp.preamp.changeDisto2TypeFromPreset(name);
    this.ampViewer.updateDisto2Name(name);
  }

  changeDrive(sliderValue, doNotUpdateKnob) {
    // sliderValue in [0,10]
    // We can imagine having some "profiles here" -> generate
    // different K values from one single sliderValue for the
    // drive.
    // other values i.e [0.5, 0.5, 0.8, 1] -> less distorsion
    // on bass frequencies and top high frequency

    for (var i = 0; i < 2; i++) {
      this.changeDistorsionValues(sliderValue, i, doNotUpdateKnob);
    }
  }

  dynamicDriveAdjustment() {
    this.currentK = this.ampViewer.driveKnob.value;
    var k, inc;
    var animId = setInterval(() =>  {
       inc = map(this.ampViewer.inputVisualization.getAverageAmplitude(), 0, 100, -7, 7);
        //console.log(averageInputValue)
        k = parseFloat(this.currentK) + inc;
        //console.log(inc);
        //changeK(k.value);
        //this.driveKnob.setValue(k, true);
        this.changeDrive(k, true);
    }, 50);
}


  changePowerAmpDistoType(name) {
    this.amp.powerAmp.changeDistoType(name);
    console.log("changin disto type = " + name);
    this.ampViewer.drawCurrentPowerAmpDistoCurve(this.amp.powerAmp.ws.curve);
    this.ampViewer.updateDisto4Name(name);
  }

  changePowerAmpNegativeGainValue(val) {
    this.amp.powerAmp.changeNegativeGainValue(val);
    this.ampViewer.changePowerAmpNegativeGainLabel(val);
  }

  changePowerAmpPresenceFreqValue(val) {
    this.amp.powerAmp.changePresenceFreqValue(val);
    this.ampViewer.changePowerAmpFreqValueLabel(val);
  }

  changePowerAmpPresenceGainRangeValue(val) {
    this.amp.powerAmp.changePresenceGainRange(val);
    this.ampViewer.changePowerAmpPresenceGainRangeValueLabel(val);
  }

  changePowerAmpK(val) {
    this.amp.powerAmp.changeK(val);
    this.ampViewer.changePowerAmpDistoLabel(val);
    this.ampViewer.drawCurrentPowerAmpDistoCurve(this.amp.powerAmp.ws.curve);
  }

  setPowerAmpPresenceFilterParams(paramArray) {
    this.amp.powerAmp.setPresenceFilterParams(paramArray);
  }

  togglePoweAmpBypass() {
    this.amp.powerAmp.toggleBypass();
    this.ampViewer.changePowerAmpStatus(this.amp.powerAmp.getBypassStatus());
  }

  
  setCurveHandlers() {
    // Change distortion on mouse move in Canvas distoDrawer 1
    var canvas1,
      flag1,
      rect1,
      label1,
      kValue1,
      bias1label,
      bias1value,
      angle1,
      shift1,
      newK1;
    canvas1 = document.querySelector("#distoDrawerCanvas1");
    label1 = document.querySelector("#k1label");
    bias1label = document.querySelector("#bias1label");
    bias1value = document.querySelector("#bias0");
    kValue1 = document.querySelector("#k0");
    rect1 = canvas1.getBoundingClientRect();
    canvas1.addEventListener(
      "mousedown",
      evt => {
        //console.log("Curve1 editing starting")
        let initKVal = this.amp.preamp.getDistorsionValue(0);
        let initBiasVal = this.amp.preamp.getBiasValue(0);
        let initMouseVal = ((evt.clientX - rect1.left) / 10).toFixed(1);
        flag1 = 1;

        document.addEventListener("mousemove", mouseMove1, false);
        document.addEventListener("mouseup", mouseUp1, false);

        function mouseMove1(evt) {
          if (flag1 > 0) {
            // Set bias or k value for starting newK.
            if (amp.preamp.distoTypes[0] == "bezier") {
              shift1 =
                ((evt.clientX - rect1.left) / 10).toFixed(1) - initMouseVal;
              newK1 = parseFloat(initBiasVal) + parseFloat(shift1);
            } else {
              shift1 =
                ((evt.clientX - rect1.left) / 10).toFixed(1) - initMouseVal;
              newK1 = parseFloat(initKVal) + parseFloat(shift1);
            }

            // Define newK
            if (newK1 < 0) {
              newK1 = 0;
            } else if (newK1 > 10) {
              newK1 = 10;
            }

            // Bezier or other curve
            if (amp.preamp.distoTypes[0] == "bezier") {
              var pos = evt.clientX - canvas1.offsetLeft - rect1.left;
              if (pos < 50) {
                //amp.preamp.changeBiasP2(Math.min(100,100-(pos*2)));
                //amp.preamp.changeBiasP1(0);
              } else {
                //amp.preamp.changeBiasP1(Math.min(100,(pos*2)-100));
                //amp.preamp.changeBiasP2(0);
              }

              amp.preamp.changeBiasPA(newK1, 0);
              ampCtrl.changeBezierValues(newK1, 0, 0);
              amp.preamp.highlightValues(bias1label, bias1value);
            } else {
              amp.preamp.highlightValues(label1, kValue1);
              ampCtrl.changeDistorsionValues(newK1, 0);
            }
          }
        }

        function mouseUp1() {
          //console.log("Curve1 editing finished")
          flag1 = 0;
          if (amp.preamp.distoTypes[0] == "bezier") {
            amp.preamp.hideValues(bias1label, bias1value);
          } else {
            amp.preamp.hideValues(label1, kValue1);
          }
          document.removeEventListener("mousemove", mouseMove1, false);
          document.removeEventListener("mouseup", mouseUp1, false);
        }
      },
      false
    );

    // Change distortion on mouse move in Canvas distoDrawer 2
    var canvas2,
      flag2,
      rect2,
      label2,
      kValue2,
      bias2label,
      bias2value,
      angle2,
      shift2,
      newK2;
    canvas2 = document.querySelector("#distoDrawerCanvas2");
    label2 = document.querySelector("#k2label");
    bias2label = document.querySelector("#bias2label");
    bias2value = document.querySelector("#bias1");
    kValue2 = document.querySelector("#k1");
    rect2 = canvas2.getBoundingClientRect();

    canvas2.addEventListener(
      "mousedown",
      evt => {
        //console.log("Curve2 editing starting")
        let initKVal = this.amp.preamp.getDistorsionValue(1);
        let initMouseVal = ((evt.clientX - rect2.left) / 10).toFixed(1);
        let initBiasVal = this.amp.preamp.getBiasValue(1);
        flag2 = 1;

        document.addEventListener("mousemove", mouseMove2, false);
        document.addEventListener("mouseup", mouseUp2, false);

        function mouseMove2(evt) {
          if (flag2 > 0) {
            // Set bias or k value for starting newK.
            if (amp.preamp.distoTypes[0] == "bezier") {
              shift2 =
                ((evt.clientX - rect2.left) / 10).toFixed(1) - initMouseVal;
              newK2 = parseFloat(initBiasVal) + parseFloat(shift2);
            } else {
              shift2 =
                ((evt.clientX - rect2.left) / 10).toFixed(1) - initMouseVal;
              newK2 = parseFloat(initKVal) + parseFloat(shift2);
            }

            // Define newK
            if (newK2 < 0) {
              newK2 = 0;
            } else if (newK2 > 10) {
              newK2 = 10;
            }

            // Bezier or other curve
            if (amp.preamp.distoTypes[1] == "bezier") {
              var pos = evt.clientX - canvas2.offsetLeft - rect2.left;
              if (pos < 50) {
                //amp.preamp.changeBiasP2(Math.min(100,100-(pos*2)));
                //amp.preamp.changeBiasP1(0);
              } else {
                //amp.preamp.changeBiasP1(Math.min(100,(pos*2)-100));
                //amp.preamp.changeBiasP2(0);
              }

              amp.preamp.changeBiasPA(newK2, 1);
              ampCtrl.changeBezierValues(newK2, 1, 0);
              amp.preamp.highlightValues(bias2label, bias2value);
            } else {
              amp.preamp.highlightValues(label2, kValue2);
              ampCtrl.changeDistorsionValues(newK2, 1);
            }
          }
        }

        function mouseUp2() {
          //console.log("Curve2 editing finished")
          flag2 = 0;
          if (amp.preamp.distoTypes[1] == "bezier") {
            amp.preamp.hideValues(bias2label, bias2value);
          } else {
            amp.preamp.hideValues(label2, kValue2);
          }
          document.removeEventListener("mousemove", mouseMove2, false);
          document.removeEventListener("mouseup", mouseUp2, false);
        }
      },
      false
    );
  }

  // Gains

  changePreampStage1GainValue(sliderVal) {
    this.amp.preamp.changePreampStage1GainValuePA(sliderVal);
    this.ampViewer.changePreampStage1GainValuePA(sliderVal);
  }

  changePreampStage2GainValue(sliderVal) {
    this.amp.preamp.changePreampStage2GainValuePA(sliderVal);
    this.ampViewer.changePreampStage2GainValuePA(sliderVal);
  }

  // Filters

  changeLowShelf1FrequencyValue(sliderVal) {
    this.amp.preamp.changeLowShelf1FrequencyValuePA(sliderVal);
    this.ampViewer.changeLowShelf1FrequencyValuePA(sliderVal);
  }

  changeLowShelf1GainValue(sliderVal) {
    this.amp.preamp.changeLowShelf1GainValuePA(sliderVal);
    this.ampViewer.changeLowShelf1GainValuePA(sliderVal);
  }

  changeLowShelf2FrequencyValue(sliderVal) {
    this.amp.preamp.changeLowShelf2FrequencyValuePA(sliderVal);
    this.ampViewer.changeLowShelf2FrequencyValuePA(sliderVal);
  }

  changeLowShelf2GainValue(sliderVal) {
    this.amp.preamp.changeLowShelf2GainValuePA(sliderVal);
    this.ampViewer.changeLowShelf2GainValuePA(sliderVal);
  }

  changeLowShelf3FrequencyValue(sliderVal) {
    this.amp.preamp.changeLowShelf3FrequencyValuePA(sliderVal);
    this.ampViewer.changeLowShelf3FrequencyValuePA(sliderVal);
  }

  changeLowShelf3GainValue(sliderVal) {
    this.amp.preamp.changeLowShelf3GainValuePA(sliderVal);
    this.ampViewer.changeLowShelf3GainValuePA(sliderVal);
  }

  changeHighPass1FrequencyValue(sliderVal) {
    this.amp.preamp.changeHighPass1FrequencyValuePA(sliderVal);
    this.ampViewer.changeHighPass1FrequencyValuePA(sliderVal);
  }

  changeHighPass1QValue(sliderVal) {
    this.amp.preamp.changeHighPass1QValuePA(sliderVal);
    this.ampViewer.changeHighPass1QValuePA(sliderVal);
  }

  //
  // Tonestack handlers
  //

  changeBassFilterValue(sliderVal) {
    this.amp.tonestack.changeBassFilterValueTS(sliderVal);
    this.ampViewer.changeBassFilterValueTS(sliderVal);
  }

  changeMidFilterValue(sliderVal) {
    this.amp.tonestack.changeMidFilterValueTS(sliderVal);
    this.ampViewer.changeMidFilterValueTS(sliderVal);
  }

  changeTrebleFilterValue(sliderVal) {
    this.amp.tonestack.changeTrebleFilterValueTS(sliderVal);
    this.ampViewer.changeTrebleFilterValueTS(sliderVal);
  }


  changeToneStackPresenceFilterValue(sliderVal) {
    this.amp.tonestack.changePresenceFilterValueTS(sliderVal);
    this.ampViewer.changePresenceFilterValueTS(sliderVal);
  }


  //
  // Power Amp handlers
  //

  toggleHiAndLoCutFilters() {
    this.amp.powerAmp.toggleHiAndLoCutFilters();
    this.ampViewer.changePowerAmpHiAndLoCutFiltersStatus(this.amp.powerAmp.getLoHiCutFilterStatus());
  }

  setHiAndLoCutFilters(enableFilters) {
    this.amp.powerAmp.setHiAndLoCutFilters(enableFilters);
    this.ampViewer.changePowerAmpHiAndLoCutFiltersStatus(this.amp.powerAmp.getLoHiCutFilterStatus());
  }
  

  changePresenceFilterGainValue(sliderVal) {
    if (!this.amp.powerAmp.isEnabled()) {
      this.changeToneStackPresenceFilterValue(sliderVal);
    } else {
      // use presence in power amp
      // set tonestack presence to neutral
      this.changeToneStackPresenceFilterValue(5);
      this.amp.powerAmp.changePresenceFilterGainValue(sliderVal);
      this.ampViewer.changePresenceFilterValueTS(sliderVal);
    }

  }

  changeBoostGainValue(sliderVal) {

    this.amp.powerAmp.changeBoostGainValue(sliderVal);
    this.ampViewer.changePowerAmpBoostGainValueTS(sliderVal);
  }
  //
  // Amp handlers
  //

  // volume aka preamp output volume
  changeOutputGain(sliderVal) {
    this.amp.changeOutputGainAmp(sliderVal);
    this.ampViewer.changeOutputGainAmp(sliderVal);
  }

  changeInputGain(sliderVal) {
    this.amp.changeInputGainAmp(sliderVal);
    this.ampViewer.changeInputGainAmp(sliderVal);
  }

  changeMasterVolume(sliderVal) {
    this.amp.changeMasterVolumeAmp(sliderVal);
    this.ampViewer.changeMasterVolumeAmp(sliderVal);
  }

  changeReverbGain(sliderVal) {
    this.amp.changeReverbGainAmp(sliderVal);
    this.ampViewer.changeReverbGainAmp(sliderVal);
  }

  changeRoom(sliderVal) {
    this.amp.changeRoomAmp(sliderVal);
    this.ampViewer.changeRoomAmp(sliderVal);
  }

  //
  // Preset handlers
  //

  setDefaultPreset() {
    this.setValuesFromPreset(this.presets[0]);
  }

  setPreset() {
    this.setValuesFromPreset(this.presets[this.ampViewer.menuPresets.value]);
  }

  setPresetByIndex(i) {
    this.setValuesFromPreset(this.presets[i]);
    this.ampViewer.menuPresets.selectedIndex = i;
  }

  getNbPresets() {
    return this.presets.length;
  }

  setValuesFromPreset(p) {
    if (p.distoName1 === undefined) {
      p.distoName1 = "standard";
    }

    if (p.distoName2 === undefined) {
      p.distoName2 = "standard";
    }

    if (p.boost === undefined) p.boost = false;
    this.changeBoost(p.boost);


    this.removePreampExtraStages();
    // Stage 1

    this.changeLowShelf1FrequencyValue(p.LS1Freq);
    this.changeLowShelf1GainValue(p.LS1Gain);
    this.changeLowShelf2FrequencyValue(p.LS2Freq);
    this.changeLowShelf2GainValue(p.LS2Gain);
    this.changePreampStage1GainValue(p.gain1);
    this.changeDisto1FromPreset(p.distoName1);
    this.changeDistorsionValues(p.K1, 0);

    // Stage 2

    //this.changeHighPass1FrequencyValue(p.HP1Freq)
    //this.changeHighPass1QValue(p.HP1Q)
    this.changeLowShelf3FrequencyValue(p.LS3Freq);
    this.changeLowShelf3GainValue(p.LS3Gain);
    this.changePreampStage2GainValue(p.gain2);
    this.changeDisto2FromPreset(p.distoName2);
    this.changeDistorsionValues(p.K2, 1);

    this.changeOutputGain(p.OG);

    this.changeBassFilterValue(p.BF);
    this.changeMidFilterValue(p.MF);
    this.changeTrebleFilterValue(p.TF);
    this.changeToneStackPresenceFilterValue(p.PF);

    this.changeMasterVolume(p.MV);

    this.changeReverbGain(p.RG);
    this.changeReverbImpulseFromPreset(p.RN);

    this.changeRoom(p.CG);
    this.changeCabinetImpulseFromPreset(p.CN);

    this.changeEQValues(p.EQ);


    // default is preamp before tonestack, we need to do this for presets without power amp
    this.setPATS(true);


    // Power amp

    // Switch PA on or off depending on preset
    if (p.PA_ENABLED !== undefined) {
      // we toggle is current status of power amp is different from preset
      if (this.amp.powerAmp.isEnabled() !== p.PA_ENABLED)
        this.togglePoweAmpBypass();
    } else {
      // this is the case of an "old preset" without Power Amp
      // If PA is on we switch it off
      if (this.amp.powerAmp.isEnabled())
        this.togglePoweAmpBypass();
    }

    if (p.PA_ENABLED === undefined) return; // old preset without Power Amp

    this.setPATS(p.PREAMP_BEFORE_TONESTACK); // Preamp before tonestack ?

    this.setHiAndLoCutFilters(p.PA_LO_HI_CUT_FILTERS_ENABLED);

    this.changePowerAmpDistoType(p.PA_DISTORSION_CURVE);
    this.changePowerAmpK(p.PA_K);
    this.changePowerAmpNegativeGainValue(p.PA_NEGATIVE_GAIN);
    this.changePowerAmpPresenceGainRangeValue(p.PA_PRESENCE_GAIN_RANGE);
    this.changeBoostGainValue(p.PA_BOOST_GAIN);
    this.setPowerAmpPresenceFilterParams(p.PA_PRESENCE_FILTERS_PARAMS);

    // If we are here, it means that presence is in the power amp,
    // so we set the presence located in the tonestack to a neutral value
    this.changeToneStackPresenceFilterValue(5); // ts presence
    this.changePresenceFilterGainValue(p.PF);   // PA presence

    // set preamp extra stages
    this.addPreampLampsFromPresetExtraStages(p.PREAMP_EXTRA_STAGES);

  }

  // Equalizer handlers

  changeEQValues(values) {
    values.forEach((val, index) => {
      this.changeGain(val, index);
    });
  }

  changeGain(sliderVal, numFilter) {
    this.amp.eq.changeGainEQ(sliderVal, numFilter);
    this.ampViewer.updateEQSlider(sliderVal, numFilter);
  }

  // Convolver handlers

  changeReverbImpulse(val) {
    this.amp.reverb.loadImpulseFromMenu(val);
  }

  changeReverbImpulseFromPreset(name) {
    if (name === undefined) {
      name = this.amp.reverb.IRs[0].name;
      console.log(
        "loadImpulseByName: name undefined, loading default impulse " + name
      );
    }

    let result = this.amp.reverb.getImpulseUrlAndIndex(name);

    if (result[0] === "none") {
      console.log("ERROR loading reverb impulse name = " + name);
    } else {
      console.log("loadImpulseByName loading " + name);
      this.amp.reverb.loadImpulseByUrl(result[0]);
      this.ampViewer.updateReverbName(result[1]);
    }
  }

  changeCabinetImpulse(val) {
    this.amp.cabinet.loadImpulseFromMenu(val);
  }

  changeCabinetImpulseFromPreset(name) {
    if (name === undefined) {
      name = this.amp.cabinet.IRs[0].name;
      console.log(
        "loadImpulseByName: name undefined, loading default impulse " + name
      );
    }

    let result = this.amp.cabinet.getImpulseUrlAndIndex(name);

    if (result[0] === "none") {
      console.log("ERROR loading cabinet impulse name = " + name);
    } else {
      console.log("loadImpulseByName loading " + name);
      this.amp.cabinet.loadImpulseByUrl(result[0]);
      this.ampViewer.updateCabinetName(result[1]);
    }
  }

  // Boost handler

  changeOversampling(cb) {
    this.amp.changeOversamplingAmp(cb);
  }

  boostOnOff(cb) {
    // called when we click the switch on the GUI
    this.amp.preamp.boost.toggle();
    this.amp.preamp.adjustOutputGainIfBoostActivated();
    this.ampViewer.updateBoostLedButtonState(
      this.amp.preamp.boost.isActivated()
    );
  }

  changeBoost(state) {
    if (this.amp.preamp.boost.isActivated() !== state) {
      // we need to adjust the output gain
      console.log("changeBoost: we change boost state");
      this.amp.preamp.boost.onOff(state);
      this.amp.preamp.adjustOutputGainIfBoostActivated();
      this.ampViewer.updateBoostLedButtonState(
        this.amp.preamp.boost.isActivated()
      );
    } else {
      console.log("changeBoost: we do not change boost state");
    }
    console.log(
      "changeBoost, boost after: " + this.amp.preamp.boost.isActivated()
    );
  }

  // Bypass handlers

  bypass(cb) {
    this.amp.bypassAmp(cb);
    this.ampViewer.bypassAmp(cb);
  }

  bypassEQ(cb) {
    this.amp.bypassEQAmp(cb);
    this.ampViewer.bypassEQAmp(cb);
  }

  //
  // Input handler
  //

  toggleGuitarInput(event) {
    if (!this.guitarPluggedIn) {
      guitarInput.connect(this.amp.input);
      this.changeOutputGainValue(5);
      this.ampViewer.setButton("ACTIVATED");
    } else {
      guitarInput.disconnect();
      this.ampViewer.setButton("NOT ACTIVATED");
    }
    this.guitarPluggedIn = !this.guitarPluggedIn;
  }

  changeDemoSample(val) {
    console.log(val);
    audioPlayer.src = demoSampleURLs[val];
    audioPlayer.play();
  }

  //
  // Other handlers
  //

  printCurrentAmpValues() {
    var currentPresetValue = {
      name: "current",

      boost: this.amp.preamp.boost.isActivated(),

      LS1Freq: this.amp.preamp.lowShelf1.frequency.value,
      LS1Gain: this.amp.preamp.lowShelf1.gain.value,
      LS2Freq: this.amp.preamp.lowShelf2.frequency.value,
      LS2Gain: this.amp.preamp.lowShelf2.gain.value,
      gain1: this.amp.preamp.preampStage1Gain.gain.value,
      distoName1: this.ampViewer.menuDisto1.value,
      K1: this.amp.preamp.getDistorsionValue(0),
      HP1Freq: this.amp.preamp.highPass1.frequency.value,
      HP1Q: this.amp.preamp.highPass1.Q.value,

      LS3Freq: this.amp.preamp.lowShelf3.frequency.value,
      LS3Gain: this.amp.preamp.lowShelf3.gain.value,
      gain2: this.amp.preamp.preampStage2Gain.gain.value,
      distoName2: this.ampViewer.menuDisto2.value,
      K2: this.amp.preamp.getDistorsionValue(1),

      OG: (this.amp.output.gain.value * 10).toFixed(1),
      BF: (this.amp.tonestack.bassFilter.gain.value / 7 + 10).toFixed(1), // bassFilter.gain.value = (value-5) * 3;
      MF: (this.amp.tonestack.midFilter.gain.value / 4 + 5).toFixed(1), // midFilter.gain.value = (value-5) * 2;
      TF: (this.amp.tonestack.trebleFilter.gain.value / 10 + 10).toFixed(1), // trebleFilter.gain.value = (value-5) * 5;
      PF: (this.amp.tonestack.presenceFilter.gain.value / 2 + 5).toFixed(1), // presenceFilter.gain.value = (value-5) * 2;
      EQ: this.amp.eq.getValues(),
      MV: map(this.amp.master.gain.value.toFixed(1), 0, 3, 0, 10),
      RN: this.amp.reverb.getName(),
      RG: (this.amp.reverb.getGain() * 10).toFixed(1),
      CN: this.amp.cabinet.getName(),
      CG: (this.amp.cabinet.getGain() * 10).toFixed(1),

      PREAMP_BEFORE_TONESTACK: this.amp.isPreampBeforeTonestack(),
      PREAMP_EXTRA_STAGES: this.amp.preamp.extraStages,

      PA_ENABLED: this.amp.powerAmp.isEnabled(),
      PA_LO_HI_CUT_FILTERS_ENABLED: this.amp.powerAmp.getLoHiCutFilterStatus(),
      PA_DISTORSION_CURVE: this.ampViewer.menuDisto4.value,
      PA_K: this.amp.powerAmp.getDistorsionValue(),
      PA_NEGATIVE_GAIN: this.amp.powerAmp.negativeGain.gain.value,
      PA_PRESENCE_GAIN_RANGE: this.amp.powerAmp.getPresenceGainRange(),
      PA_PRESENCE_FILTERS_PARAMS: this.amp.powerAmp.getPresenceFilterParams(),
      PA_BOOST_GAIN: this.amp.powerAmp.boostGain.gain.value
    };

    console.log(JSON.stringify(currentPresetValue));
  }

  changeInputGainValue(sliderVal) {
    this.amp.input.gain.value = parseFloat(sliderVal);
  }

  changeOutputGainValue(sliderVal) {
    this.amp.output.gain.value = parseFloat(sliderVal) / 10;
    //console.log("changeOutputGainValue value = " + output.gain.value);
  }

  // ------- Webpage related handlers -------

  controlsInfoDisplay() {
    this.ampViewer.changeInfoDisplay();
  }

  eqDisplay() {
    this.ampViewer.changeEqDisplay();
  }

  settingsDisplay() {
    this.ampViewer.changeSettingsDisplay();
  }

  // ------- Experimentation handlers -------

  switchPATS() {
    let preampBeforeTS = this.amp.isPreampBeforeTonestack();

    this.amp.changeTonestackAndPreampLocations(!preampBeforeTS);

    this.ampViewer.switchPATS(this.amp.isPreampBeforeTonestack());
  }

  setPATS(preampBefore) {
    // we switch only if previous state was not the one we want
    if (this.amp.isPreampBeforeTonestack() !== preampBefore) {
      this.amp.changeTonestackAndPreampLocations(preampBefore);
      this.ampViewer.switchPATS(this.amp.isPreampBeforeTonestack());
    }
  }

  addPreampLamps() {
    var type = document.querySelector("#distorsionMenu3");

    this.amp.preamp.addNewLamps(type.value, this.nbLampPairs);

    this.nbLampPairs++;

    this.ampViewer.updateLamps(this.nbLampPairs);
  }

  addPreampLampsFromPresetExtraStages(extraStages) {
    for(let i = 0; i < extraStages.length; i++) {
      let tube = extraStages[i];
      this.amp.preamp.addNewLamps(tube.type, this.nbLampPairs);
      this.amp.preamp.changeDistorsionValuesPA(tube.k, this.nbLampPairs);
      this.nbLampPairs++;
      this.ampViewer.updateLamps(this.nbLampPairs, tube.k);
    }
  }

  removePreampExtraStages() {
    while(this.nbLampPairs > 2) {
      this.removeLastLamp();
    }
  }
  changeExtraDistos(e) {
    // Finds the number of the slider
    var distoNum = e.target.id.match(/^\d+|\d+\b|\d+(?=\w)/g)[0];
    ampCtrl.changeDistorsionValues(e.target.value, parseFloat(distoNum) - 1);
  }

  removeLastLamp(e) {
    this.nbLampPairs--;

    this.amp.preamp.removeLastLamp(this.nbLampPairs);

    this.ampViewer.removeLastLamp(this.nbLampPairs);
  }
}