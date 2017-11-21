var canvas, ctx;
var currentlychange;
var flag;
var startY1;
var startY2;
var p0 = {x: 0, y: 100}; //use whatever points you want obviously
var p1 = {x: 50, y: 100}; // tan
var p2 = {x: 50, y: 0}; // tan
var p3 = {x: 100, y: 0};
var accuracy = 0.1; //this'll give the bezier 100 segments
window.onload = init;

function init() {
  canvas = document.querySelector('#myCanvas');
  startY1 = document.getElementById("startY1");
  startY2 = document.getElementById("startY2");
  currentlychange = document.getElementById("currentlyChange");
  ctx = canvas.getContext('2d');
  controlCanvas();
}

function controlCanvas() {
  // Using a flag for detecting mouse move.
  canvas.addEventListener('mousedown',function(evt){ 
    flag = 1;
    canvas.addEventListener('mousemove',function(evt){ 
      if(flag == 1) { 
        updatePos(evt);
      }
    },false);
    canvas.addEventListener('mouseup',function(evt){ 
      flag = 0;
      changeMouse(canvas, "default");
      hideCurrentAction();
    },false);
  },false);
  // Update positions and draw curves.
  updateAll();
  drawCurve();
}

function updatePos(evt) {
  var x = evt.clientX - canvas.offsetLeft;
  var y = evt.clientY - canvas.offsetTop;
  // Click on the extreme left = modify p1 and p1
  if(x < (canvas.width / 15)) {
    changeStartY1(y);
  }
  // Click on the extreme right = modify p2 and p3
  else if(x > (canvas.width - (canvas.width / 15)))  {
    changeStartY2(y);
  }
  else if(y < (canvas.height / 2)) {
    changeBiasX(x);
  }
  else if(y > (canvas.height / 2)) {
    changeBiasY(x);
  }
  updateAll();
}

function changeMouse(e, cursorstyle) {
  // Change the style of the mouse in the element selected.
  e.style.cursor=cursorstyle;
}

function setCurrentAction(action) {
    currentlychange.style.display="block";
    currentlychange.innerHTML = action;
}

function hideCurrentAction() {
  currentlychange.style.display="none";
}
            
function bezier(t, p0, p1, p2, p3){
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
  
function changeBiasX(val) {
  changeMouse(canvas, "e-resize");
  setCurrentAction("Currently change the Bias of X");
  biasX.value = val;
  p2.x = val;
  drawCurve(); 
} 

function changeBiasY(val) {
  changeMouse(canvas, "e-resize");
  setCurrentAction("Currently change the Bias of Y");
  biasY.value = val;
  p1.x = val;
  drawCurve();
}

function squeeze(val) {
  val = parseFloat(val);
  val1 = map(val, 0, 10, 0, 50);
  p2.y = val1;
  val2 = map(val, 0, 10, 100, 50);
  p1.y = val2;
  drawCurve();  
}

function changeStartY2(val) {
  changeMouse(canvas, "n-resize");
  setCurrentAction("Currently change the start of Y2");
  startY2.value = val;
  p3.y = val;
  p2.y = val;
  drawCurve();
}

function changeStartY1(val) {
  changeMouse(canvas, "n-resize");
  setCurrentAction("Currently change the start of Y1");
  startY1.value = val;
  p0.y = parseInt(val);
  p1.y = val;
  drawCurve();
}


function changeK(val) {
  val = parseFloat(val);
  // first map k to [0, 100]
  var k1 = map(val, 0, 10, 100, 0);
  changeBiasX(k1);
  var k2 = map(val, 0, 10, 0, 100);
  changeBiasY(k2);
}

function changeSmaller(val) {
  val = parseFloat(val);
  var startY1 = map(val, 0, 10, 100, 50);
  changeStartY1(startY1);
  var startY2 = map(val, 0, 10, 0, 50);
  changeStartY2(startY2);
} 

function changeBias(val) {
  val = parseFloat(val);
  if(val <= 5) {
    var sx = map(val, 0, 5, 0, 50);
    changeBiasX(sx);

  } else if(val > 5) {
    var sy = map(val, 5, 10, 50, 100);
    changeBiasY(sy);
  }
}

function drawCurve() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  // i entre 0 et 1
  for (var i=0; i<1; i+=accuracy){
      var p = bezier(i, p0, p1, p2, p3);
      ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  
  updateAll();
}

function returnCurve() {
   var n_samples = 44100,
   accuracy = 1/n_samples,
   curve = new Float32Array(n_samples),
   index = 0;
  
  curve[index++] = map(p0.y, 0, 100, -1, 1);
  
  // 
  for (var i=0; i<1; i+=accuracy){
    var p = bezier(i, p0, p1, p2, p3);
    curve[index++] = map(p.y, 0, 100, -1, 1);
  }
}
 
// maps a value from [istart, istop] into [ostart, ostop]
function map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

// Update p values
function updateAll() {
  updatePValue(p0, 0);
  updatePValue(p1, 1);
  updatePValue(p2, 2);
  updatePValue(p3, 3);
}

function updatePValue(p, index) {
  var spanPx = document.querySelector("#" + "p"+index+"x");
  spanPx.innerHTML = p.x;
   var spanPy = document.querySelector("#" + "p"+index+"y");
  spanPy.innerHTML = p.y;
}
