class PreAmp {

	constructor(model, context) {
		// Model not used here but can be used to adjust
		// the values according to model/brand
		this.model = model;
		this.context = context;
        // Channel booster
        this.boost = new Boost(context);
        // Distortion menus
        this.menuDisto1 = document.querySelector("#distorsionMenu1");
        this.menuDisto2 = document.querySelector("#distorsionMenu2");
        // To handle distortion
        this.DRAWER_CANVAS_SIZE = 100;
        this.distoDrawer1 = new CurveDrawer("distoDrawerCanvas1");
        this.signalDrawer1 = new CurveDrawer("signalDrawerCanvas1");
        this.distoDrawer2 = new CurveDrawer("distoDrawerCanvas2");
        this.signalDrawer2 = new CurveDrawer("signalDrawerCanvas2");
        this.wsFactory = new WaveShapers();
        this.currentDistoName = "standard";
        this.currentK = 2; // global K, max of the other two
        this.currentWSCurve = this.wsFactory.distorsionCurves[this.currentDistoName](this.currentK);
        this.k = [2, 2, 2, 2]; // array of k initial values
        this.od = [];
        this.distoTypes = ['asymetric', 'standard'];
        // To handle gains
        this.preampStage1Gain = this.context.createGain();
        this.preampStage2Gain = this.context.createGain();
        // To handle filters
        this.lowShelf1 = this.context.createBiquadFilter();
        this.lowShelf2 = this.context.createBiquadFilter();
        this.lowShelf3 = this.context.createBiquadFilter();
        this.highPass1 = this.context.createBiquadFilter();        
		
	}

    createDisto(type) {
        switch (type) {
            case "disto1" :
                // Distorsion 1, here we should use an asymetric function in order to 
                // generate odd harmonics
                this.od[0] = this.context.createWaveShaper();
                this.od[0].curve = this.wsFactory.distorsionCurves[this.distoTypes[0]](0);
                this.menuDisto1.value = this.distoTypes[0];
                break;
            case "disto2" :
                // Distorsion 2, symetric function to generate even harmonics
                this.od[1] = this.context.createWaveShaper();
                this.od[1].curve = this.wsFactory.distorsionCurves[this.distoTypes[1]](0);
                this.menuDisto2.value = this.distoTypes[1];
                break;
        }

    }

    createGain(type) {
        switch (type) {
            case "stage1" :
                this.preampStage1Gain.gain.value = 1.0;
                break;
            case "stage2" :
                this.preampStage2Gain.gain.value = 1.0;
                break;
        }

    }

    createFilter(type) {
        switch (type) {
            case "lowshelf1" :
                // Low shelf cut -6db at 720Hz
                this.lowShelf1.type = "lowshelf";
                this.lowShelf1.frequency.value = 720;
                this.lowShelf1.gain.value = -6;
                break;
            case "lowshelf2" :
                // Low shelf cut variable wired to volume knob
                // if vol = 50%, then filter at -6db, 320Hz
                // shoud go from -4db to -6db for +/- fatness
                this.lowShelf2.type = "lowshelf";    
                this.lowShelf2.frequency.value = 320;
                this.lowShelf2.gain.value = -5;
                break;
            case "lowshelf3" :
                // lowshelf cut -6db 720Hz
                this.lowShelf3.type = "lowshelf";    
                this.lowShelf3.frequency.value = 720;
                this.lowShelf3.gain.value = -6;
                break;
            case "highpass1" :
                // HighPass at 7-8 Hz, rectify the signal that got a DC value due
                // to the possible asymetric transfer function
                this.highPass1.type = "highpass";    
                this.highPass1.frequency.value = 6;
                this.highPass1.Q.value = 0.7071;
                break;
        }

    }

    //
    // Distortion-related functions
    //

    changeDistorsionValues(sliderValue, numDisto) {
        // sliderValue is in [0, 10] range, adjust to [0, 1500] range  
        var value = 150 * parseFloat(sliderValue);
        var minp = 0;
        var maxp = 1500;

        // The result should be between 10 an 1500
        var minv = Math.log(10);
        var maxv = Math.log(1500);

        // calculate adjustment factor
        var scale = (maxv - minv) / (maxp - minp);

        value = Math.exp(minv + scale * (value - minp));
        // end of logarithmic adjustment

        this.k[numDisto] = value;
        //console.log("k = " + value + " pos = " + logToPos(value));
        //console.log("distoTypes = " + distoTypes[numDisto]);
        this.od[numDisto].curve = this.wsFactory.distorsionCurves[this.distoTypes[numDisto]](this.k[numDisto]); //makeDistortionCurve(k[numDisto]);
        this.currentWSCurve = this.od[numDisto].curve;
        //od[numDisto].curve = makeDistortionCurve(sliderValue);
        //makeDistortionCurve(k[numDisto]);
        //od[numDisto].curve = makeDistortionCurve(sliderValue);
        // update output labels
        var output = document.querySelector("#k" + numDisto);
        output.value = parseFloat(sliderValue).toFixed(1);

        // update sliders
        var numSlider = numDisto + 1;
        var slider = document.querySelector("#K" + numSlider + "slider");
        slider.value = parseFloat(sliderValue).toFixed(1);

        // refresh knob state
        var knob = document.querySelector("#Knob3");
        var maxPosVal1 = Math.max(this.logToPos(this.k[2]), this.logToPos(this.k[3]));
        var maxPosVal2 = Math.max(this.logToPos(this.k[0]), this.logToPos(this.k[1]));
        var maxPosVal = Math.max(maxPosVal1, maxPosVal2);
        //var maxPosVal = Math.max(logToPos(k[2]), logToPos(k[3]));
        var linearValue = parseFloat(maxPosVal).toFixed(1);
        knob.setValue(linearValue, false);
        // in [0, 10]
        this.currentK = linearValue;
        // redraw curves
        this.drawCurrentDistos();
    }

