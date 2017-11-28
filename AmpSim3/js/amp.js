// INITS
var audioPlayer, input2;
var demoSampleURLs = [
  "assets/audio/Guitar_DI_Track.mp3",
  "assets/audio/LasseMagoDI.mp3",
  "assets/audio/RawPRRI.mp3",
  "assets/audio/Di-Guitar.mp3",
  "assets/audio/NarcosynthesisDI.mp3",
  "assets/audio/BlackSabbathNIB_rythmDI.mp3",
  "assets/audio/BlackSabbathNIBLead_DI.mp3",
  "assets/audio/BasketCase Greenday riff DI.mp3",
  "assets/audio/InBloomNirvanaRiff1DI.mp3",
  "assets/audio/Muse1Solo.mp3",
  "assets/audio/Muse2Rythm.mp3"
];

function gotStream() {
    // Create an AudioNode from the stream.
    audioPlayer = document.getElementById('player');
    try {
        // if ShadowDOMPolyfill is defined, then we are using the Polymer
        // WebComponent polyfill that wraps the HTML audio
        // element into something that cannot be used with
        // createMediaElementSource. We use ShadowDOMPolyfill.unwrap(...)
        // to get the "real" HTML audio element
        audioPlayer = ShadowDOMPolyfill.unwrap(audioPlayer);
    } catch(e) {
        console.log("ShadowDOMPolyfill undefined, running native Web Component code");
    }
    
    if(input2 === undefined) {
        input2 = audioContext.createMediaElementSource(audioPlayer);
    }

    var input = audioContext.createMediaStreamSource(window.stream);
    audioInput = convertToMono(input);

    createAmp(audioContext, audioInput, input2);
    console.log('--- AMP CREATED ---')
}

var amp;
var ampCtrl;
var analyzerAtInput, analyzerAtOutput;
var convolverSlider;
var convolverCabinetSlider;
var guitarInput;
var initialDistoVal = 4;

// Create the amp
function createAmp(context, input1, input2) {
    guitarInput = input1;

    amp = new Amp(context);
    ampCtrl = new AmpController(amp);
    // set default preset
    ampCtrl.setDefaultPreset();

    // build graph
    analyzerAtInput = context.createAnalyser();
    amp.input.connect(analyzerAtInput);

    // connect audio player to amp for previewing presets
    input2.connect(amp.input);

    // output, add an analyser at the end
    analyzerAtOutput = context.createAnalyser();
    amp.output.connect(analyzerAtOutput);
    analyzerAtOutput.connect(context.destination);

    convolverSlider = document.querySelector('#convolverSlider');
    convolverCabinetSlider = document.querySelector('#convolverCabinetSlider');

    initVisualizations();
}

// Visualizations
var inputVisualization, outputVisualization;

function initVisualizations() {
    inputVisualization = new Visualization();
    inputVisualization.configure("inputSignalCanvas", analyzerAtInput);

    outputVisualization = new Visualization();
    outputVisualization.configure("outputSignalCanvas", analyzerAtOutput);

    // start updating the visualizations
    requestAnimationFrame(visualize);
}

function visualize() {
    inputVisualization.update();
    outputVisualization.update();

    requestAnimationFrame(visualize);
}

// ----------- AMP ---------------

