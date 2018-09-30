// --------- CURVE DRAWER -------
// first parameter = curveDrawer to use, second = curve to draw 
function drawCurve(cd, c) {
  cd.setCurve(c);
  cd.drawAxis();
  cd.drawCurve('lightGreen', 2);
}

function CurveDrawer(canvasId) {
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas.getContext('2d');
  this.width = this.canvas.width;
  this.height = this.canvas.height;
  this.curve = [];
  
  this.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  this.drawAxis = function() {
    this.ctx.save();
        this.ctx.strokeStyle = '#ccc';
    this.ctx.lineWidth = 1;
    // x axis
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height / 2);
    this.ctx.lineTo(this.width, this.height / 2);
    this.ctx.stroke();
    // y axis
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width / 2, this.height);
    this.ctx.stroke();
    
    this.ctx.restore();
  };
  
  this.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  };
  
  this.drawCurve = function(color, lineWidth) {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(this.height, (this.curve[0] + 1 ) * this.width / 2);
    
    for (var i=0; i < this.width; i++ ) {
      var x = this.height - i;
      var y = (this.curve[i] + 1 ) * this.width / 2;
      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
    this.ctx.restore();
  };
  
  this.drawControlsPoint = function(points) {
	var p1 = points[0];
	var p2 = points[3];
	this.ctx.save();
	this.ctx.translate(p1.x,p1.y);
	this.ctx.beginPath();
	this.ctx.fillStyle = "white";
	this.ctx.arc(0, 0, 5, 0, Math.PI*2);
	this.ctx.fill();
	this.ctx.restore();
	this.ctx.save();
	this.ctx.translate(p2.x,p2.y);
	this.ctx.beginPath();
	this.ctx.fillStyle = "white";
	this.ctx.arc(0, 0, 5, 0, Math.PI*2);
	this.ctx.fill();
	this.ctx.restore();
  };
  
  this.drawLine = function(p1, p2) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.strokeStyle = "white";
	this.ctx.moveTo(p1.x, p1.y);
	this.ctx.lineTo(p2.x, p2.y);
	this.ctx.stroke();
	this.ctx.restore();
}

  this.drawControlPoint = function(p) {
	this.ctx.save();
	this.ctx.translate(p.x, p.y);
	this.ctx.beginPath();
	this.ctx.fillStyle = "white";
	this.ctx.arc(0, 0, 3, 0, Math.PI*2);
	this.ctx.fill();
	this.ctx.restore();
  }
  
  this.makeCurve = function(equation, minX, maxX) {
    var range = maxX - minX;
    // x and equation(x) in [-1, 1]
    this.curve = new Float32Array(this.width);
    // range goes from -1 to +1 -> 2
    var incX = range / this.width;
    
    var x = minX;
    for (var i=0; i < this.width; i++) {
      this.curve[i] = equation(x);
      x+= incX;
    }
  };
  
  this.setCurve = function(c) {
    for (var i=0; i < this.width; i++) {
      if (c != null) {
        var x = Math.round(i*c.length/this.width);
        this.curve[i] = c[x];
      }
    }
  };
  
  // inits
  this.drawAxis();
}