    logToPos(logValue) {
        var minp = 0;
        var maxp = 1500;

        // The result should be between 10 an 1500
        var minv = Math.log(10);
        var maxv = Math.log(1500);

        // calculate adjustment factor
        var scale = (maxv - minv) / (maxp - minp);

        return (minp + (Math.log(logValue) - minv) / scale) / 150;
    }

    // Returns an array of distorsions values in [0, 10] range
    getDistorsionValue(numChannel) {
        var pos = this.logToPos(this.k[numChannel]);
        return parseFloat(pos).toFixed(1);
    }

    drawCurrentDistos() {
        // draws both the transfer function and a sinusoidal
        // signal transformed, for each distorsion stage
        this.drawDistoCurves(this.distoDrawer1, this.signalDrawer1, this.od[0].curve);
        this.drawDistoCurves(this.distoDrawer2, this.signalDrawer2, this.od[1].curve);
    }

    drawDistoCurves(distoDrawer, signalDrawer, curve) {
        var c = curve;
        distoDrawer.clear();
        drawCurve(distoDrawer, c);

        // draw signal
        signalDrawer.clear();
        signalDrawer.drawAxis();
        signalDrawer.makeCurve(Math.sin, 0, Math.PI * 2);
        signalDrawer.drawCurve('red', 2);

        //signalDrawer.makeCurve(distord, 0, Math.PI*2);
        var cTransformed = this.distord(c);
        drawCurve(signalDrawer, cTransformed);

    }

    distord(c) {
        // return the curve of sin(x) transformed by the current wave shaper
        // function
        // x is in [0, 2*Math.PI]
        // sin(x) in [-1, 1]

        var c2 = new Float32Array(this.DRAWER_CANVAS_SIZE);
        // sin(x) -> ?
        // [-1, 1] -> [0, length -1]

        // 100 is the canvas size.
        var incX = 2 * Math.PI / this.DRAWER_CANVAS_SIZE;
        var x = 0;
        for (var i = 0; i < this.DRAWER_CANVAS_SIZE; i++) {
            var index = map(Math.sin(x), -1, 1, 0, c.length - 1);
            c2[i] = c[Math.round(index)];
            x += incX;
        }
        return c2;
    }

    makeDistortionCurve(k) {
        // compute a new ws curve for current disto name and current k
        this.currentWSCurve = this.wsFactory.distorsionCurves[this.currentDistoName](k);
        return this.currentWSCurve;
    }

    changeDistoType1() {
        console.log("Changing disto1 to : " + this.menuDisto1.value);
        this.currentDistoName = this.menuDisto1.value;   
        this.distoTypes[0] = this.currentDistoName;
        this.changeDrive(this.currentK);
    }

    changeDistoType2() {
        console.log("Changing disto2 to : " + this.menuDisto2.value);
        this.currentDistoName = this.menuDisto2.value;   
        this.distoTypes[1] = this.currentDistoName;
        this.changeDrive(this.currentK);
    }

    changeDisto1TypeFromPreset(name) {
        this.currentDistoName = name;
        this.menuDisto1.value = name;
        this.distoTypes[0] = this.currentDistoName;
        //changeDrive(currentK);
    }

