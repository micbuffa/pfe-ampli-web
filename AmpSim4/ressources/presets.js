// Can be converted to JSON

var preset1 = {
    "name": "Hard Rock classic 1",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -5,
    "gain1": 1,
    "distoName1": "asymetric",
    "K1": "7.8",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "notSoDistorded",
    "K2": "7.8",
    "OG": "7.0",
    "BF": "8.2",
    "MF": "8.2",
    "TF": "3.8",
    "PF": "6.9",
    "EQ": [5, 11, -6, -10, 7, 2],
    "MV": "7.2",
    "RN": "Fender Hot Rod",
    "RG": "2.0",
    "CN": "Marshall 1960, axis",
    "CG": "9.4"
};

var preset2 = {
    "name": "Clean and Warm",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": 1.600000023841858,
    "gain1": 1,
    "distoName1": "asymetric",
    "K1": "7.8",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "standard",
    "K2": "0.9",
    "OG": "7.0",
    "BF": "6.7",
    "MF": "7.1",
    "TF": "3.2",
    "PF": "6.9",
    "EQ": [10, 5, -7, -7, 12, 0],
    "MV": "7.2",
    "RN": "Fender Hot Rod",
    "RG": "1.4",
    "CN": "Marshall 1960, axis",
    "CG": "8.8"
};

var preset3 = {
    "name": "Strong and Warm",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -1,
    "gain1": 1.0299999713897705,
    "distoName1": "asymetric",
    "K1": "7.8",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "superClean",
    "K2": "7.8",
    "OG": "7.0",
    "BF": "8.2",
    "MF": "6.7",
    "TF": "5.0",
    "PF": "6.9",
    "EQ": [0, 0, 0, -1, 0, 1],
    "MV": "5.9",
    "RN": "Fender Hot Rod",
    "RG": "1.1",
    "CN": "Vox Custom Bright 4x12 M930 Axis 1",
    "CG": "8.0"
};

//preset4 = {"name":"Fat sound","boost":true,"LS1Freq":720,"LS1Gain":-5.800000190734863,"LS2Freq":320,"LS2Gain":6.599999904632568,"gain1":0.11999999731779099,"distoName1":"asymetric","K1":"5.4",
//"HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-5.199999809265137,"gain2":1,"distoName2":"standard","K2":"5.4","OG":"3.5","BF":"3.2","MF":"5.0","TF":"5.0","PF":"9.7",
//"EQ":[1,0,-6,-8,-6,-30],"MV":"3.1","RN":"Fender Hot Rod","RG":"0.0","CN":"Marshall 1960, axis","CG":"3.4"};

var preset4 = {
    "name": "Clean no reverb",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -6.300000190734863,
    "gain1": 1,
    "distoName1": "asymetric",
    "K1": "2.1",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "crunch",
    "K2": "2.1",
    "OG": "7.0",
    "BF": "6.7",
    "MF": "5.0",
    "TF": "5.0",
    "PF": "8.9",
    "EQ": [4, 12, -8, -8, 12, 12],
    "MV": "3.7",
    "RN": "Fender Hot Rod",
    "RG": "0.0",
    "CN": "Marshall 1960, axis",
    "CG": "4.5"
};

var preset5 = {
    "name": "Another Clean Sound",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -6.300000190734863,
    "gain1": 1,
    "distoName1": "asymetric",
    "K1": "6.4",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "crunch",
    "K2": "6.4",
    "OG": "7.0",
    "BF": "6.7",
    "MF": "5.0",
    "TF": "5.0",
    "PF": "8.9",
    "EQ": [4, 12, -8, -8, 12, 12],
    "MV": "3.7",
    "RN": "Fender Hot Rod",
    "RG": "2",
    "CN": "Marshall 1960, axis",
    "CG": "4.5"
};

var preset6 = {
    "name": "Mostly even harmonics",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -7.5,
    "gain1": 1,
    "distoName1": "standard",
    "K1": "6.7",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "standard",
    "K2": "6.7",
    "OG": "7.0",
    "BF": "4.3",
    "MF": "2.6",
    "TF": "6.1",
    "PF": "4.2",
    "EQ": [5, 12, -5, -10, 2, 10],
    "MV": "1.7",
    "RN": "Fender Hot Rod",
    "RG": "0.0",
    "CN": "Vintage Marshall 1",
    "CG": "8.4"
};

