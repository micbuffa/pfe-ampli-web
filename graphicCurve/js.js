var canvas, ctx;
var k;
var currentlychange;
var flag = 0;
var startY1;
var startY2
var biasX, biasY, bias1, bias2;
var navigatorName;
var p0 = {x: 0, y: 100}; //use whatever points you want obviously
var p1 = {x: 50, y: 100}; // tan
var initialP1 = {x: 50, y: 100}; // tan

var p2 = {x: 50, y: 0}; // tan
var initialP2 = {x: 50, y: 0}; // tan
var p3 = {x: 100, y: 0};
var accuracy = 0.1; //this'll give the bezier 100 segments

var angle;
var curve;

window.onload = init;

function init() {
  canvas = document.querySelector('#myCanvas');
  startY1 = document.getElementById("startY1");
  startY2 = document.getElementById("startY2");
  biasX = document.getElementById("biasX");
  biasY = document.getElementById("biasY");
  bias1 = document.getElementById("bias1");
  bias2 = document.getElementById("bias2");
  k = document.getElementById("k");
  rect = canvas.getBoundingClientRect();
  currentlychange = document.getElementById("currentlyChange");
  detectNavigator();
  ctx = canvas.getContext('2d');
  controlCanvas();
  
   angle= getLinearPartAngle();
  updateAngle();
}

function detectNavigator() {
  if(navigator.userAgent.indexOf("Chrome") != -1 )
  {
    navigatorName = "Chrome";
  }
  else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
  {
    navigatorName = "Firefox";
  }
  else
  {
    navigatorName = "Other";
  }
}

function controlCanvas() {
  // Using a flag for detecting mouse move.
  canvas.addEventListener('mousedown',function(evt){
    flag = 1;
    document.addEventListener('mousemove', mouseMove1, false);
    document.addEventListener('mouseup', mouseUp1, false);

    function mouseMove1(evt){ 
      var x = evt.clientX - canvas.offsetLeft - rect.left + 8;
      var y = evt.clientY - canvas.offsetTop - rect.left;
      // Click on the left
      if((x < (canvas.width / 2)) && (flag > 0)) {
        changeBiasP2(Math.min(100,(canvas.width)-(x*2)));
        changeBiasP1(0);
        restoreBackground();
        setCurrentAction("Currently change the Bias", canvas, "e-resize", bias2);
      }
      // Click on the right
      else if((x > (canvas.width / 2)) && (flag > 0))  {
        changeBiasP1(Math.min(100,(x*2)-(canvas.width)));
        changeBiasP2(0);
        setCurrentAction("Currently change the Bias", canvas, "e-resize", bias1);
      }
      updateAll();
    }

    function mouseUp1(evt) {
      flag = 0;
      changeMouse(canvas, "default");
      hideCurrentAction();
      restoreBackground();
      document.removeEventListener('mousemove', mouseMove1, false);
      document.removeEventListener('mouseup', mouseUp1, false);
    }
  },false);
  // Update positions and draw curves.
  updateAll();
  drawCurve();
}

function changeMouse(e, cursorstyle) {
  // Change the style of the mouse in the element selected.
  e.style.cursor=cursorstyle;
}