    changeDisto2TypeFromPreset(name) {
        this.currentDistoName = name;
        this.menuDisto2.value = name;
        this.distoTypes[1] = this.currentDistoName;
        //changeDrive(currentK);
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

    // Build a drop down menu with all distorsion names
    buildDistoMenu1() {
        for(var p in this.wsFactory.distorsionCurves) {
            var option = document.createElement("option");
            option.value = p;
            option.text = p;
            this.menuDisto1.appendChild(option);    
        }
        this.menuDisto1.onchange = () => this.changeDistoType1();
    }

    // Build a drop down menu with all distorsion names
    buildDistoMenu2() {
        for(var p in this.wsFactory.distorsionCurves) {
            var option = document.createElement("option");
            option.value = p;
            option.text = p;
            this.menuDisto2.appendChild(option);    
        }
        this.menuDisto2.onchange = () => this.changeDistoType2();
    }

    //
    // Gain-related functions
    //

    changePreampStage1GainValue(sliderVal) {
        var value = parseFloat(sliderVal);
        this.preampStage1Gain.gain.value = value;

        // update output labels
        var output = document.querySelector("#preampStage1Gain");
        output.value = parseFloat(sliderVal).toFixed(2);

        // refresh slider state
        var slider = document.querySelector("#preampStage1GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(2);
    }

    changePreampStage2GainValue(sliderVal) {
        var value = parseFloat(sliderVal);
        this.preampStage2Gain.gain.value = value;

        // update output labels
        var output = document.querySelector("#preampStage2Gain");
        output.value = parseFloat(sliderVal).toFixed(2);

        // refresh slider state
        var slider = document.querySelector("#preampStage2GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(2);
    }

    //
    // Filter-related functions
    //

    changeLowShelf1FrequencyValue(sliderVal) {
        var value = parseFloat(sliderVal);
        this.lowShelf1.frequency.value = value;
        //console.log("Freq value : " + value)

        // update output labels
        var output = document.querySelector("#lowShelf1Freq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#lowShelf1FreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf1GainValue(sliderVal) {
        var value = parseFloat(sliderVal);
        this.lowShelf1.gain.value = value;
        //console.log("Gain value : " + value)

        // update output labels
        var output = document.querySelector("#lowShelf1Gain");
        output.value = parseFloat(sliderVal).toFixed(1) + " dB";

        // refresh slider state
        var slider = document.querySelector("#lowShelf1GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf2FrequencyValue(sliderVal) {
        var value = parseFloat(sliderVal);
        this.lowShelf2.frequency.value = value;

        //console.log("lowshelf 2 freq = " + value);
        // update output labels
        var output = document.querySelector("#lowShelf2Freq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#lowShelf2FreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf2GainValue(sliderVal) {
        var value = parseFloat(sliderVal);
        this.lowShelf2.gain.value = value;

        //console.log("lowshelf 2 gain = " + value);
        // update output labels
        var output = document.querySelector("#lowShelf2Gain");
        output.value = parseFloat(sliderVal).toFixed(1) + " dB";

        // refresh slider state
        var slider = document.querySelector("#lowShelf2GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf3FrequencyValue(sliderVal) {
        var value = parseFloat(sliderVal);
        this.lowShelf3.frequency.value = value;

        // update output labels
        var output = document.querySelector("#lowShelf3Freq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#lowShelf3FreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeLowShelf3GainValue(sliderVal) {
        var value = parseFloat(sliderVal);
        this.lowShelf3.gain.value = value;

        // update output labels
        var output = document.querySelector("#lowShelf3Gain");
        output.value = parseFloat(sliderVal).toFixed(1) + " dB";

        // refresh slider state
        var slider = document.querySelector("#lowShelf3GainSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeHighPass1FrequencyValue(sliderVal) {
        var value = parseFloat(sliderVal);
        this.highPass1.frequency.value = value;

        // update output labels
        var output = document.querySelector("#highPass1Freq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#highPass1FreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeHighPass1QValue(sliderVal) {
        var value = parseFloat(sliderVal);
        this.highPass1.Q.value = value;

        // update output labels
        var output = document.querySelector("#highPass1Q");
        output.value = parseFloat(sliderVal).toFixed(4);

        // refresh slider state
        var slider = document.querySelector("#highPass1QSlider");
        slider.value = parseFloat(sliderVal).toFixed(4);
    }

    //
    // Boost-related functions
    //

    boostOnOff(cb) {  
        // called when we click the switch on the GUI      
        this.boost.toggle();

        this.adjustOutputGainIfBoostActivated();
        this.updateBoostLedButtonState(this.boost.isActivated());
    }

    changeBoost(state) {
        //console.log("changeBoost, boost before: " + this.boost.isActivated() + " output gain=" + amp.output.gain.value);

        if(this.boost.isActivated() !== state) {
            // we need to adjust the output gain
            console.log("changeBoost: we change boost state");
            this.boost.onOff(state);
            adjustOutputGainIfBoostActivated();
            updateBoostLedButtonState(this.boost.isActivated());
        } else {
            console.log("changeBoost: we do not change boost state");
        }

        console.log("changeBoost, boost after: " + this.boost.isActivated());
    }

    adjustOutputGainIfBoostActivated() {
        console.log("adjustOutputGainIfBoostActivated: output gain value before = " + amp.output.gain.value)

        if(this.boost.isActivated()) {
            amp.output.gain.value /= 2;
        } else {
            amp.output.gain.value *= 2;
        }
        console.log("adjustOutputGainIfBoostActivated: output gain value after = " + amp.output.gain.value)
    }

    updateBoostLedButtonState(activated) {
        // update buttons states
        var boostSwitch = document.querySelector("#toggleBoost");

        if(this.boost.isActivated()) {
            boostSwitch.setValue(1,false);
        } else {
            boostSwitch.setValue(0,false);
        }
    }

    highlightValues(label,kvalue) {
        label.style.fontWeight="bold";
        label.style.color="blue";
        kvalue.style.fontWeight="bold";
        kvalue.style.color="blue";
    }

    hideValues(label,kvalue) {
        label.style.fontWeight="normal";
        label.style.color="black";
        kvalue.style.fontWeight="normal";
        kvalue.style.color="black";
    }

}