var preset7 = {
    "name": "Hard Rock classic 2",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -10.199999809265137,
    "gain1": 1,
    "distoName1": "standard",
    "K1": "5.2",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "notSoDistorded",
    "K2": "5.1",
    "OG": "7.0",
    "BF": "8.7",
    "MF": "8.0",
    "TF": "3.8",
    "PF": "9.4",
    "EQ": [12, 8, -6, -10, 7, 2],
    "MV": "5.5",
    "RN": "Fender Hot Rod",
    "RG": "0.7",
    "CN": "Marshall 1960, axis",
    "CG": "9.2"
};

var preset8 = {
    "name": "SuperClean/Jazz",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -6.300000190734863,
    "gain1": 1,
    "distoName1": "crunch",
    "K1": "5.4",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "crunch",
    "K2": "5.4",
    "OG": "7.0",
    "BF": "7.0",
    "MF": "5.1",
    "TF": "5.2",
    "PF": "3.1",
    "EQ": [10, 7, 0, -10, 5, 12],
    "MV": "3.8",
    "RN": "Fender Hot Rod",
    "RG": "1.5",
    "CN": "Marshall 1960, axis",
    "CG": "4.5"
};

var preset9 = {
    "name": "Metal 1",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -10.199999809265137,
    "gain1": 1,
    "distoName1": "standard",
    "K1": "5.9",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "notSoDistorded",
    "K2": "5.9",
    "OG": "3.9",
    "BF": "8.7",
    "MF": "8.0",
    "TF": "3.8",
    "PF": "6.0",
    "EQ": [12, 8, -6, -10, 7, 2],
    "MV": "6.0",
    "RN": "Fender Hot Rod",
    "RG": "0.7",
    "CN": "Marshall 1960, axis",
    "CG": "9.2",
    "PREAMP_BEFORE_TONESTACK": false,
    "PREAMP_EXTRA_STAGES": [],
    "PA_ENABLED": true,
    "PA_DISTORSION_CURVE": "clean",
    "PA_K": "8.0",
    "PA_NEGATIVE_GAIN": -0.4000000059604645,
    "PA_PRESENCE_GAIN_RANGE": 4,
    "PA_PRESENCE_FILTERS_PARAMS": [{
        "Q": 0.000009999999747378752,
        "frequency": 40,
        "gain": 12
    }, {
        "Q": 0,
        "frequency": 80,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 230,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 2000,
        "gain": 2.4000000953674316
    }, {
        "Q": 1,
        "frequency": 4000,
        "gain": 2.4000000953674316
    }, {
        "Q": 1,
        "frequency": 10000,
        "gain": 0
    }, {
        "Q": 0.000009999999747378752,
        "frequency": 18000,
        "gain": 12
    }],
    "PA_BOOST_GAIN": 2.5999999046325684
};

var preset10 = {
    "name": "Metal 5",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -10.199999809265137,
    "gain1": 1,
    "distoName1": "standard",
    "K1": "5.9",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "notSoDistorded",
    "K2": "5.9",
    "OG": "4.6",
    "BF": "8.7",
    "MF": "6.9",
    "TF": "2.5",
    "PF": "5.0",
    "EQ": [12, 8, -6, -10, 7, 2],
    "MV": "6.3",
    "RN": "Fender Hot Rod",
    "RG": "0.7",
    "CN": "Marshall 1960, axis",
    "CG": "8.2",
    "PREAMP_BEFORE_TONESTACK": false,
    "PREAMP_EXTRA_STAGES": [{
        "type": "asymetric",
        "k": "3.2"
    }, {
        "type": "clean",
        "k": "8.8"
    }, {
        "type": "clean",
        "k": "8.8"
    }],
    "PA_ENABLED": true,
    "PA_DISTORSION_CURVE": "clean",
    "PA_K": "8.0",
    "PA_NEGATIVE_GAIN": -0.4000000059604645,
    "PA_PRESENCE_GAIN_RANGE": 4,
    "PA_PRESENCE_FILTERS_PARAMS": [{
        "Q": 0.000009999999747378752,
        "frequency": 40,
        "gain": 12
    }, {
        "Q": 0,
        "frequency": 80,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 230,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 752.6100463867188,
        "gain": -3.5199999809265137
    }, {
        "Q": 1,
        "frequency": 1429.5106201171875,
        "gain": -3.5199999809265137
    }, {
        "Q": 1,
        "frequency": 10000,
        "gain": 0
    }, {
        "Q": 0.000009999999747378752,
        "frequency": 18000,
        "gain": 12
    }],
    "PA_BOOST_GAIN": 2.3
};

