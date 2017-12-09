class PreAmp {

	constructor(ampName, context) {
		// Model not used here but can be used to adjust
		// the values according to model/brand
		this.ampName = ampName;
		this.context = context;        
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
        this.biasValue = [7.8, 7.8, 7.8, 7.8]; // array of bias initial values
        this.od = [];
        this.distoTypes = ['asymetric', 'standard'];   
		this.bezierPoints = [[{x: 0, y: 100},{x: 50, y: 100},{x: 50, y: 0},{x: 100, y: 0}], [{x: 0, y: 100},{x: 50, y: 100},{x: 50, y: 0},{x: 100, y: 0}]];
        this.angle = 2.1963;
        this.oldAngle = undefined;
        this.initialP1 = {x: 50, y: 100};
        this.initialP2 = {x: 50, y: 0};
	}

    createBoost() {
        this.boost = new Boost(this.context);
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
                this.beforeOutputGain = this.od[1];
                break;
        }

    }

    createGain(type) {
        switch (type) {
            case "stage1" :
                this.preampStage1Gain = this.context.createGain();
                this.preampStage1Gain.gain.value = 1.0;
                break;
            case "stage2" :
                this.preampStage2Gain = this.context.createGain();   
                this.preampStage2Gain.gain.value = 1.0;
                break;
        }

    }

    createFilter(type) {  
        switch (type) {
            case "lowshelf1" :
                // Low shelf cut -6db at 720Hz
                this.lowShelf1 = this.context.createBiquadFilter();
                this.lowShelf1.type = "lowshelf";
                this.lowShelf1.frequency.value = 720;
                this.lowShelf1.gain.value = -6;
                break;
            case "lowshelf2" :
                // Low shelf cut variable wired to volume knob
                // if vol = 50%, then filter at -6db, 320Hz
                // shoud go from -4db to -6db for +/- fatness
                this.lowShelf2 = this.context.createBiquadFilter();
                this.lowShelf2.type = "lowshelf";    
                this.lowShelf2.frequency.value = 320;
                this.lowShelf2.gain.value = -5;
                break;
            case "lowshelf3" :
                // lowshelf cut -6db 720Hz
                this.lowShelf3 = this.context.createBiquadFilter();
                this.lowShelf3.type = "lowshelf";    
                this.lowShelf3.frequency.value = 720;
                this.lowShelf3.gain.value = -6;
                break;
            case "highpass1" :
                // HighPass at 7-8 Hz, rectify the signal that got a DC value due
                // to the possible asymetric transfer function
                this.highPass1 = this.context.createBiquadFilter();
                this.highPass1.type = "highpass";    
                this.highPass1.frequency.value = 6;
                this.highPass1.Q.value = 0.7071;
                break;
        }

    }

    //
    // Distortion-related functions
    //
    changeDistorsionValuesPA(sliderValue, numDisto) {
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
            this.od[numDisto].curve = this.wsFactory.distorsionCurves[this.distoTypes[numDisto]](this.bezierPoints, numDisto);
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

        var maxPosVal1 = Math.max(logToPos(this.k[2]), logToPos(this.k[3]));
        var maxPosVal2 = Math.max(logToPos(this.k[0]), logToPos(this.k[1]));
        var maxPosVal = Math.max(maxPosVal1, maxPosVal2);
        //var maxPosVal = Math.max(logToPos(k[2]), logToPos(k[3]));
        this.currentK = parseFloat(maxPosVal).toFixed(1);

        // redraw curves
        this.drawCurrentDistos();
    }

    // Just update and redraw
    changeBezierValuesPA(sliderValue, numDisto, bezier) {
        this.od[numDisto].curve = this.wsFactory.distorsionCurves[this.distoTypes[numDisto]](this.bezierPoints, numDisto);
        this.currentWSCurve = this.od[numDisto].curve;
        // update bias value of channel
        this.biasValue[numDisto] = sliderValue;
        // update curve bias value
        this.changeBiasPA(sliderValue, numDisto);
        // redraw curves
        this.drawCurrentDistos();
    }

    returnCurve(numCurve) {
       var p0 = this.bezierPoints[numCurve][0];
       var p1 = this.bezierPoints[numCurve][1];
       var p2 = this.bezierPoints[numCurve][2];
       var p3 = this.bezierPoints[numCurve][3];
       var n_samples = 44100;
       var accuracy = 1/n_samples,
       curve = new Float32Array(n_samples),
       index = 0;
       curve[index++] = map(p0.y, 0, 100, -1, 1);
      
      for (var i=0; i<1; i+=accuracy){
        var p = this.bezier(i, p0, p1, p2, p3);
        curve[index++] = map(p.y, 0, 100, -1, 1);
      }
      return curve;
    }

    getLinearPartAngle(numCurve) {
      var curve = this.returnCurve(numCurve);
      console.log("nb points = " + curve.length);
      var midPointIndex = Math.abs(curve.length/2);
      
      for (var i = 0; i < curve.length; i+=100) {
        var p1X = map(i, 0, curve.length, -1, 1);
        var p1Y = curve[i];
        var p2X = map(i+1, 0, curve.length, -1, 1);
        var p2Y = curve[i+1];
      
         //console.log(`P1x = ${p1X} + P1Y = ${p1Y}`);
        //console.log(`P2x = ${p2X} + P2Y = ${p2Y}`);
         
        var dx = p1X - p2X;
        var dy = p1Y - p2Y;
        var angle = Math.atan2(dy, dx);
        
       // console.log(angle + " / " + oldAngle)
        if (this.oldAngle !== undefined) {
            if (angle === this.oldAngle) {
                console.log("angle radians = " + angle + " en deg " + 180*angle/Math.PI);

                return angle;
            }
        }
        this.oldAngle = angle;
      }
      return angle;
    }

    bezier(t, p0, p1, p2, p3){
        var cX = 3 * (p1.x - p0.x),
            bX = 3 * (p2.x - p1.x) - cX,
            aX = p3.x - p0.x - cX - bX;
                
        var cY = 3 * (p1.y - p0.y),
            bY = 3 * (p2.y - p1.y) - cY,
            aY = p3.y - p0.y - cY - bY;
                
        var x = (aX * Math.pow(t, 3)) + 
                  (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
        var y = (aY * Math.pow(t, 3)) + 
                  (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
                
        return {x: x, y: y};
    }

    changeBiasP2(val, numCurve) {
        val = parseFloat(val);
        // On ne déplace que P2 le long de la pente donnée par angle
        // (angle de la partie linéaire)
        var incX = val*Math.cos(this.angle);
        var incY = val*Math.sin(this.angle);
        this.bezierPoints[numCurve][2].x = this.initialP2.x + incX;
        this.bezierPoints[numCurve][2].y = this.initialP2.y + incY; 
    }

    changeBiasP1(val, numCurve) {
        val = parseFloat(val);
        // On ne déplace que P1 le long de la pente donnée par angle
        // (angle de la partie linéaire)
        var incX = val*Math.cos(this.angle);
        var incY = val*Math.sin(this.angle);
        this.bezierPoints[numCurve][1].x = this.initialP1.x - incX;
        this.bezierPoints[numCurve][1].y = this.initialP1.y - incY; 
    }

    changeBiasPA(val, numCurve) {
        val = parseFloat(val);
        var k1 = map(val, 0, 10, 100, 0);
        this.changeBiasX(k1, numCurve);
        var k2 = map(val, 0, 10, 0, 100);
        this.changeBiasY(k2, numCurve);
    }

    changeBiasX(val, numCurve) {
        val = parseFloat(val);
        this.bezierPoints[numCurve][2].y = val;
        this.initialP2.y = val;
    } 

    changeBiasY(val, numCurve) {
        val = parseFloat(val);
        this.bezierPoints[numCurve][1].y = val;
        this.initialP1.y = val;
    }

    // Returns an array of distorsions values in [0, 10] range
    getDistorsionValue(numChannel) {
        var pos = logToPos(this.k[numChannel]);
        return parseFloat(pos).toFixed(1);
    }

    // Returns an array of bias values in [0, 10] range
    getBiasValue(numChannel) {
        var bias = this.biasValue[numChannel];
        return parseFloat(bias).toFixed(1);
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
			var p1 = this.bezierPoints[curveNumber][1];
			var	p2 = this.bezierPoints[curveNumber][2];
			// bias point
  			var biasPoint = {
				x: (p1.x + p2.x) / 2,
				y: (p1.y + p2.y) / 2,
			}
			distoDrawer.drawControlPoint(biasPoint);
			distoDrawer.drawControlPoint(p1);
			distoDrawer.drawControlPoint(p2);
			//distoDrawer.drawLine(p1, p2);
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

    //
    // Experimental functions
    //

    addNewLamps(type, freq) {
        // Creates a new waveshapper
        var distoNew = this.context.createWaveShaper();
        distoNew.curve = this.wsFactory.distorsionCurves[type](0);

        // Creates a new highpass
        var highPassNew = this.context.createBiquadFilter();
        highPassNew.type = "highpass";    
        highPassNew.frequency.value = 6;
        highPassNew.Q.value = 0.7071;

        // Creates a new lowshelf
        var lowShelfNew  = this.context.createBiquadFilter();
        lowShelfNew.type = "lowshelf";
        lowShelfNew.frequency.value = freq;
        lowShelfNew.gain.value = -6; 

        this.addToGraph(distoNew, highPassNew, lowShelfNew)
    }

    addToGraph(newWs, newHp, newLs) {
        this.beforeOutputGain.disconnect(amp.outputGain);
        this.beforeOutputGain.connect(newWs);
        newWs.connect(newHp);
        newHp.connect(newLs);
        newLs.connect(amp.outputGain);
        this.beforeOutputGain = newLs;
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