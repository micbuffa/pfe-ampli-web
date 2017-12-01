// Can be converted to JSON

var preset1 = {"name":"Hard Rock classic 1","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-5,"gain1":1,"distoName1":"asymetric","K1":"7.8",
    "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"notSoDistorded","K2":"7.8","OG":"7.0","BF":"8.2","MF":"8.2","TF":"3.8","PF":"6.9",
    "EQ":[5,11,-6,-10,7,2],"MV":"7.2","RN":"Fender Hot Rod","RG":"2.0","CN":"Marshall 1960, axis","CG":"9.4"};

var preset2 = {"name":"Clean and Warm","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":1.600000023841858,"gain1":1,"distoName1":"asymetric","K1":"7.8",
    "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"standard","K2":"0.9","OG":"7.0","BF":"6.7","MF":"7.1","TF":"3.2","PF":"6.9",
    "EQ":[10,5,-7,-7,12,0],"MV":"7.2","RN":"Fender Hot Rod","RG":"1.4","CN":"Marshall 1960, axis","CG":"8.8"};

var preset3 = {"name":"Strong and Warm","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-1,"gain1":1.0299999713897705,"distoName1":"asymetric","K1":"7.8",
    "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"superClean","K2":"7.8","OG":"7.0","BF":"8.2","MF":"6.7","TF":"5.0","PF":"6.9",
    "EQ":[0,0,0,-1,0,1],"MV":"5.9","RN":"Fender Hot Rod","RG":"1.1","CN":"Vox Custom Bright 4x12 M930 Axis 1","CG":"8.0"};

//preset4 = {"name":"Fat sound","boost":true,"LS1Freq":720,"LS1Gain":-5.800000190734863,"LS2Freq":320,"LS2Gain":6.599999904632568,"gain1":0.11999999731779099,"distoName1":"asymetric","K1":"5.4",
//"HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-5.199999809265137,"gain2":1,"distoName2":"standard","K2":"5.4","OG":"3.5","BF":"3.2","MF":"5.0","TF":"5.0","PF":"9.7",
//"EQ":[1,0,-6,-8,-6,-30],"MV":"3.1","RN":"Fender Hot Rod","RG":"0.0","CN":"Marshall 1960, axis","CG":"3.4"};

var preset4 = {"name":"Clean no reverb","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-6.300000190734863,"gain1":1,"distoName1":"asymetric","K1":"2.1",
    "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"crunch","K2":"2.1","OG":"7.0","BF":"6.7","MF":"5.0","TF":"5.0","PF":"8.9",
    "EQ":[4,12,-8,-8,12,12],"MV":"3.7","RN":"Fender Hot Rod","RG":"0.0","CN":"Marshall 1960, axis","CG":"4.5"};

var preset5 = {"name":"Another Clean Sound","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-6.300000190734863,"gain1":1,"distoName1":"asymetric","K1":"6.4",
    "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"crunch","K2":"6.4","OG":"7.0","BF":"6.7","MF":"5.0","TF":"5.0","PF":"8.9",
    "EQ":[4,12,-8,-8,12,12],"MV":"3.7","RN":"Fender Hot Rod","RG":"2","CN":"Marshall 1960, axis","CG":"4.5"};

var preset6 = {"name":"Mostly even harmonics","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-7.5,"gain1":1,"distoName1":"standard","K1":"6.7",
    "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"standard","K2":"6.7","OG":"7.0","BF":"4.3","MF":"2.6","TF":"6.1","PF":"4.2",
    "EQ":[5,12,-5,-10,2,10],"MV":"1.7","RN":"Fender Hot Rod","RG":"0.0","CN":"Vintage Marshall 1","CG":"8.4"};

var preset7 = {"name":"Hard Rock classic 2","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-10.199999809265137,"gain1":1,"distoName1":"standard","K1":"5.2",
    "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"notSoDistorded","K2":"5.1","OG":"7.0","BF":"8.7","MF":"8.0","TF":"3.8","PF":"9.4",
    "EQ":[12,8,-6,-10,7,2],"MV":"5.5","RN":"Fender Hot Rod","RG":"0.7","CN":"Marshall 1960, axis","CG":"9.2"};

var preset8 = {"name":"SuperClean/Jazz","boost":false,"LS1Freq":720,"LS1Gain":-6,"LS2Freq":320,"LS2Gain":-6.300000190734863,"gain1":1,"distoName1":"crunch","K1":"5.4",
    "HP1Freq":6,"HP1Q":0.707099974155426,"LS3Freq":720,"LS3Gain":-6,"gain2":1,"distoName2":"crunch","K2":"5.4","OG":"7.0","BF":"7.0","MF":"5.1","TF":"5.2","PF":"3.1",
    "EQ":[10,7,0,-10,5,12],"MV":"3.8","RN":"Fender Hot Rod","RG":"1.5","CN":"Marshall 1960, axis","CG":"4.5"};