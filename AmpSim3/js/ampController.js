class AmpController {

	constructor(amp) {
		this.amp = amp;
		this.guitarPluggedIn = false;
	}

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

	printCurrentAmpValues() {
        var currentPresetValue = {
            name: 'current',
            
            boost: this.amp.preamp.boost.isActivated(),

            LS1Freq: this.amp.preamp.lowShelf1.frequency.value,
            LS1Gain: this.amp.preamp.lowShelf1.gain.value,
            LS2Freq: this.amp.preamp.lowShelf2.frequency.value,
            LS2Gain: this.amp.preamp.lowShelf2.gain.value,
            gain1: this.amp.preamp.preampStage1Gain.gain.value,
            distoName1 : this.amp.preamp.menuDisto1.value,
            K1: this.amp.preamp.getDistorsionValue(0),
            HP1Freq: this.amp.preamp.highPass1.frequency.value,
            HP1Q: this.amp.preamp.highPass1.Q.value,

            LS3Freq: this.amp.preamp.lowShelf3.frequency.value,
            LS3Gain: this.amp.preamp.lowShelf3.gain.value,
            gain2: this.amp.preamp.preampStage2Gain.gain.value,
            distoName2 : this.amp.preamp.menuDisto2.value,
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

	changeDemoSample(val) {
	    console.log(val);
	    audioPlayer.src = demoSampleURLs[val];
	    audioPlayer.play();
	}


}