var preset11 = {
    "name": "Hard Rock ",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -10.199999809265137,
    "gain1": 1,
    "distoName1": "standard",
    "K1": "5.2",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "notSoDistorded",
    "K2": "5.1",
    "OG": "6.5",
    "BF": "8.4",
    "MF": "8.0",
    "TF": "3.8",
    "PF": "5.0",
    "EQ": [12, 8, -6, -10, 7, 2],
    "MV": "7",
    "RN": "Fender Hot Rod",
    "RG": "0.7",
    "CN": "Marshall 1960, axis",
    "CG": "9.2",
    "PREAMP_BEFORE_TONESTACK": true,
    "PREAMP_EXTRA_STAGES": [],
    "PA_ENABLED": true,
    "PA_LO_HI_CUT_FILTERS_ENABLED": true,
    "PA_DISTORSION_CURVE": "clean",
    "PA_K": "8.0",
    "PA_NEGATIVE_GAIN": -0.4000000059604645,
    "PA_PRESENCE_GAIN_RANGE": 4,
    "PA_PRESENCE_FILTERS_PARAMS": [{
        "Q": 0.000009999999747378752,
        "frequency": 40,
        "gain": 12
    }, {
        "Q": 0,
        "frequency": 80,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 230,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 2000,
        "gain": 2.0799999237060547
    }, {
        "Q": 1,
        "frequency": 4000,
        "gain": 2.0799999237060547
    }, {
        "Q": 1,
        "frequency": 10000,
        "gain": 0
    }, {
        "Q": 0.000009999999747378752,
        "frequency": 18000,
        "gain": 12
    }],
    "PA_BOOST_GAIN": 3.2
}

var preset12 = {
    "name": "Heavy Blues",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -10.199999809265137,
    "gain1": 1,
    "distoName1": "asymetric",
    "K1": "5.8",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "notSoDistorded",
    "K2": "5.8",
    "OG": "5.0",
    "BF": "8.4",
    "MF": "6.5",
    "TF": "3.8",
    "PF": "5.0",
    "EQ": [12, 8, -6, -10, 7, 2],
    "MV": 8.333333333333334,
    "RN": "Fender Hot Rod",
    "RG": "1.2",
    "CN": "Marshall 1960, axis",
    "CG": "9.2",
    "PREAMP_BEFORE_TONESTACK": true,
    "PREAMP_EXTRA_STAGES": [{
        "type": "clean",
        "k": "7.7"
    }, {
        "type": "clean",
        "k": "7.8"
    }],
    "PA_ENABLED": true,
    "PA_LO_HI_CUT_FILTERS_ENABLED": true,
    "PA_DISTORSION_CURVE": "clean",
    "PA_K": "8.0",
    "PA_NEGATIVE_GAIN": -0.4000000059604645,
    "PA_PRESENCE_GAIN_RANGE": 4,
    "PA_PRESENCE_FILTERS_PARAMS": [{
        "Q": 0.000009999999747378752,
        "frequency": 40,
        "gain": 12
    }, {
        "Q": 0,
        "frequency": 80,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 230,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 2000,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 4000,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 10000,
        "gain": 0
    }, {
        "Q": 0.000009999999747378752,
        "frequency": 18000,
        "gain": 12
    }],
    "PA_BOOST_GAIN": 4
}
var preset13 = {
    "name": "Iron Maiden",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -10.199999809265137,
    "gain1": 1,
    "distoName1": "standard",
    "K1": "6.9",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "notSoDistorded",
    "K2": "6.9",
    "OG": "6.5",
    "BF": "4.9",
    "MF": "6.5",
    "TF": "3.8",
    "PF": "5.0",
    "EQ": [12, 8, -6, -10, 7, 2],
    "MV": "6.3",
    "RN": "Fender Hot Rod",
    "RG": "1.1",
    "CN": "Marshall 1960, axis",
    "CG": "9.2",
    "PREAMP_BEFORE_TONESTACK": false,
    "PREAMP_EXTRA_STAGES": [{
        "type": "clean",
        "k": "-3.2"
    }, {
        "type": "clean",
        "k": "7.8"
    }, {
        "type": "clean",
        "k": "7.8"
    }],
    "PA_ENABLED": true,
    "PA_LO_HI_CUT_FILTERS_ENABLED": true,
    "PA_DISTORSION_CURVE": "clean",
    "PA_K": "8.0",
    "PA_NEGATIVE_GAIN": -0.4000000059604645,
    "PA_PRESENCE_GAIN_RANGE": 4,
    "PA_PRESENCE_FILTERS_PARAMS": [{
        "Q": 0.000009999999747378752,
        "frequency": 40,
        "gain": 12
    }, {
        "Q": 0,
        "frequency": 80,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 230,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 2000,
        "gain": 0.23999999463558197
    }, {
        "Q": 1,
        "frequency": 4000,
        "gain": 0.23999999463558197
    }, {
        "Q": 1,
        "frequency": 10000,
        "gain": 0
    }, {
        "Q": 0.000009999999747378752,
        "frequency": 18000,
        "gain": 12
    }],
    "PA_BOOST_GAIN": 3.9
}