function setCurrentAction(action, c, cursorStyle, rangeId) {
  currentlychange.style.display="block";
  currentlychange.innerHTML = action;

  if(navigatorName == "Firefox")
  {
    changeMouse(c, cursorStyle);
    rangeId.style.backgroundColor="yellow";
  }
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
  
function changeScaleX(val) {
  //restoreBackground();
  //setCurrentAction("Currently change the Bias of X", canvas, "e-resize", biasX);
  //flag = 4;
  val = parseFloat(val);
  p2.x = val;
  initialP2.x = val;
  angle = getLinearPartAngle();
  updateAngle();
  drawCurve(); 
} 

function changeScaleY(val) {
  //restoreBackground();
  //setCurrentAction("Currently change the Bias of Y", canvas, "e-resize", biasY);
  //flag = 5;
  val = parseFloat(val);
  biasY.value = val;
  p1.x = val;
  initialP1.x = val
  
  angle = getLinearPartAngle();
  updateAngle();

  drawCurve();
}
function changeBiasX(val) {
  //restoreBackground();
  //setCurrentAction("Currently change the Bias of X", canvas, "e-resize", biasX);
  //flag = 4;
  val = parseFloat(val);
  biasX.value = val;
  p2.y = val;
  initialP2.y = val;
  

} 

function changeBiasY(val) {
  //restoreBackground();
  //setCurrentAction("Currently change the Bias of Y", canvas, "e-resize", biasY);
  //flag = 5;
  val = parseFloat(val);
  biasY.value = val;
  p1.y = val;
  initialP1.y = val;
  

}

function squeeze(val) {
  val = parseFloat(val);
  val1 = map(val, 0, 10, 0, 50);
  p2.y = val1;
  initialP2.y = val1;
  val2 = map(val, 0, 10, 100, 50);
  p1.y = val2;
  initialP1.y = val2;
  
  angle = getLinearPartAngle();
  updateAngle();

  drawCurve();  
}

function changeStartY2(val) {
  val = parseFloat(val);
  restoreBackground();
  setCurrentAction("Currently change the start of Y2", canvas, "n-resize", startY2);
  startY2.value = val;
  p3.y = val;
  p2.y = val;
  initialP2.y = val;
  flag = 3;
  
    angle = getLinearPartAngle();
  updateAngle();

  drawCurve();
}

function changeStartY1(val) {
  val = parseFloat(val);
  restoreBackground();
  setCurrentAction("Currently change the start of Y1", canvas, "n-resize", startY1);
  startY1.value = val;
  p0.y = parseInt(val);
  p1.y = val;
  initialP1.y = val;
  flag = 2;
  
    angle = getLinearPartAngle();
  updateAngle();

  drawCurve();
}

function restoreBackground() {
  var elems = document.querySelectorAll("input");
    var index = 0, length = elems.length;
    for ( ; index < length; index++) {
        elems[index].style.backgroundColor="white";
    }
}

function changeK(val) {
  restoreBackground();
  val = parseFloat(val);
  setCurrentAction("Currently change the K value", canvas, "e-resize", k);
  k.value=val;
  // first map k to [0, 100]
  flag = 4;
  var k1 = map(val, 0, 10, 100, 0);
  changeBiasX(k1);
  var k2 = map(val, 0, 10, 0, 100);
  changeBiasY(k2);
  
    angle = getLinearPartAngle();
  updateAngle();
  
  drawCurve();

}

function changeSmaller(val) {
  val = parseFloat(val);
  var startY1 = map(val, 0, 10, 100, 50);
  changeStartY1(startY1);
  var startY2 = map(val, 0, 10, 0, 50);
  changeStartY2(startY2);
} 

function changeBiasP2(val) {
  val = parseFloat(val);
  flag = 2;
  bias2.value=val;
  
  // On ne déplace que P1 le long de la pente donnée par angle
  // (angle de la partie linéaire)
  var incX = val*Math.cos(angle);
  var incY = val*Math.sin(angle);
  p2.x = initialP2.x + incX;
  p2.y = initialP2.y + incY; 
  
  
  drawCurve();
}

function changeBiasP1(val) {
  val = parseFloat(val);
  flag = 3;
  bias1.value=val;
  
  // On ne déplace que P1 le long de la pente donnée par angle
  // (angle de la partie linéaire)
  var incX = val*Math.cos(angle);
  var incY = val*Math.sin(angle);
  p1.x = initialP1.x - incX;
  p1.y = initialP1.y - incY; 
  
  drawCurve();
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
  
 drawControlPoint(p1);
 drawControlPoint(p2);
 // bias point
  var biasPoint = {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  }
  drawControlPoint(biasPoint);
 drawLine(p1, p2);
  
  updateAll();
}

function drawLine(p1, p2) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.restore();
}

function drawControlPoint(p) {
   ctx.save();
   ctx.translate(p.x, p.y);
   ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}


function getLinearPartAngle() {
   curve = returnCurve();
  console.log("nb points = " + curve.length);
  var midPointIndex = Math.abs(curve.length/2);
  
  var p1X = map(midPointIndex, 0, curve.length, -1, 1);
  var p1Y = curve[midPointIndex];
  var p2X = map(midPointIndex+1, 0, curve.length, -1, 1);
  var p2Y = curve[midPointIndex+1];
  
  console.log(`P1x = ${p1X} + P1Y = ${p1Y}`);
  console.log(`P2x = ${p2X} + P2Y = ${p2Y}`);
  
  var dx = p1X - p2X;
  var dy = p1Y - p2Y;
  var angle = Math.atan2(dy, dx);
  console.log("angle radians = " + angle + " en deg " + 180*angle/Math.PI);
  
  return angle;
}

function returnCurve() {
  console.log("return curve p2  = " + p2.x + " " + p2.y)
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
  
  return curve;
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
  var val = p.x;
  spanPx.innerHTML = val;
   var spanPy = document.querySelector("#" + "p"+index+"y");
  val = p.y;
  spanPy.innerHTML = val;
}

function updateAngle() {
  var spanAngle = document.querySelector("#angle");
  spanAngle.innerHTML = (180*angle/Math.PI) + " degres";
}