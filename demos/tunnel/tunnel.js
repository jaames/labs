// Very basic Matrix class, only works on 4x4 matrixes and provides some useful utils for common transform matrices
class Matrix {
  constructor(m){
    this.m = m ? m : Array(16).fill(0);
  }

  multiply(matrix) {
    // modified from https://evanw.github.io/lightgl.js/docs/matrix.html#section-10
    var a = this.m;
    var b = (matrix instanceof Matrix) ? matrix.m : matrix;
    var result = Array(16);
    result[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
    result[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
    result[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
    result[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];
    result[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
    result[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
    result[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
    result[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];
    result[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
    result[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
    result[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
    result[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];
    result[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
    result[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
    result[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
    result[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];
    this.m = result;
    return this;
  }

  static identity() {
    var m = Array(16);
    m[0] = m[5] = m[10] = m[15] = 1;
    m[1] = m[2] = m[3] = m[4] = m[6] = m[7] = m[8] = m[9] = m[11] = m[12] = m[13] = m[14] = 0;
    return new Matrix(m);
  }

  static translate(x, y, z) {
    return new Matrix([
      1, 0, 0, x || 0,
      0, 1, 0, y || 0,
      0, 0, 1, z || 0,
      0, 0, 0, 1,
    ]);
  }

  static scale(x, y, z) {
    return new Matrix([
      x || 1, 0, 0, 0,
      0, y || 1, 0, 0,
      0, 0, z || 1, 0,
      0, 0, 0, 1,
    ]);
  }

  static rotateX(angle) {
    var s = Math.sin(angle), c = Math.cos(angle);
    return new Matrix([
      1, 0, 0, 0,
      0, c, -s, 0,
      0, s, c, 0,
      0, 0, 0, 1,
    ]);
  }

  static rotateY(angle) {
    var s = Math.sin(angle), c = Math.cos(angle);
    return new Matrix([
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1,
    ]);
  }

  static rotateZ(angle) {
    var s = Math.sin(angle), c = Math.cos(angle);
    return new Matrix([
      c, -s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }
}

class Vector {
  constructor(...vals) {
    this.matrix = vals;
  }

  get matrix() {
    return [this.x, this.y, this.z, this.w];
  }

  set matrix(matrix) {
    this.x = matrix[0] || 0;
    this.y = matrix[1] || 0;
    this.z = matrix[2] || 0;
    this.w = matrix[3] || 0;
  }

  divide(v) {
    if (v instanceof Vector) {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
    } else {
      this.x /= v;
      this.y /= v;
      this.z /= v;
    }
  }

  applyMatrix(matrix) {
    var m = (matrix instanceof Matrix) ? matrix.m : matrix;
    var x = m[0] * this.x + m[1] * this.y + m[2] * this.z + m[3],
        y = m[4] * this.x + m[5] * this.y + m[6] * this.z + m[7],
        z = m[8] * this.x + m[9] * this.y + m[10] * this.z + m[11];
    this.x = x;
    this.y = y;
    this.z = z;
    this.divide(m[12] * this.x + m[13] * this.y + m[14] * this.z + m[15]);
    return this;
  }

  clone () {
    return new Vector(this.x, this.y, this.z, this.w);
  }
}

class Polygon {
  constructor(x, y, z, verts) {
    this.origin = new Vector(x, y, z, 1);
    this.verts = [];
    for (var i = 0; i < verts.length; i++) {
      var v = (verts[i] instanceof Vector) ? verts[i] : new Vector(verts[i][0], verts[i][1], verts[i][2], 1);
      this.verts.push(v);
    }
  }

  getVerts(){
    var {x, y, z} = this.origin;
    var matrix = Matrix.translate(x, y, z);
    var result = [];
    for (var i = 0; i < this.verts.length; i++) {
      var v = this.verts[i].clone();
      v.applyMatrix(matrix);
      result.push(v);
    }
    return result;
  }

  applyMatrix(matrix) {
    for (var i = 0; i < this.verts.length; i++) {
      this.verts[i].applyMatrix(matrix)
    }
  }

  translate(x, y, z) {
    this.origin.x += x,
    this.origin.y += y,
    this.origin.z += z;
  }

  scale(x, y, z) {
    this.applyMatrix(Matrix.scale(x, y, z));
  }

  rotateX(angle) {
    this.applyMatrix(Matrix.rotateX(angle));
  }

  rotateY(angle) {
    this.applyMatrix(Matrix.rotateY(angle));
  }

  rotateZ(angle) {
    this.applyMatrix(Matrix.rotateZ(angle));
  }

  clone() {
    var {x, y, z} = this.origin;
    var verts = [];
    for (var i = 0; i < this.verts.length; i++) {
      verts.push(this.verts[i].clone());
    }
    return new Polygon(x, y, z, verts);
  }
}

class Segment {
  constructor(x, y, z, radius, pointCount) {
    this.origin = new Vector(x, y, z, 1);
    this.rot = 0;
    this.geom = [];
    // Define a shape to use for each segment point
    var face = new Polygon(0, 0, 0, [
      // Chevron shape:
      [-1, 0, -4],
      [-4, 0, 0],
      [-1, 0, 4],
      [2, 0, 4],
      [-1, 0, 0],
      [2, 0, -4],
      // Square shape:
      // [-3, 0, -3],
      // [-3, 0, 3],
      // [3, 0, 3],
      // [3, 0, -3],
    ]);
    // Move shape to the edge of the segment
    face.applyMatrix(Matrix.translate(0, radius, 0));
    var sliceAngle = 2 * Math.PI / pointCount;
    var rotationMatrix = Matrix.rotateZ(sliceAngle);
    // Create each points shape by copying the shape and rotating it
    for (var i = 0; i < pointCount; i++) {
      face.applyMatrix(rotationMatrix);
      this.geom.push(face.clone());
    }
  }

  translate(x, y, z) {
    this.origin.x += x || 0;
    this.origin.y += y || 0;
    this.origin.z += z || 0;
  }

  rotate(angle) {
    this.rot += angle;
    var matrix = Matrix.rotateZ(angle);
    for (var i = 0; i < this.geom.length; i++) {
      this.geom[i].applyMatrix(matrix);
    }
  }

  render(ctx, camera, width, height, border) {
    var alpha = Math.min(1 - 150 / this.origin.z, 1);

    if (this.origin.z == 0 || alpha == 0) return;

    ctx.lineWidth = 1;
    ctx.strokeStyle = "hsla(" +(this.origin.z / 1.1 + 90) % 360 + ", 85%, 60%, " +alpha+ ")";
    ctx.fillStyle = "hsla(" +(this.origin.z / 1.1 + 90) % 360 + ", 85%, 60%, 0.1)";

    var tranformToOrigin = Matrix.translate(this.origin.x, this.origin.y, this.origin.z);
    // loop through each polygon in the segment geometry
    for (var i = 0; i < this.geom.length; i++) {
      // get the polygon's verts based on its origin position
      var verts = this.geom[i].getVerts();
      ctx.beginPath();
      // loop through each vertex in the polygon
      for (var j = 0; j < verts.length; j++) {
        var v = verts[j];
        // convert vert position to global space
        v.applyMatrix(tranformToOrigin);
        var f = camera.z / (camera.z - v.z);
        var x = v.x * f + camera.x, y = v.y * f + camera.y;
        // f can sometimes =~ 0 because of division, which makes lines get drawn erroneously to the center of view -- to fix this we just skip to the next poly
        // we also skip if the vert is going to be drawn beyond the screen bounds (with a bit of leeway)
        if (f < 0.01 || x < 0 - border || y < 0 - border || x > width + border || y > height + border) {
          ctx.closePath();
          break;
        };
        // draw line to point
        if (j == 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
      if (this.origin.z > 200) ctx.fill();
    }
  }
}

class Tunnel {
  constructor() {
    this.step = 1;
    this.gap = 12;
    this.zMin = 0;
    this.zMax = 600;
    this.points = 48;
    this.radius = 50
    this.rot = (Math.PI * 2) / this.points / 12;
    this.segs = [new Segment(0, 0, this.zMax, this.radius, this.points)];
  }

  cull(camera) {
    // cull any segments that have fallen "behind" the camera plane
    this.segs = this.segs.filter((seg) => {
      return (seg.origin.z < camera.z);
    });
  }

  render(ctx, camera, w, h, dt) {
    var segs = this.segs;
    // if the last segment has moved far enough since the last frame, then fill in the gap with more segments
    if ((segs.length > 0) && (segs[0].origin.z > this.gap)) {
      for (var z = segs[0].origin.z - this.gap; z > this.zMin; z -= this.gap) {
        var seg = new Segment(0, 0, z, this.radius, this.points);
        seg.rotate(segs[0].rot + this.rot);
        this.segs.unshift(seg);
      }
    }
    this.cull(camera);
    // rotate + shift all segments, after rendering them
    for (var i = 0; i < segs.length; i++) {
      var seg = segs[i];
      seg.render(ctx, camera, w, h, Math.max(w/4, h/4));
      seg.origin.z += this.step * dt;
      seg.rotate(this.rot * dt);
    }
  }
}

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
// create a canvas
var wrapper = document.getElementById("wrapper");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
wrapper.appendChild(canvas);
// set dimensions to screen
var size = wrapper.getBoundingClientRect();
var width = size.width;
var height = size.height;
canvas.width = width;
canvas.height = height;
// spawn tunnel + "camera"
var tunnel = new Tunnel();
var camera = new Vector(width/2, height/2, 600, 1);
// set up timing stuff
var currentTime = performance.now();
var lastTime = currentTime;
var tick = 0;
// render loop
function render(now) {
  requestAnimationFrame(render);
  tick = now - lastTime;
  lastTime = now;
  var dt = tick / (1000 / 60);
  ctx.fillStyle = "#292e3c";
  ctx.clearRect(0, 0, width, height);
  ctx.fillRect(0, 0, width, height);
  tunnel.render(ctx, camera, width, height, dt);
}
// lets go!
requestAnimationFrame(render);
