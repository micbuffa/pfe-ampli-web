class AmpController {

	constructor(amp, ampViewer) {
		this.amp = amp;
		this.ampViewer = ampViewer;
		this.guitarPluggedIn = false;
		this.presets = amp.presets;
	}

	//
	// Preamp handlers
	//

	// Distortions

    changeDistorsionValues(sliderValue, numDisto, point) {
		// update processing values
        this.amp.preamp.changeDistorsionValuesPA(sliderValue, numDisto, point);
        // update view
        this.ampViewer.changeDistoLabels(sliderValue, numDisto);
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

    changePresenceFilterValue(sliderVal) {
        this.amp.tonestack.changePresenceFilterValueTS(sliderVal);
        this.ampViewer.changePresenceFilterValueTS(sliderVal);
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
        this.changePresenceFilterValue(p.PF);

        this.changeMasterVolume(p.MV);

        this.changeReverbGain(p.RG);
        this.changeReverbImpulseFromPreset(p.RN);

        this.changeRoom(p.CG);
        this.changeCabinetImpulseFromPreset(p.CN);

        this.changeEQValues(p.EQ);
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
            console.log("loadImpulseByName: name undefined, loading default impulse " + name);
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
            console.log("loadImpulseByName: name undefined, loading default impulse " + name);
        }

        let result = this.amp.cabinet.getImpulseUrlAndIndex(name);

        if (result[0] === "none") {
            console.log("ERROR loading reverb impulse name = " + name);
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
        this.ampViewer.updateBoostLedButtonState(this.amp.preamp.boost.isActivated());
    }

    changeBoost(state) {

        if(this.amp.preamp.boost.isActivated() !== state) {
            // we need to adjust the output gain
            console.log("changeBoost: we change boost state");
            this.amp.preamp.boost.onOff(state);
            this.amp.preamp.adjustOutputGainIfBoostActivated();
            this.ampViewer.updateBoostLedButtonState(this.amp.preamp.boost.isActivated());
        } else {
            console.log("changeBoost: we do not change boost state");
        }
        console.log("changeBoost, boost after: " + this.amp.preamp.boost.isActivated());
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
	    if(!this.guitarPluggedIn) {
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