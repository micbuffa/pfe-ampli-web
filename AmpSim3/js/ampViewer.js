class AmpViewer {

	constructor(amp, ampName) {
		this.amp = amp;
		this.ampName = ampName;
        // Distortion menus
        this.menuDisto1 = document.querySelector("#distorsionMenu1");
        this.menuDisto2 = document.querySelector("#distorsionMenu2");
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
    	this.menuDisto1.value = this.amp.preamp.distoTypes[0];
        for(var p in this.amp.preamp.wsFactory.distorsionCurves) {
            var option = document.createElement("option");
            option.value = p;
            option.text = p;
            this.menuDisto1.appendChild(option);    
        }
    }

    // Build a drop down menu with all distorsion names
    buildDistoMenu2() {
    	this.menuDisto2.value = this.amp.preamp.distoTypes[1];
        for(var p in this.amp.preamp.wsFactory.distorsionCurves) {
            var option = document.createElement("option");
            option.value = p;
            option.text = p;
            this.menuDisto2.appendChild(option);    
        }
    }

    updateDisto1Label(name) {
    	this.menuDisto1.value = name;
    }

    updateDisto2Label(name) {
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

}