function Amp(context) {
    var presets = [];
    var menuPresets = document.querySelector("#QFPresetMenu2");

    var preamp = new PreAmp("JCM800", context);
    var tonestack = new ToneStack("JCM800", context);
    var eq = new Equalizer(context);
    
    preamp.buildDistoMenu1();
    preamp.buildDistoMenu2();

    // Main input and output and bypass
    var input = context.createGain();
    var output = context.createGain();
    var byPass = context.createGain();
    byPass.gain.value = 0;

    // amp input gain towards pream stage
    var inputGain = context.createGain();
    inputGain.gain.value = 1;

    // ------------
    // PREAM STAGE
    // ------------

    // Tonestack in serie, cf Lepou's mail  
    /*for (var i = 0; i < 4; i++) {
        loCutFilters[i] = context.createBiquadFilter();
        loCutFilters[i].type = "lowshelf";
        loCutFilters[i].frequency.value = 720;
        loCutFilters[i].gain.value = 3.3;

        hiCutFilters[i] = context.createBiquadFilter();
        hiCutFilters[i].type = "lowpass";
        hiCutFilters[i].frequency.value = 12000;
        hiCutFilters[i].Q.value = 0.7071;

        highShelfBoosts[i] = context.createBiquadFilter();
        highShelfBoosts[i].type = "highshelf";
        highShelfBoosts[i].frequency.value = 12000; // Which values ?
        highShelfBoosts[i].Q.value = 0.7071;        // Which values ?

        od[i] = context.createWaveShaper();
        od[i].curve = makeDistortionCurve(k[i]);
        // Oversampling generates some (small) latency
        //od[i].oversample = '4x';

        // gains
        gainsOds[i] = context.createGain();
        gainsOds[i].gain.value = 1;
    }*/

    preamp.createFilter("lowshelf1");
    preamp.createFilter("lowshelf2");
    preamp.createFilter("lowshelf3");
    preamp.createFilter("highpass1");

    preamp.createGain("stage1");
    preamp.createGain("stage2");

    preamp.createDisto("disto1");
    preamp.createDisto("disto2");

    preamp.changeDistorsionValuesPA(initialDistoVal, 0);
    preamp.changeDistorsionValuesPA(initialDistoVal, 1);

    // output gain after preamp stage
    var outputGain = context.createGain();
    output.gain.value = 0.5;

    // ------------------------------
    // TONESTACK STAGES
    // ------------------------------

    tonestack.createFilter("bass");
    tonestack.createFilter("mid");
    tonestack.createFilter("treble");
    tonestack.createFilter("presence");

    // -----------------------------------
    // POST PROCESSING STAGE (EQ, reverb)
    // -----------------------------------
    //  before EQ, filter highs and lows (Fred Miniere advice)
    var eqhicut = context.createBiquadFilter();
        eqhicut.frequency.value = 10000;
        eqhicut.type = "peaking";
        eqhicut.gain.value = -25;

    var eqlocut = context.createBiquadFilter();
        eqlocut.frequency.value = 60;
        eqlocut.type = "peaking";
        eqlocut.gain.value = -19;

    changeEQValues([0, 0, 0, 0, 0, 0]);
    var bypassEQg = context.createGain();
    bypassEQg.gain.value = 0; // by defaut EQ is in
    var inputEQ = context.createGain();

    var cabinetSim, reverb;
    // Master volume
    var masterVolume = context.createGain();
    changeMasterVolume(2);

    /*reverb = new Reverb(context, function () {
        console.log("reverb created");

        cabinetSim = new CabinetSimulator(context, function () {
            console.log("cabinet sim created");

            doAllConnections();
        });
    });*/

    reverb = new Convolver(context, reverbImpulses, "reverbImpulses");
    cabinetSim = new Convolver(context, cabinetImpulses, "cabinetImpulses");

    doAllConnections();

    // -------------------
    // END OF AMP STAGES
    // -------------------

    function doAllConnections() {
        // called only after reverb and cabinet sim could load and
        // decode impulses

        // Build web audio graph, set default preset
        buildGraph();
        changeRoom(7.5); // TO REMOVE ONCE PRESETS MANAGER WORKS
        initPresets();

        console.log("Running");
    }


    function buildGraph() {
        input.connect(inputGain);
        input.connect(byPass);

        // boost is not activated, it's just a sort of disto at 
        // the very beginning of the amp route
        inputGain.connect(preamp.boost.input);

        // JCM 800 like...
        preamp.boost.output.connect(preamp.lowShelf1);
        preamp.lowShelf1.connect(preamp.lowShelf2);
        preamp.lowShelf2.connect(preamp.preampStage1Gain);
        preamp.preampStage1Gain.connect(preamp.od[0]);
        preamp.od[0].connect(preamp.highPass1);
        preamp.highPass1.connect(preamp.lowShelf3);

        preamp.lowShelf3.connect(preamp.preampStage2Gain);
        preamp.preampStage2Gain.connect(preamp.od[1])

        // end of preamp

        preamp.od[1].connect(outputGain);

        // tonestack
        outputGain.connect(tonestack.trebleFilter);
        tonestack.trebleFilter.connect(tonestack.bassFilter);
        tonestack.bassFilter.connect(tonestack.midFilter);
        tonestack.midFilter.connect(tonestack.presenceFilter);

        // lo and hicuts
        tonestack.presenceFilter.connect(eqlocut);
        eqlocut.connect(eqhicut);

        // post process
        eqhicut.connect(inputEQ);

        // bypass eq route
        eqhicut.connect(bypassEQg);
        bypassEQg.connect(masterVolume);

        // normal route
        inputEQ.connect(eq.input);
        eq.output.connect(masterVolume);
        masterVolume.connect(reverb.input);

        reverb.output.connect(cabinetSim.input);
        cabinetSim.output.connect(output);
        //eq.output.connect(output);
        //reverb.output.connect(output);

        // byPass route
        byPass.connect(output);
    }

    function changeHicutFreqValue(sliderVal) {
        var value = parseFloat(sliderVal);
        for(var i =0; i < 4; i++) {
            hiCutFilters[i].frequency.value = value;
    }
        // update output labels
        var output = document.querySelector("#hiCutFreq");
        output.value = parseFloat(sliderVal).toFixed(1) + " Hz";

        // refresh slider state
        var slider = document.querySelector("#hiCutFreqSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);
    }

    function changeOversampling(cb) {
        for (var i = 0; i < 2; i++) {
            if(cb.checked) {
                // Oversampling generates some (small) latency
                preamp.od[i].oversample = '4x';
                preamp.boost.setOversampling('4x');
                console.log("set oversampling to 4x");
            } else {
                preamp.od[i].oversample = 'none';
                preamp.boost.setOversampling('none');
                console.log("set oversampling to none");
            }
         }
         // Not sure if this is necessary... My ears can't hear the difference
         // between oversampling=node and 4x ? Maybe we should re-init the
         // waveshaper curves ?
         //changeDistoType1();
         //changeDistoType2();
    }

    function changeQValues(sliderVal, numQ) {
        var value = parseFloat(sliderVal);
        filters[numQ].Q.value = value;

        // update output labels
        var output = document.querySelector("#q" + numQ);
        output.value = value.toFixed(1);

        // update sliders
        var numSlider = numQ + 1;
        var slider = document.querySelector("#Q" + numSlider + "slider");
        slider.value = value;

    }

    function changeFreqValues(sliderVal, numF) {
        var value = parseFloat(sliderVal);
        filters[numF].frequency.value = value;

        // update output labels
        var output = document.querySelector("#freq" + numF);
        output.value = value + " Hz";
        // refresh slider state
        var numSlider = numF + 1;
        var slider = document.querySelector("#F" + numSlider + "slider");
        slider.value = value;
    }

    // volume aka preamp output volume
    function changeOutputGain(sliderVal) {
        // sliderVal is in [0, 10]
        // Adjust to [0, 1]
        var value = parseFloat(sliderVal/10);
        outputGain.gain.value = value;

        // update output labels
        //var output = document.querySelector("#outputGain");
        //output.value = parseFloat(sliderVal).toFixed(1);

        // refresh slider state
        //var slider = document.querySelector("#OGslider");
        //slider.value = parseFloat(sliderVal).toFixed(1);

        // refresh knob state
        var knob = document.querySelector("#Knob1");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

        // volume aka preamp output volume
    function changeInputGain(sliderVal) {
        // sliderVal is in [0, 10]
        // Adjust to [0, 1]
        var value = parseFloat(sliderVal/10);
        inputGain.gain.value = value;

        // update output labels
        //var output = document.querySelector("#outputGain");
        //output.value = parseFloat(sliderVal).toFixed(1);

        // refresh slider state
        //var slider = document.querySelector("#OGslider");
        //slider.value = parseFloat(sliderVal).toFixed(1);

        // refresh knob state
        var knob = document.querySelector("#Knob1");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    function changeMasterVolume(sliderVal) {
        // sliderVal is in [0, 10]
        var value = parseFloat(sliderVal);
        masterVolume.gain.value = value;

        // update output labels
        //var output = document.querySelector("#MVOutputGain");
        //output.value = parseFloat(sliderVal).toFixed(1);

        // refresh slider state
        //var slider = document.querySelector("#MVslider");
        //slider.value = parseFloat(sliderVal).toFixed(1);
        
        // refresh knob state
        var knob = document.querySelector("#Knob2");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    function changeReverbGain(sliderVal) {
        // slider val in [0, 10] range
        // adjust to [0, 1]
        var value = parseFloat(sliderVal) / 10;
        reverb.setGain(value);

        // update output labels
        //var output = document.querySelector("#reverbGainOutput");
        //output.value = parseFloat(sliderVal).toFixed(1);

        // refresh slider state
        //var slider = document.querySelector("#convolverSlider");
        //slider.value = parseFloat(sliderVal).toFixed(1);

        // refresh knob state
        var knob = document.querySelector("#Knob7");
        knob.setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    function changeReverbImpulse(name) {
        reverb.loadImpulseByName(name);
    }

    function changeRoom(sliderVal) {
        // slider val in [0, 10] range
        // adjust to [0, 1]
        console.log('change room');
        var value = parseFloat(sliderVal) / 10;
        cabinetSim.setGain(value);

        // update output labels
        var output = document.querySelector("#cabinetGainOutput");
        output.value = parseFloat(sliderVal).toFixed(1);

        // refresh slider state
        var slider = document.querySelector("#convolverCabinetSlider");
        slider.value = parseFloat(sliderVal).toFixed(1);

    }

    function changeCabinetSimImpulse(name) {
        cabinetSim.loadImpulseByName(name);
    }

    function changeEQValues(eqValues) {
        eq.setValues(eqValues);
    }

    // --------
    // PRESETS
    // --------
    function initPresets() {
        // updated 10/4/2016
        var preset1 = {"name":"Hard Rock classic 1","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-5,"gain1":1,"distoName1":"asymetric","K1":"7.8",
            "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"notSoDistorded","K2":"7.8","OG":"7.0","BF":"8.2","MF":"8.2","TF":"3.8","PF":"6.9",
            "EQ":[5,11,-6,-10,7,2],"MV":"7.2","RN":"Fender Hot Rod","RG":"2.0","CN":"Marshall 1960, axis","CG":"9.4"};
        presets.push(preset1);

        var preset2 = {"name":"Clean and Warm","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":1.600000023841858,"gain1":1,"distoName1":"asymetric","K1":"7.8",
            "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"standard","K2":"0.9","OG":"7.0","BF":"6.7","MF":"7.1","TF":"3.2","PF":"6.9",
            "EQ":[10,5,-7,-7,12,0],"MV":"7.2","RN":"Fender Hot Rod","RG":"1.4","CN":"Marshall 1960, axis","CG":"8.8"};
        presets.push(preset2);

        var preset3 = {"name":"Strong and Warm","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-1,"gain1":1.0299999713897705,"distoName1":"asymetric","K1":"7.8",
            "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"superClean","K2":"7.8","OG":"7.0","BF":"8.2","MF":"6.7","TF":"5.0","PF":"6.9",
            "EQ":[0,0,0,-1,0,1],"MV":"5.9","RN":"Fender Hot Rod","RG":"1.1","CN":"Vox Custom Bright 4x12 M930 Axis 1","CG":"8.0"};
        presets.push(preset3);

        //preset4 = {"name":"Fat sound","boost":true,"LS1Freq":720,"LS1Gain":-5.800000190734863,"LS2Freq":320,"LS2Gain":6.599999904632568,"gain1":0.11999999731779099,"distoName1":"asymetric","K1":"5.4",
        //"HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-5.199999809265137,"gain2":1,"distoName2":"standard","K2":"5.4","OG":"3.5","BF":"3.2","MF":"5.0","TF":"5.0","PF":"9.7",
        //"EQ":[1,0,-6,-8,-6,-30],"MV":"3.1","RN":"Fender Hot Rod","RG":"0.0","CN":"Marshall 1960, axis","CG":"3.4"};
        //presets.push(preset4);
        var preset4 = {"name":"Clean no reverb","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-6.300000190734863,"gain1":1,"distoName1":"asymetric","K1":"2.1",
            "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"crunch","K2":"2.1","OG":"7.0","BF":"6.7","MF":"5.0","TF":"5.0","PF":"8.9",
            "EQ":[4,12,-8,-8,12,12],"MV":"3.7","RN":"Fender Hot Rod","RG":"0.0","CN":"Marshall 1960, axis","CG":"4.5"};
        presets.push(preset4);

        var preset5 = {"name":"Another Clean Sound","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-6.300000190734863,"gain1":1,"distoName1":"asymetric","K1":"6.4",
            "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"crunch","K2":"6.4","OG":"7.0","BF":"6.7","MF":"5.0","TF":"5.0","PF":"8.9",
            "EQ":[4,12,-8,-8,12,12],"MV":"3.7","RN":"Fender Hot Rod","RG":"2","CN":"Marshall 1960, axis","CG":"4.5"};
        presets.push(preset5);

        var preset6 = {"name":"Mostly even harmonics","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-7.5,"gain1":1,"distoName1":"standard","K1":"6.7",
            "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"standard","K2":"6.7","OG":"7.0","BF":"4.3","MF":"2.6","TF":"6.1","PF":"4.2",
            "EQ":[5,12,-5,-10,2,10],"MV":"1.7","RN":"Fender Hot Rod","RG":"0.0","CN":"Vintage Marshall 1","CG":"8.4"};
        presets.push(preset6);

        var preset7 = {"name":"Hard Rock classic 2","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-10.199999809265137,"gain1":1,"distoName1":"standard","K1":"5.2",
            "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"notSoDistorded","K2":"5.1","OG":"7.0","BF":"8.7","MF":"8.0","TF":"3.8","PF":"9.4",
            "EQ":[12,8,-6,-10,7,2],"MV":"5.5","RN":"Fender Hot Rod","RG":"0.7","CN":"Marshall 1960, axis","CG":"9.2"};
        presets.push(preset7);
        
        var preset8 = {"name":"SuperClean/Jazz","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-6.300000190734863,"gain1":1,"distoName1":"crunch","K1":"5.4",
            "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"crunch","K2":"5.4","OG":"7.0","BF":"7.0","MF":"5.1","TF":"5.2","PF":"3.1",
            "EQ":[10,7,0,-10,5,12],"MV":"3.8","RN":"Fender Hot Rod","RG":"1.5","CN":"Marshall 1960, axis","CG":"4.5"};
        presets.push(preset8);

        presets.forEach(function (p, index) {
            var option = document.createElement("option");
            option.value = index;
            option.text = p.name;
            menuPresets.appendChild(option);
        });
    }

    // END PRESETS

    function bypass(cb) {
        console.log("byPass : " + cb.checked);

        if (cb.checked) {
            // byPass mode
            inputGain.gain.value = 1;
            byPass.gain.value = 0;
        } else {
            // normal amp running mode
            inputGain.gain.value = 0;
            byPass.gain.value = 1;
        }

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

    function bypassEQ(cb) {
        console.log("EQ byPass : " + cb.checked);

        if (cb.checked) {
            // byPass mode
            inputEQ.gain.value = 1;
            bypassEQg.gain.value = 0;
        } else {
            // normal amp running mode
            inputEQ.gain.value = 0;
            bypassEQg.gain.value = 1;
        }

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

    // API: methods exposed
    return {
        input: input,
        output: output,
        boostOnOff: boostOnOff,
        eq: eq,
        reverb: reverb,
        cabinet: cabinetSim,
        tonestack: tonestack,
        preamp: preamp,
        master: masterVolume,
        presets: presets,
        
        changeOversampling: changeOversampling,
        changeOutputGain: changeOutputGain,
        changeInputGain: changeInputGain,

        changeMasterVolume: changeMasterVolume,
        changeReverbGain: changeReverbGain,
        changeReverbImpulse: changeReverbImpulse,
        changeCabinetSimImpulse: changeCabinetSimImpulse,
        changeRoom: changeRoom,
        changeEQValues: changeEQValues,
        bypass: bypass,
        bypassEQ: bypassEQ
    };
}

var reverbImpulses = [
    {
        name: "Fender Hot Rod",
        url: "assets/impulses/reverb/cardiod-rear-levelled.wav"
    },
    {
        name: "PCM 90 clean plate",
        url: "assets/impulses/reverb/pcm90cleanplate.wav"
    },
    {
        name: "Scala de Milan",
        url: "assets/impulses/reverb/ScalaMilanOperaHall.wav"
    }
];
var cabinetImpulses = [
    {
        name: "Marshall 1960, axis",
        url: "assets/impulses/cabinet/Marshall1960.wav"
    },    
    {
        name: "Vintage Marshall 1",
        url: "assets/impulses/cabinet/Block%20Inside.wav"
    },
    {
        name: "Vox Custom Bright 4x12 M930 Axis 1",
        url: "assets/impulses/cabinet/voxCustomBrightM930OnAxis1.wav"
    },
    {
        name: "Fender Champ, axis",
        url: "assets/impulses/cabinet/FenderChampAxisStereo.wav"
    }
];

// ------- CONVOLVER, used for both reverb and cabinet simulation -------------------
function Convolver(context, impulses, menuId) {
    var convolverNode, convolverGain, directGain;
    // create source and gain node
    var inputGain = context.createGain();
    var outputGain = context.createGain();
    var decodedImpulse;

    var menuIRs;
    var IRs = impulses;

    var currentImpulse = IRs[0];
    var defaultImpulseURL = IRs[0].url;

    convolverNode = context.createConvolver();
    convolverNode.buffer = decodedImpulse;

    convolverGain = context.createGain();
    convolverGain.gain.value = 0;

    directGain = context.createGain();
    directGain.gain.value = 1;

    buildIRsMenu(menuId);
    buildAudioGraphConvolver();
    setGain(0.2);
    loadImpulseByUrl(defaultImpulseURL);
    

    function loadImpulseByUrl(url) {
        // Load default impulse
        const samples = Promise.all([loadSample(context,url)]).then(setImpulse);
    }

    function loadImpulseByName(name) {
        if(name === undefined) {
            name = IRs[0].name;
            console.log("loadImpulseByName: name undefined, loading default impulse " + name);
        }

        var url="none";
        // get url corresponding to name
        for(var i=0; i < IRs.length; i++) {
            if(IRs[i].name === name) {
                url = IRs[i].url;
                currentImpulse = IRs[i];
                menuIRs.value = i;
                break;
            }
        }

        if(url === "none") {
            console.log("ERROR loading reverb impulse name = " + name);
        } else {
            console.log("loadImpulseByName loading " + currentImpulse.name);
            loadImpulseByUrl(url);
        }
    }

    function loadImpulseFromMenu() {
        var url = IRs[menuIRs.value].url;
        currentImpulse = IRs[menuIRs.value];
        console.log("loadImpulseFromMenu loading " + currentImpulse.name);
        loadImpulseByUrl(url);
    }

    function setImpulse(param) {
     // we get here only when the impulse is loaded and decoded
        console.log("impulse loaded and decoded");
        convolverNode.buffer = param[0];
        console.log("convolverNode.buffer set with the new impulse (loaded and decoded");
    }

    function buildAudioGraphConvolver() {
        // direct/dry route source -> directGain -> destination
        inputGain.connect(directGain);
        directGain.connect(outputGain);

        // wet route with convolver: source -> convolver 
        // -> convolverGain -> destination
        inputGain.connect(convolverNode);
        convolverNode.connect(convolverGain);
        convolverGain.connect(outputGain);
    }

    function setGain(value) {
        var v1 = Math.cos(value * Math.PI / 2);
        var v2 = Math.cos((1 - value) * Math.PI / 2);

        directGain.gain.value = v1;
        convolverGain.gain.value = v2;
    }

    function getGain() {
        return 2 * Math.acos(directGain.gain.value) / Math.PI;
    }

    function getName() {
        return currentImpulse.name;
    }

    function buildIRsMenu(menuId) {
        menuIRs = document.querySelector("#" + menuId);

        IRs.forEach(function (impulse, index) {
            var option = document.createElement("option");
            option.value = index;
            option.text = impulse.name;
            menuIRs.appendChild(option);
        });

        menuIRs.oninput = loadImpulseFromMenu;
    }

    //--------------------------------------
    // API : exposed methods and properties
    // -------------------------------------
    return {
        input: inputGain,
        output: outputGain,
        setGain: setGain,
        getGain: getGain,
        getName: getName,
        loadImpulseByName: loadImpulseByName
    };
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