var preset14 = {
    "name": "Clean",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -6.300000190734863,
    "gain1": 1,
    "distoName1": "asymetric",
    "K1": "4.0",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "crunch",
    "K2": "4.0",
    "OG": "5.0",
    "BF": "8.0",
    "MF": "6.1",
    "TF": "4.0",
    "PF": "5.0",
    "EQ": [4, 12, -8, -8, 12, 12],
    "MV": 7.000000000000001,
    "RN": "Fender Hot Rod",
    "RG": "1.8",
    "CN": "Vox Custom Bright 4x12 M930 Axis 1",
    "CG": "3.3",
    "PREAMP_BEFORE_TONESTACK": false,
    "PREAMP_EXTRA_STAGES": [{
        "type": "clean",
        "k": "7.8"
    }, {
        "type": "clean",
        "k": "7.8"
    }, {
        "type": "clean",
        "k": "7.8"
    }],
    "PA_ENABLED": true,
    "PA_LO_HI_CUT_FILTERS_ENABLED": true,
    "PA_DISTORSION_CURVE": "clean",
    "PA_K": "8.0",
    "PA_NEGATIVE_GAIN": -0.4000000059604645,
    "PA_PRESENCE_GAIN_RANGE": 4,
    "PA_PRESENCE_FILTERS_PARAMS": [{
        "Q": 0.000009999999747378752,
        "frequency": 40,
        "gain": 12
    }, {
        "Q": 0,
        "frequency": 80,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 230,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 2000,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 4000,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 10000,
        "gain": 0
    }, {
        "Q": 0.000009999999747378752,
        "frequency": 18000,
        "gain": 12
    }],
    "PA_BOOST_GAIN": 4
}
var preset15 = {
    "name": "Clean with litlle crunch",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -6.300000190734863,
    "gain1": 1,
    "distoName1": "smooth",
    "K1": "7.1",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "asymetric",
    "K2": "7.1",
    "OG": "5.0",
    "BF": "8.0",
    "MF": "6.1",
    "TF": "4.0",
    "PF": "5.0",
    "EQ": [4, 7, 6, 2, 4, 12],
    "MV": 7.999999999999999,
    "RN": "Fender Hot Rod",
    "RG": "1.2",
    "CN": "Fender Champ, axis",
    "CG": "7.0",
    "PREAMP_BEFORE_TONESTACK": true,
    "PREAMP_EXTRA_STAGES": [{
        "type": "clean",
        "k": "7.8"
    }, {
        "type": "clean",
        "k": "7.8"
    }],
    "PA_ENABLED": true,
    "PA_LO_HI_CUT_FILTERS_ENABLED": true,
    "PA_DISTORSION_CURVE": "clean",
    "PA_K": "8.0",
    "PA_NEGATIVE_GAIN": -0.4000000059604645,
    "PA_PRESENCE_GAIN_RANGE": 4,
    "PA_PRESENCE_FILTERS_PARAMS": [{
        "Q": 0.000009999999747378752,
        "frequency": 40,
        "gain": 12
    }, {
        "Q": 0,
        "frequency": 80,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 230,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 2000,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 4000,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 10000,
        "gain": 0
    }, {
        "Q": 0.000009999999747378752,
        "frequency": 18000,
        "gain": 12
    }],
    "PA_BOOST_GAIN": 3.5999999046325684
}

