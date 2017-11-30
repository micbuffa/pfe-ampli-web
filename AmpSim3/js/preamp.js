class PreAmp {

	constructor(ampName, context) {
		// Model not used here but can be used to adjust
		// the values according to model/brand
		this.ampName = ampName;
		this.context = context;
        // Channel booster
        this.boost = new Boost(context);
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
		this.bezierPoints = [{x: 0, y: 100},{x: 52, y: 96},{x: 50, y: 0},{x: 100, y: 0}];
	}

    createDisto(type) {
        switch (type) {
            case "disto1" :
                // Distorsion 1, here we should use an asymetric function in order to 
                // generate odd harmonics
                this.od[0] = this.context.createWaveShaper();
                this.od[0].curve = this.wsFactory.distorsionCurves[this.distoTypes[0]](0);
                break;
            case "disto2" :
                // Distorsion 2, symetric function to generate even harmonics
                this.od[1] = this.context.createWaveShaper();
                this.od[1].curve = this.wsFactory.distorsionCurves[this.distoTypes[1]](0);
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
	
    changeDistorsionValuesPA(sliderValue, numDisto, point) {
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

		if (this.distoTypes[numDisto] == "bezier") {
			// point equal x value
			this.changeBezier(point);
			this.od[numDisto].curve = this.wsFactory.distorsionCurves[this.distoTypes[numDisto]](this.bezierPoints);
			this.currentWSCurve = this.od[numDisto].curve;
		} else {
			this.k[numDisto] = value;
			//console.log("k = " + value + " pos = " + logToPos(value));
			//console.log("distoTypes = " + distoTypes[numDisto]);
			this.od[numDisto].curve = this.wsFactory.distorsionCurves[this.distoTypes[numDisto]](this.k[numDisto]); //makeDistortionCurve(k[numDisto]);
			this.currentWSCurve = this.od[numDisto].curve;
			//od[numDisto].curve = makeDistortionCurve(sliderValue);
			//makeDistortionCurve(k[numDisto]);
			//od[numDisto].curve = makeDistortionCurve(sliderValue);
		}

        // redraw curves
        this.drawCurrentDistos();
    }
	
	changeBezier(point) {
		if(point != undefined) {
			this.bezierPoints[0].y += point;
			this.bezierPoints[1].y += point;
			this.bezierPoints[2].y += point;
			this.bezierPoints[3].y += point;
		}
	}

    // Returns an array of distorsions values in [0, 10] range
    getDistorsionValue(numChannel) {
        var pos = logToPos(this.k[numChannel]);
        return parseFloat(pos).toFixed(1);
    }

    drawCurrentDistos() {
        // draws both the transfer function and a sinusoidal
        // signal transformed, for each distorsion stage
        this.drawDistoCurves(this.distoDrawer1, this.signalDrawer1, this.od[0].curve, 0);
        this.drawDistoCurves(this.distoDrawer2, this.signalDrawer2, this.od[1].curve, 1);
    }

    drawDistoCurves(distoDrawer, signalDrawer, curve, curveNumber) {
        var c = curve;
        distoDrawer.clear();
		// Draw control points and line only for bezier curve.
		if(this.distoTypes[curveNumber] == "bezier") {
			var p1 = this.bezierPoints[1];
			var	p2 = this.bezierPoints[2];
			// bias point
  			var biasPoint = {
				x: (p1.x + p2.x) / 2,
				y: (p1.y + p2.y) / 2,
			}
			distoDrawer.drawControlPoint(biasPoint);
			distoDrawer.drawControlPoint(p1);
			distoDrawer.drawControlPoint(p2);
			distoDrawer.drawLine(p1, p2);
		}
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

    changeDisto1TypePA(name) {
        this.currentDistoName = name;   
        this.distoTypes[0] = name;
    }

    changeDisto2TypePA(name) {
        this.currentDistoName = name;   
        this.distoTypes[1] = name;
    }

    changeDisto1TypeFromPreset(name) {
        this.currentDistoName = name;
        this.distoTypes[0] = this.currentDistoName;
        //changeDrive(currentK);
    }

    changeDisto2TypeFromPreset(name) {
        this.currentDistoName = name;
        this.distoTypes[1] = this.currentDistoName;
        //changeDrive(currentK);
    }

    //
    // Gain-related functions
    //

    changePreampStage1GainValuePA(sliderVal) {
        var value = parseFloat(sliderVal);
        this.preampStage1Gain.gain.value = value;
    }

    changePreampStage2GainValuePA(sliderVal) {
        var value = parseFloat(sliderVal);
        this.preampStage2Gain.gain.value = value;
    }

    //
    // Filter-related functions
    //

    changeLowShelf1FrequencyValuePA(sliderVal) {
        var value = parseFloat(sliderVal);
        this.lowShelf1.frequency.value = value;
        //console.log("Freq value : " + value)
    }

    changeLowShelf1GainValuePA(sliderVal) {
        var value = parseFloat(sliderVal);
        this.lowShelf1.gain.value = value;
        //console.log("Gain value : " + value)
    }

    changeLowShelf2FrequencyValuePA(sliderVal) {
        var value = parseFloat(sliderVal);
        this.lowShelf2.frequency.value = value;
        //console.log("lowshelf 2 freq = " + value);
    }

    changeLowShelf2GainValuePA(sliderVal) {
        var value = parseFloat(sliderVal);
        this.lowShelf2.gain.value = value;
        //console.log("lowshelf 2 gain = " + value);
    }

    changeLowShelf3FrequencyValuePA(sliderVal) {
        var value = parseFloat(sliderVal);
        this.lowShelf3.frequency.value = value;
    }

    changeLowShelf3GainValuePA(sliderVal) {
        var value = parseFloat(sliderVal);
        this.lowShelf3.gain.value = value;
    }

    changeHighPass1FrequencyValuePA(sliderVal) {
        var value = parseFloat(sliderVal);
        this.highPass1.frequency.value = value;
    }

    changeHighPass1QValuePA(sliderVal) {
        var value = parseFloat(sliderVal);
        this.highPass1.Q.value = value;
    }

    //
    // Boost-related functions
    //

    adjustOutputGainIfBoostActivated() {
        //console.log("adjustOutputGainIfBoostActivated: output gain value before = " + amp.output.gain.value)

        if(this.boost.isActivated()) {
            amp.output.gain.value /= 2;
        } else {
            amp.output.gain.value *= 2;
        }
        //console.log("adjustOutputGainIfBoostActivated: output gain value after = " + amp.output.gain.value)
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

// Booster, useful to add a "Boost channel"
var Boost = function(context) {
    // Booster not activated by default
    var activated = false;

    var input = context.createGain();
    var inputGain = context.createGain();
    inputGain.gain.value = 0;
    var byPass = context.createGain();
    byPass.gain.value = 1;
    var filter = context.createBiquadFilter();
    filter.frequency.value = 3317;
    var shaper = context.createWaveShaper();
    shaper.curve = makeDistortionCurve(640);
    var outputGain = context.createGain();
    outputGain.gain.value = 2;
    var output = context.createGain();

    // build graph
    input.connect(inputGain);
    inputGain.connect(shaper);
    shaper.connect(filter);
    filter.connect(outputGain);
    outputGain.connect(output);

    // bypass route
    input.connect(byPass);
    byPass.connect(output);

    function isActivated() {
        return activated;
    }

    function onOff(wantedState) {
        if(wantedState === undefined) {
            // do not boost
            if(activated) toggle();
            return;
        }
        var currentState = activated;

        if(wantedState !== currentState) {
            toggle();
        }
    }

    function toggle() {
        if(!activated) {
            byPass.gain.value = 0;
            inputGain.gain.value = 1;
        } else {
            byPass.gain.value = 1;
            inputGain.gain.value = 0;
        }
        activated = !activated;
    }

    function setOversampling(value) {
        shaper.oversample = value;
        console.log("boost set oversampling to " + value);
    }

    function makeDistortionCurve(k) {
        var n_samples = 44100; //65536; //22050;     //44100
        var curve = new Float32Array(n_samples);
        var deg = Math.PI / 180;
        for (var i = 0; i < n_samples; i += 1) {
            var x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }

    // API
    return {
        input: input,
        output: output,
        onOff: onOff,
        toggle: toggle,
        isActivated: isActivated,
        setOversampling: setOversampling
    };
};