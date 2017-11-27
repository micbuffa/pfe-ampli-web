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