var preset16 = {
    "name": "Black Sabbath",
    "boost": false,
    "LS1Freq": 720,
    "LS1Gain": -6,
    "LS2Freq": 320,
    "LS2Gain": -6.300000190734863,
    "gain1": 1,
    "distoName1": "standard",
    "K1": "5.3",
    "HP1Freq": 6,
    "HP1Q": 0.707099974155426,
    "LS3Freq": 720,
    "LS3Gain": -6,
    "gain2": 1,
    "distoName2": "standard",
    "K2": "5.3",
    "OG": "5.0",
    "BF": "8.0",
    "MF": "6.1",
    "TF": "4.0",
    "PF": "5.0",
    "EQ": [4, 7, 6, 2, 4, 12],
    "MV": "7",
    "RN": "Fender Hot Rod",
    "RG": "1.2",
    "CN": "Fender Champ, axis",
    "CG": "9.3",
    "PREAMP_BEFORE_TONESTACK": true,
    "PREAMP_EXTRA_STAGES": [{
        "type": "clean",
        "k": "7.7"
    }, {
        "type": "clean",
        "k": "7.8"
    }],
    "PA_ENABLED": true,
    "PA_LO_HI_CUT_FILTERS_ENABLED": true,
    "PA_DISTORSION_CURVE": "clean",
    "PA_K": "8.0",
    "PA_NEGATIVE_GAIN": -0.4000000059604645,
    "PA_PRESENCE_GAIN_RANGE": 4,
    "PA_PRESENCE_FILTERS_PARAMS": [{
        "Q": -0.18333333730697632,
        "frequency": 17.948720932006836,
        "gain": 12
    }, {
        "Q": 0,
        "frequency": 23.82061195373535,
        "gain": 0.699999988079071
    }, {
        "Q": 1,
        "frequency": 496.9219665527344,
        "gain": -2.9833333492279053
    }, {
        "Q": 1,
        "frequency": 242.600830078125,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 4000,
        "gain": 0
    }, {
        "Q": 1,
        "frequency": 8423.3046875,
        "gain": 0.7888888716697693
    }, {
        "Q": -0.1388888955116272,
        "frequency": 8265.857421875,
        "gain": 12
    }],
    "PA_BOOST_GAIN": 3.5
}

var preset17 = {"name":"Another Clean Sound 2","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-6.300000190734863,"gain1":0.28999999165534973,"distoName1":"asymetric","K1":"6.7","HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-1.2000000476837158,"gain2":0.1899999976158142,"distoName2":"crunch","K2":"6.7","OG":"5.0","BF":"8.1","MF":"4.4","TF":"5.2","PF":"5.0","EQ":[12,12,-8,-8,12,12],"MV":3.666666666666667,"RN":"Fender Hot Rod","RG":"3.3","CN":"Fender Champ, axis","CG":"0.1","PREAMP_BEFORE_TONESTACK":true,"PREAMP_EXTRA_STAGES":[{"type":"clean","k":"3.2"},{"type":"clean","k":"8.8"}],"PA_ENABLED":true,"PA_LO_HI_CUT_FILTERS_ENABLED":true,"PA_DISTORSION_CURVE":"clean","PA_K":"8.0","PA_NEGATIVE_GAIN":-0.4000000059604645,"PA_PRESENCE_GAIN_RANGE":4,"PA_PRESENCE_FILTERS_PARAMS":[{"Q":0.000009999999747378752,"frequency":40,"gain":12},{"Q":0,"frequency":80,"gain":0},{"Q":1,"frequency":230,"gain":0},{"Q":1,"frequency":2000,"gain":0},{"Q":1,"frequency":4000,"gain":0},{"Q":1,"frequency":10000,"gain":0},{"Q":0.000009999999747378752,"frequency":18000,"gain":12}],"PA_BOOST_GAIN":52.633331298828125}