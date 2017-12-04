class AmpViewer {

	constructor(amp, ampName) {
		this.amp = amp;
		this.ampName = ampName;
        // Distortion menus
        this.menuDisto1 = document.querySelector("#distorsionMenu1");
        this.menuDisto2 = document.querySelector("#distorsionMenu2");
        this.menuPresets = document.querySelector("#QFPresetMenu2");
        this.menuReverb = document.querySelector("#reverbImpulses");
        this.menuCabinet = document.querySelector("#cabinetImpulses");
        this.controlsInfoBtn = document.querySelector("#controlsInfoBtn")
        this.controlsInfo = document.querySelector("#controlsInfo");
	}

	// ------- Amp related handlers -------

	// 
	// View modifications
	//

	// View change for distortions

    changeDistoLabels(sliderValue, numDisto) {
        // update output labels
        var output = document.querySelector("#k" + numDisto);
        output.value = parseFloat(sliderValue).toFixed(1);

        // update sliders
        var numSlider = numDisto + 1;
        var slider = document.querySelector("#K" + numSlider + "slider");
        slider.value = parseFloat(sliderValue).toFixed(1);

        var knob = document.querySelector("#Knob3");
        knob.setValue(this.amp.preamp.currentK, false);
    }

    // View change for preamp gains

    changePreampStage1GainValuePA(sliderVal) {
        // update output labels
        var output = document.querySelector("#preampStage1Gain");
        output.value = parseFloat(sliderVal).toFixed(2);

        // refresh slider state
        var slider = document.querySelector("#preampStage1GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(2);
    }

    changePreampStage2GainValuePA(sliderVal) {
        // update output labels
        var output = document.querySelector("#preampStage2Gain");
        output.value = parseFloat(sliderVal).toFixed(2);

        // refresh slider state
        var slider = document.querySelector("#preampStage2GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(2);
    }

    // View change for preamp filters

	changeLowShelf1FrequencyValuePA(sliderVal) {
        // update output labels
        var output = document.querySelector("#lowShelf1Freq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#lowShelf1FreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf1GainValuePA(sliderVal) {
        // update output labels
        var output = document.querySelector("#lowShelf1Gain");
        output.value = parseFloat(sliderVal).toFixed(1) + " dB";

        // refresh slider state
        var slider = document.querySelector("#lowShelf1GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf2FrequencyValuePA(sliderVal) {
        // update output labels
        var output = document.querySelector("#lowShelf2Freq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#lowShelf2FreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf2GainValuePA(sliderVal) {
        // update output labels
        var output = document.querySelector("#lowShelf2Gain");
        output.value = parseFloat(sliderVal).toFixed(1) + " dB";

        // refresh slider state
        var slider = document.querySelector("#lowShelf2GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf3FrequencyValuePA(sliderVal) {
        // update output labels
        var output = document.querySelector("#lowShelf3Freq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#lowShelf3FreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf3GainValuePA(sliderVal) {
        // update output labels
        var output = document.querySelector("#lowShelf3Gain");
        output.value = parseFloat(sliderVal).toFixed(1) + " dB";

        // refresh slider state
        var slider = document.querySelector("#lowShelf3GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeHighPass1FrequencyValuePA(sliderVal) {
        // update output labels
        var output = document.querySelector("#highPass1Freq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#highPass1FreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeHighPass1QValuePA(sliderVal) {
        // update output labels
        var output = document.querySelector("#highPass1Q");
        output.value = parseFloat(sliderVal).toFixed(4);

        // refresh slider state
        var slider = document.querySelector("#highPass1QSlider");
        slider.value = parseFloat(sliderVal).toFixed(4);
    }

    // View change for tonestack

	changeBassFilterValueTS(sliderVal) {
		// refresh knob state
        var knob = document.querySelector("#Knob4");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeMidFilterValueTS(sliderVal) {
    	// refresh knob state
        var knob = document.querySelector("#Knob5");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeTrebleFilterValueTS(sliderVal) {
    	// refresh knob state
        var knob = document.querySelector("#Knob6");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changePresenceFilterValueTS(sliderVal) {
    	// refresh knob state
        var knob = document.querySelector("#Knob8");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    // View change for amp

	changeOutputGainAmp(sliderVal) {
        // refresh knob state
        var knob = document.querySelector("#Knob1");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeInputGainAmp(sliderVal) {
        // refresh knob state
        var knob = document.querySelector("#Knob1");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeMasterVolumeAmp(sliderVal) {
        // refresh knob state
        var knob = document.querySelector("#Knob2");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeReverbGainAmp(sliderVal) {
        // refresh knob state
        var knob = document.querySelector("#Knob7");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeRoomAmp(sliderVal) {
        // update output labels
        var output = document.querySelector("#cabinetGainOutput");
        output.value = parseFloat(sliderVal).toFixed(1);

        // refresh slider state
        var slider = document.querySelector("#convolverCabinetSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    // View changes for equalizer

    updateEQSlider(sliderVal, nbFilter) {
		// refresh amp slider state in the web component GUI
        var sliderWC = document.querySelector("#slider" + (nbFilter+1));
        // second parameter set to false will not fire an event
        sliderWC.setValue(parseFloat(sliderVal).toFixed(0), false);
    }

    // View changes for boost

    updateBoostLedButtonState(activated) {
        // update buttons states
        var boostSwitch = document.querySelector("#toggleBoost");

        if(this.amp.preamp.boost.isActivated()) {
            boostSwitch.setValue(1,false);
        } else {
            boostSwitch.setValue(0,false);
        }
    }

    // View changes for bypass

    bypassAmp(cb) {
        // update buttons states
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

    bypassEQAmp(cb) {
        // update buttons states
        var led = document.querySelector("#led");

        //onOffButton.checked = cb.checked;
        var eqOnOffSwitch = document.querySelector("#switch2");
        if(cb.checked) {
            eqOnOffSwitch.setValue(0,false);
        } else {
            eqOnOffSwitch.setValue(1,false);
        }
    }

    // View changes for guitar input

    setButton(status) {
	    var button = document.querySelector("#toggleGuitarIn");

    	if (status == "ACTIVATED") {
	        button.innerHTML = "Guitar input: <span style='color:green;'>ACTIVATED</span>, click to toggle on/off!";
	        button.classList.remove("pulse");
    	} else if (status == "NOT ACTIVATED"){
	        button.innerHTML = "Guitar input: <span style='color:red;'>NOT ACTIVATED</span>, click to toggle on/off!";
	        button.classList.add("pulse");
    	}
    }

	//
	// Display preset menu
	//

	createPresetMenu() {
        this.amp.presets.forEach((p, index) => {
            var option = document.createElement("option");
            option.value = index;
            option.text = p.name;
            this.menuPresets.appendChild(option);
        });
	}

	//
    // Display convolver menus
    //

    createIRMenus() {
    	this.buildMenuReverb();
    	this.buildMenuCabinet();
    }

    buildMenuReverb(type) {
	    this.amp.reverb.IRs.forEach((impulse, index) => {
            var option = document.createElement("option");
            option.value = index;
            option.text = impulse.name;
            this.menuReverb.appendChild(option);
        });
    }

    buildMenuCabinet(type) {
        this.amp.cabinet.IRs.forEach((impulse, index) => {
            var option = document.createElement("option");
            option.value = index;
            option.text = impulse.name;
            this.menuCabinet.appendChild(option);
        });
    }

    updateReverbName(index) {
    	this.menuReverb.selectedIndex = index;
    }

    updateCabinetName(index) {
    	this.menuCabinet.selectedIndex = index;
    }

	//
	// Display disto menus
	//

	createDistoMenus() {
		this.buildDistoMenu1();
    	this.buildDistoMenu2();
	}

    // Build a drop down menu with all distorsion names
    buildDistoMenu1() {
        for(var p in this.amp.preamp.wsFactory.distorsionCurves) {
            var option = document.createElement("option");
            option.value = p;
            option.text = p;
            this.menuDisto1.appendChild(option);    
        }
    }

    // Build a drop down menu with all distorsion names
    buildDistoMenu2() {
        for(var p in this.amp.preamp.wsFactory.distorsionCurves) {
            var option = document.createElement("option");
            option.value = p;
            option.text = p;
            this.menuDisto2.appendChild(option);    
        }
    }

    updateDisto1Name(name) {
    	this.menuDisto1.value = name;
    }

    updateDisto2Name(name) {
    	this.menuDisto2.value = name;
    }

    //
    // Display live sound signal I/O
    //

    initCurveVisualisations() {
        // Signal visualisation
		var inputVisualization = new Visualization();
		var outputVisualization = new Visualization();

	    inputVisualization.configure("inputSignalCanvas", analyzerAtInput);
	    outputVisualization.configure("outputSignalCanvas", analyzerAtOutput);

	    // start updating the visualizations
	    requestAnimationFrame(visualize);

	    function visualize() {
		    inputVisualization.update();
		    outputVisualization.update();

		    requestAnimationFrame(visualize);
		}
	}

	// ------- Webpage related handlers -------

	changeInfoDisplay() {
		if (this.controlsInfo.style.display == "none") {
			this.controlsInfo.setAttribute('style', 'display:block;');
			window.scrollTo(0, document.body.scrollHeight);
			this.controlsInfoBtn.innerHTML = "Hide Controls"
		} else {
			this.controlsInfo.setAttribute('style', 'display:none;');
			this.controlsInfoBtn.innerHTML = "Display Controls"
		}

	}

}