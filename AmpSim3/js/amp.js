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

    createAmp(audioContext, audioInput, input2, "JCM800");
    console.log('--- AMP CREATED ---')
}

var amp;
var ampView;
var ampCtrl;
var analyzerAtInput, analyzerAtOutput;
var convolverSlider;
var convolverCabinetSlider;
var guitarInput;

// Create the amp
function createAmp(context, input1, input2, ampName) {
    guitarInput = input1;

    amp = new Amp(context, ampName);
    ampView = new AmpViewer(amp, ampName);
    ampCtrl = new AmpController(amp, ampView);
    // create view disto menus
    ampView.createDistoMenus();
    // create preset menu
    //ampView.createPresetMenu();

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

    ampView.initCurveVisualisations();
}

// ----------- AMP ---------------

function Amp(context, ampName) {
    var presets = [];
    var menuPresets = document.querySelector("#QFPresetMenu2");

    var preamp = new PreAmp(ampName, context);
    var tonestack = new ToneStack(ampName, context);
    var eq = new Equalizer(context);

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

    // output gain after preamp stage
    var outputGain = context.createGain();

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

    var bypassEQg = context.createGain();
    bypassEQg.gain.value = 0; // by defaut EQ is in
    var inputEQ = context.createGain();

    var cabinetSim, reverb;
    // Master volume
    var masterVolume = context.createGain();

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
        changeRoomAmp(7.5); // TO REMOVE ONCE PRESETS MANAGER WORKS
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

    function changeOversamplingAmp(cb) {
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
         // between oversampling=none and 4x ? Maybe we should re-init the
         // waveshaper curves ?
         // changeDistoType1();
         // changeDistoType2();
    }

    // volume aka preamp output volume
    function changeOutputGainAmp(sliderVal) {
        // sliderVal is in [0, 10], adjust to [0, 1]
        var value = parseFloat(sliderVal/10);
        outputGain.gain.value = value;
    }

    // volume aka preamp output volume
    function changeInputGainAmp(sliderVal) {
        // sliderVal is in [0, 10], adjust to [0, 1]
        var value = parseFloat(sliderVal/10);
        inputGain.gain.value = value;
    }

    function changeMasterVolumeAmp(sliderVal) {
        // sliderVal is in [0, 10]
        var value = parseFloat(sliderVal);
        masterVolume.gain.value = value;
    }

    function changeReverbGainAmp(sliderVal) {
        // slider val in [0, 10] , adjust to [0, 1]
        var value = parseFloat(sliderVal) / 10;
        reverb.setGain(value);
    }

    function changeReverbImpulse(name) {
        reverb.loadImpulseByName(name);
    }

    function changeRoomAmp(sliderVal) {
        // slider val in [0, 10] range, adjust to [0, 1]
        console.log('change room');
        var value = parseFloat(sliderVal) / 10;
        cabinetSim.setGain(value);
    }

    function changeCabinetSimImpulse(name) {
        cabinetSim.loadImpulseByName(name);
    }

    // --------
    // PRESETS
    // --------
    function initPresets() {
        presets.push(preset1);
        presets.push(preset2);
        presets.push(preset3);        
        presets.push(preset4);
        presets.push(preset5);
        presets.push(preset6);
        presets.push(preset7);
        presets.push(preset8);

        presets.forEach(function (p, index) {
            var option = document.createElement("option");
            option.value = index;
            option.text = p.name;
            menuPresets.appendChild(option);
        });
    }

    // END PRESETS

    function bypassAmp(cb) {
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
    }

    function bypassEQAmp(cb) {
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
        
        changeOversamplingAmp: changeOversamplingAmp,
        changeOutputGainAmp: changeOutputGainAmp,
        changeInputGainAmp: changeInputGainAmp,

        changeMasterVolumeAmp: changeMasterVolumeAmp,
        changeReverbGainAmp: changeReverbGainAmp,
        changeReverbImpulse: changeReverbImpulse,
        changeCabinetSimImpulse: changeCabinetSimImpulse,
        changeRoomAmp: changeRoomAmp,
        bypassAmp: bypassAmp,
        bypassEQAmp: bypassEQAmp
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