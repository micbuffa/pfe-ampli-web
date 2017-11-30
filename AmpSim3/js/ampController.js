class AmpController {

	constructor(amp, ampViewer) {
		this.amp = amp;
		this.ampViewer = ampViewer;
		this.guitarPluggedIn = false;
		this.menuPresets = document.querySelector("#QFPresetMenu2");
		this.presets = amp.presets;
	}

	//
	// Preamp handlers
	//

	// Distortions

    changeDrive(sliderValue) {
      // sliderValue in [0,10]
      // We can imagine having some "profiles here" -> generate
      // different K values from one single sliderValue for the
      // drive.
      // other values i.e [0.5, 0.5, 0.8, 1] -> less distorsion
      // on bass frequencies and top high frequency
      
      for(var i = 0; i < 2; i++) {
            this.changeDistorsionValues(sliderValue, i);
      }
    }

    changeDistorsionValues(sliderValue, numDisto, point) {
        // update model values
        this.amp.preamp.changeDistorsionValuesPA(sliderValue, numDisto, point);
        
        this.changeDistoLabels(sliderValue, numDisto);
    }

    changeDistoLabels(sliderValue, numDisto) {
        // update output labels
        var output = document.querySelector("#k" + numDisto);
        output.value = parseFloat(sliderValue).toFixed(1);

        // update sliders
        var numSlider = numDisto + 1;
        var slider = document.querySelector("#K" + numSlider + "slider");
        slider.value = parseFloat(sliderValue).toFixed(1);

        // refresh knob state
        var knob = document.querySelector("#Knob3");
        var maxPosVal1 = Math.max(logToPos(this.amp.preamp.k[2]), logToPos(this.amp.preamp.k[3]));
        var maxPosVal2 = Math.max(logToPos(this.amp.preamp.k[0]), logToPos(this.amp.preamp.k[1]));
        var maxPosVal = Math.max(maxPosVal1, maxPosVal2);
        //var maxPosVal = Math.max(logToPos(k[2]), logToPos(k[3]));
        var linearValue = parseFloat(maxPosVal).toFixed(1);
        knob.setValue(linearValue, false);

        // in [0, 10]
        this.amp.preamp.currentK = linearValue;
    }

    changeDisto1Type(sliderVal) {
        this.amp.preamp.changeDisto1TypePA(sliderVal);
        this.changeDrive(this.amp.preamp.currentK);
    }

    changeDisto2Type(sliderVal) {
        this.amp.preamp.changeDisto2TypePA(sliderVal);
        this.changeDrive(this.amp.preamp.currentK);
    }

	// Gains

    changePreampStage1GainValue(sliderVal) {
        // set gain value
        this.amp.preamp.changePreampStage1GainValuePA(sliderVal);

        // update output labels
        var output = document.querySelector("#preampStage1Gain");
        output.value = parseFloat(sliderVal).toFixed(2);

        // refresh slider state
        var slider = document.querySelector("#preampStage1GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(2);
    }

    changePreampStage2GainValue(sliderVal) {
        // set gain value
        this.amp.preamp.changePreampStage2GainValuePA(sliderVal);

        // update output labels
        var output = document.querySelector("#preampStage2Gain");
        output.value = parseFloat(sliderVal).toFixed(2);

        // refresh slider state
        var slider = document.querySelector("#preampStage2GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(2);
    }

	// Filters

	changeLowShelf1FrequencyValue(sliderVal) {
        // set filter value
        this.amp.preamp.changeLowShelf1FrequencyValuePA(sliderVal);

        // update output labels
        var output = document.querySelector("#lowShelf1Freq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#lowShelf1FreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf1GainValue(sliderVal) {
        // set filter value
        this.amp.preamp.changeLowShelf1GainValuePA(sliderVal);

        // update output labels
        var output = document.querySelector("#lowShelf1Gain");
        output.value = parseFloat(sliderVal).toFixed(1) + " dB";

        // refresh slider state
        var slider = document.querySelector("#lowShelf1GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf2FrequencyValue(sliderVal) {
        // set filter value
        this.amp.preamp.changeLowShelf2FrequencyValuePA(sliderVal);

        // update output labels
        var output = document.querySelector("#lowShelf2Freq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#lowShelf2FreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf2GainValue(sliderVal) {
        // set filter value
        this.amp.preamp.changeLowShelf2GainValuePA(sliderVal);

        // update output labels
        var output = document.querySelector("#lowShelf2Gain");
        output.value = parseFloat(sliderVal).toFixed(1) + " dB";

        // refresh slider state
        var slider = document.querySelector("#lowShelf2GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf3FrequencyValue(sliderVal) {
        // set filter value
        this.amp.preamp.changeLowShelf3FrequencyValuePA(sliderVal);

        // update output labels
        var output = document.querySelector("#lowShelf3Freq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#lowShelf3FreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf3GainValue(sliderVal) {
        // set filter value
        this.amp.preamp.changeLowShelf3GainValuePA(sliderVal);

        // update output labels
        var output = document.querySelector("#lowShelf3Gain");
        output.value = parseFloat(sliderVal).toFixed(1) + " dB";

        // refresh slider state
        var slider = document.querySelector("#lowShelf3GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeHighPass1FrequencyValue(sliderVal) {
		// set filter value
        this.amp.preamp.changeHighPass1FrequencyValuePA(sliderVal);

        // update output labels
        var output = document.querySelector("#highPass1Freq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#highPass1FreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeHighPass1QValue(sliderVal) {
		// set filter value
        this.amp.preamp.changeHighPass1QValuePA(sliderVal);

        // update output labels
        var output = document.querySelector("#highPass1Q");
        output.value = parseFloat(sliderVal).toFixed(4);

        // refresh slider state
        var slider = document.querySelector("#highPass1QSlider");
        slider.value = parseFloat(sliderVal).toFixed(4);
    }

	//
	// Tonestack handlers
	//

	changeBassFilterValue(sliderVal) {
		// set filter value
        this.amp.tonestack.changeBassFilterValueTS(sliderVal);

        // refresh knob state
        var knob = document.querySelector("#Knob4");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeMidFilterValue(sliderVal) {
        // set filter value
        this.amp.tonestack.changeMidFilterValueTS(sliderVal);

        // refresh knob state
        var knob = document.querySelector("#Knob5");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeTrebleFilterValue(sliderVal) {
      	// set filter value
        this.amp.tonestack.changeTrebleFilterValueTS(sliderVal);

        // refresh knob state
        var knob = document.querySelector("#Knob6");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changePresenceFilterValue(sliderVal) {
      	// set filter value
        this.amp.tonestack.changePresenceFilterValueTS(sliderVal);

        // refresh knob state
        var knob = document.querySelector("#Knob8");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    //
    // Amp handlers
    //

    // volume aka preamp output volume
	changeOutputGain(sliderVal) {
        // set gain value
        this.amp.changeOutputGainAmp(sliderVal);

        // refresh knob state
        var knob = document.querySelector("#Knob1");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeInputGain(sliderVal) {
        // set gain value
        this.amp.changeInputGainAmp(sliderVal);

        // refresh knob state
        var knob = document.querySelector("#Knob1");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeMasterVolume(sliderVal) {
        // set gain value
        this.amp.changeMasterVolumeAmp(sliderVal);
        
        // refresh knob state
        var knob = document.querySelector("#Knob2");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeReverbGain(sliderVal) {
        // set gain value
        this.amp.changeReverbGainAmp(sliderVal);

        // refresh knob state
        var knob = document.querySelector("#Knob7");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeRoom(sliderVal) {
        // set room value
        this.amp.changeRoomAmp(sliderVal);

        // update output labels
        var output = document.querySelector("#cabinetGainOutput");
        output.value = parseFloat(sliderVal).toFixed(1);

        // refresh slider state
        var slider = document.querySelector("#convolverCabinetSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    //
    // Preset handlers
    //

    setDefaultPreset() {
		this.setValuesFromPreset(this.presets[0]);
	}

	setPreset() {
		this.setValuesFromPreset(this.presets[this.menuPresets.value]);
	}

	setValuesFromPreset(p) {
        if (p.distoName1 === undefined) {
            p.distoName1 = "standard";
        }

	    if (p.distoName2 === undefined) {
            p.distoName2 = "standard";
        }

        if(p.boost === undefined) p.boost = false;
        this.changeBoost(p.boost);

        // Stage 1

        this.changeLowShelf1FrequencyValue(p.LS1Freq);
        this.changeLowShelf1GainValue(p.LS1Gain);
        this.changeLowShelf2FrequencyValue(p.LS2Freq);
        this.changeLowShelf2GainValue(p.LS2Gain);
        this.changePreampStage1GainValue(p.gain1);
        this.amp.preamp.changeDisto1TypeFromPreset(p.distoName1);
        this.ampViewer.updateDisto1Name(p.distoName1);
        this.changeDistorsionValues(p.K1, 0);

        // Stage 2

        //this.changeHighPass1FrequencyValue(p.HP1Freq)
        //this.changeHighPass1QValue(p.HP1Q)
        this.changeLowShelf3FrequencyValue(p.LS3Freq);
        this.changeLowShelf3GainValue(p.LS3Gain);
        this.changePreampStage2GainValue(p.gain2);
        this.amp.preamp.changeDisto2TypeFromPreset(p.distoName2);
        this.ampViewer.updateDisto2Name(p.distoName2);
        this.changeDistorsionValues(p.K2, 1);

        this.changeOutputGain(p.OG);

        this.changeBassFilterValue(p.BF);
        this.changeMidFilterValue(p.MF);
        this.changeTrebleFilterValue(p.TF);
        this.changePresenceFilterValue(p.PF);

        this.changeMasterVolume(p.MV);

        this.changeReverbGain(p.RG);
        this.amp.changeReverbImpulse(p.RN);

        this.changeRoom(p.CG);
        this.amp.changeCabinetSimImpulse(p.CN);

        this.changeEQValues(p.EQ);
	}

	// Equalizer handlers

    changeEQValues(values) {
        values.forEach((val, index) => {
            this.changeGain(val, index);
        });
    }

	changeGain(sliderVal, numFilter) {
        // set eq value
        this.amp.eq.changeGainEQ(sliderVal, numFilter);

        this.updateEQSlider(sliderVal, numFilter);        
    }

    updateEQSlider(sliderVal, nbFilter) {
		// refresh amp slider state in the web component GUI
        var sliderWC = document.querySelector("#slider" + (nbFilter+1));
        // second parameter set to false will not fire an event
        sliderWC.setValue(parseFloat(sliderVal).toFixed(0), false);
    }

	// Boost handler

   	changeOversampling(cb) {
    	this.amp.changeOversamplingAmp(cb);
    }

    boostOnOff(cb) {  
        // called when we click the switch on the GUI      
        this.amp.preamp.boost.toggle();

        this.amp.preamp.adjustOutputGainIfBoostActivated();
        this.updateBoostLedButtonState(this.amp.preamp.boost.isActivated());
    }

    changeBoost(state) {

        if(this.amp.preamp.boost.isActivated() !== state) {
            // we need to adjust the output gain
            console.log("changeBoost: we change boost state");
            this.amp.preamp.boost.onOff(state);
            this.amp.preamp.adjustOutputGainIfBoostActivated();
            this.updateBoostLedButtonState(this.amp.preamp.boost.isActivated());
        } else {
            console.log("changeBoost: we do not change boost state");
        }

        console.log("changeBoost, boost after: " + this.amp.preamp.boost.isActivated());
    }

    updateBoostLedButtonState(activated) {
        // update buttons states
        var boostSwitch = document.querySelector("#toggleBoost");

        if(this.amp.preamp.boost.isActivated()) {
            boostSwitch.setValue(1,false);
        } else {
            boostSwitch.setValue(0,false);
        }
    }

    // Bypass handlers

    bypass(cb) {
        this.amp.bypassAmp(cb);

        // update buttons states
        //var onOffButton = document.querySelector("#myonoffswitch");
        var led = document.querySelector("#led");

        //onOffButton.checked = cb.checked;
        var onOffSwitch = document.querySelector("#switch1");
        if(cb.checked) {
            onOffSwitch.setValue(0,false);
            led.setValue(1, false);
        } else {
            onOffSwitch.setValue(1,false);
            led.setValue(0, false);
        }
    }

    bypassEQ(cb) {
    	this.amp.bypassEQAmp(cb);

        // update buttons states
        //var onOffButton = document.querySelector("#myonoffswitch");
        var led = document.querySelector("#led");

        //onOffButton.checked = cb.checked;
        var eqOnOffSwitch = document.querySelector("#switch2");
        if(cb.checked) {
            eqOnOffSwitch.setValue(0,false);
        } else {
            eqOnOffSwitch.setValue(1,false);
        }
    }

	//
	// Input handler
	//

	toggleGuitarInput(event) {
	    var button = document.querySelector("#toggleGuitarIn");

	    if(!this.guitarPluggedIn) {
	        guitarInput.connect(this.amp.input);
	        button.innerHTML = "Guitar input: <span style='color:green;'>ACTIVATED</span>, click to toggle on/off!";
	        button.classList.remove("pulse");
	        this.changeOutputGainValue(5);
	    } else {
	        guitarInput.disconnect();
	        button.innerHTML = "Guitar input: <span style='color:red;'>NOT ACTIVATED</span>, click to toggle on/off!";
	        button.classList.add("pulse");
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
            name: 'current',
            
            boost: this.amp.preamp.boost.isActivated(),

            LS1Freq: this.amp.preamp.lowShelf1.frequency.value,
            LS1Gain: this.amp.preamp.lowShelf1.gain.value,
            LS2Freq: this.amp.preamp.lowShelf2.frequency.value,
            LS2Gain: this.amp.preamp.lowShelf2.gain.value,
            gain1: this.amp.preamp.preampStage1Gain.gain.value,
            distoName1 : this.ampViewer.menuDisto1.value,
            K1: this.amp.preamp.getDistorsionValue(0),
            HP1Freq: this.amp.preamp.highPass1.frequency.value,
            HP1Q: this.amp.preamp.highPass1.Q.value,

            LS3Freq: this.amp.preamp.lowShelf3.frequency.value,
            LS3Gain: this.amp.preamp.lowShelf3.gain.value,
            gain2: this.amp.preamp.preampStage2Gain.gain.value,
            distoName2 : this.ampViewer.menuDisto2.value,
            K2: this.amp.preamp.getDistorsionValue(1),

            OG: (this.amp.output.gain.value*10).toFixed(1),
            BF: ((this.amp.tonestack.bassFilter.gain.value / 7) + 10).toFixed(1), // bassFilter.gain.value = (value-5) * 3;
            MF: ((this.amp.tonestack.midFilter.gain.value / 4) + 5).toFixed(1), // midFilter.gain.value = (value-5) * 2;
            TF: ((this.amp.tonestack.trebleFilter.gain.value / 10) + 10).toFixed(1), // trebleFilter.gain.value = (value-5) * 5;
            PF: ((this.amp.tonestack.presenceFilter.gain.value / 2) + 5).toFixed(1), // presenceFilter.gain.value = (value-5) * 2;
            EQ: this.amp.eq.getValues(),
            MV: this.amp.master.gain.value.toFixed(1),
            RN: this.amp.reverb.getName(),
            RG: (this.amp.reverb.getGain()*10).toFixed(1),
            CN: this.amp.cabinet.getName(),
            CG: (this.amp.cabinet.getGain()*10).toFixed(1)
       };

       console.log(JSON.stringify(currentPresetValue));
    }

	changeInputGainValue(sliderVal) {
        this.amp.input.gain.value = parseFloat(sliderVal);
    }

    changeOutputGainValue(sliderVal) {
        this.amp.output.gain.value = parseFloat(sliderVal)/10;
        //console.log("changeOutputGainValue value = " + output.gain.value);
    }

}