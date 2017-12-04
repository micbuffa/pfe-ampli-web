// ------- CONVOLVER, used for both reverb and cabinet simulation -------
function Convolver(context, impulses, menuId) {
    var convolverNode, convolverGain, directGain;
    // create source and gain node
    var inputGain = context.createGain();
    var outputGain = context.createGain();
    var decodedImpulse;

    var IRs = impulses;

    var currentImpulse = IRs[0];
    var defaultImpulseURL = IRs[0].url;

    convolverNode = context.createConvolver();
    convolverNode.buffer = decodedImpulse;

    convolverGain = context.createGain();
    convolverGain.gain.value = 0;

    directGain = context.createGain();
    directGain.gain.value = 1;

    buildAudioGraphConvolver();
    setGain(0.2);
    loadImpulseByUrl(defaultImpulseURL);
    

    function loadImpulseByUrl(url) {
        // Load default impulse
        const samples = Promise.all([loadSample(context,url)]).then(setImpulse);
    }

    function loadImpulseByName(name, type) {
        if (name === undefined) {
            name = IRs[0].name;
            console.log("loadImpulseByName: name undefined, loading default impulse " + name);
        }

        var url = "none";
        // get url corresponding to name
        for (var i=0; i < IRs.length; i++) {
            if (IRs[i].name === name) {
                url = IRs[i].url;
                currentImpulse = IRs[i];
                break;
            }
        }

        if (url === "none") {
            console.log("ERROR loading reverb impulse name = " + name);
        } else {
            console.log("loadImpulseByName loading " + currentImpulse.name);
            loadImpulseByUrl(url);
        }
    }

    function loadImpulseFromMenu(val) {
        var url = IRs[val].url;
        currentImpulse = IRs[val];
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

    //--------------------------------------
    // API : exposed methods and properties
    // -------------------------------------
    return {
        input: inputGain,
        output: outputGain,
        IRs: IRs, 
        setGain: setGain,
        getGain: getGain,
        getName: getName,
        loadImpulseByName: loadImpulseByName,
        loadImpulseFromMenu: loadImpulseFromMenu
    };
}