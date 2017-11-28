class ToneStack {

	constructor(model, context) {
		// Model not used here but can be used to adjust
		// the values according to model/brand
		this.model = model;
		this.context = context;
		this.bassFilter = undefined;
		this.midFilter = undefined;
		this.trebleFilter = undefined;
		this.presenceFilter = undefined;
	}

	createFilter(type) {
		switch (type) {
			case "bass" :
				this.bassFilter = this.context.createBiquadFilter();
			    this.bassFilter.frequency.value = 100;
			    this.bassFilter.type = "lowshelf";
			    this.bassFilter.Q.value = 0.7071;
				break;
			case "mid" :
			    this.midFilter = this.context.createBiquadFilter();
			    this.midFilter.frequency.value = 1700;
			    this.midFilter.type = "peaking";
			    this.midFilter.Q.value = 0.7071;
				break;
			case "treble" :
				this.trebleFilter = this.context.createBiquadFilter();
				this.trebleFilter.frequency.value = 6500;
				this.trebleFilter.type = "highshelf";
				this.trebleFilter.Q.value = 0.7071; // To check with Lepou
				break;
			case "presence" :
			    this.presenceFilter = this.context.createBiquadFilter();
			    this.presenceFilter.frequency.value = 3900;
			    this.presenceFilter.type = "peaking";
			    this.presenceFilter.Q.value = 0.7071;
				break;
		}

	}

    changeBassFilterValueTS(sliderVal) {
        // sliderVal is in [0, 10]
        var value = parseFloat(sliderVal);
        this.bassFilter.gain.value = (value-10) * 7;
        //console.log("bass gain set to " + this.bassFilter.gain.value);
    }

    changeMidFilterValueTS(sliderVal) {
        // sliderVal is in [0, 10]
        var value = parseFloat(sliderVal);
        this.midFilter.gain.value = (value-5) * 4;
    }

    changeTrebleFilterValueTS(sliderVal) {
        // sliderVal is in [0, 10]
        var value = parseFloat(sliderVal);
        this.trebleFilter.gain.value = (value-10) * 10;
    }

    changePresenceFilterValueTS(sliderVal) {
        // sliderVal is in [0, 10]
        var value = parseFloat(sliderVal);
        this.presenceFilter.gain.value = (value-5) * 2;
    }

}