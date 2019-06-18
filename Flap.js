ball = [];
temp = [];
var alphas, beta, gamma, ialphas ,ibeta, igamma;
var oW = 0;
var oH = 0;

function setup() {
  createCanvas(displayWidth, displayHeight);
  oW = windowWidth;
  oH = windowHeight;
  pipe = new Pipe();
  
  drag = false;

  button = createButton('fullScreen');
  button.position(3, 3);
  button.mousePressed(ESC);

  button = createButton('reset');
  button.position(width - 45, 3);
  button.mousePressed(REDO);
  
  alphas = 1;
  beta = 0;
  gamma = 0;
  
  ialphas = 1;
  ibeta = 0;
  igamma = 0;
  tempx = 0;
  tempy = 0;
  var check = 0;
  strokeWeight(1);
}

function draw() {
  background(220);
  // pipe.move();
  // pipe.display();
  if(drag == true){
    var dista = dist(mouseX,mouseY,tempx,tempy);
    var direc = atan((mouseY-tempy)/(mouseX-tempx));
    if(dista < 30){
      strokeWeight(3);
      line(mouseX,mouseY,tempx,tempy);
    }else if(dista < 60){
      strokeWeight(6);
      line(mouseX,mouseY,tempx,tempy);
    }else if(dista < 90){
      strokeWeight(9);
      line(tempx,tempy,mouseX,mouseY)
    }else{
      strokeWeight(9);
      var d = createVector(mouseX-tempx,mouseY-tempy);
      d = d.setMag(90);
      line(tempx,tempy,tempx + d.x,tempy + d.y);
    }
    strokeWeight(1);
  }
  if (typeof ball[0] != "undefined") {
    for (var i = 0; i < ball.length; i++) {
      ball[i].update();
      ball[i].show();
    }
  }
  if (ball.length > 30) {
    reverse(ball);
    ball.pop();
    reverse(ball)
  }
  var check = check + 1;
}

class Pipe {
  constructor(vx,vy) {
    this.x = width - 86;
    this.y = height - width / 2;
    this.speed = createVector(0,0);
    this.speed.x = vx/10;
    this.speed.y = vy/10;

  }

  move() {
    if (this.x <= 0 || this.x + 85 >= width) {
      this.speed.x = -this.speed.x;
    }
    this.x = this.x - this.speed.x;
    this.y = this.y - this.speed.y;
  }

  display() {
    fill(0);
    ellipse(this.x, this.y, 30, 30);
    ellipse(this.x + 175, this.y, 30, 30);
  }
}

class Ball {
  constructor(vx,vy) {
    this.x = tempx;
    this.y = tempy;
    this.velocity = createVector(vx/3, vy/3);
    this.mass = 1;
    this.g = createVector(0, 1);
    this.r = 50;
    this.sidea = 0;
    this.down = 0;
    this.angle = 0;
    this.grav = createVector(0, 0);
    this.touches = function(other) {
      var d = sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y))
      if (d < 50) {
        return true;
      } else {
        return false;
      }

    }
    console.log(mag(this.velocity));
    if(mag(this.velocity.x,this.velocity.y) > 90){
      this.velocity = this.velocity.setMag(90);
    }
  }


  update() {
    this.grav = createVector(beta+(ibeta-beta),alphas + (ialphas-alphas));
    this.g = createVector(0,1);
    
    this.velocity.y += this.g.y;
    this.y += this.velocity.y;
    this.velocity.x += this.sidea;
    this.velocity.x += this.g.x;
    this.x += this.velocity.x;


    if (this.x + 25 > width || this.x - 25 < 0) {
      this.velocity.x = -this.velocity.x;
      if (this.x + 25 > width) {
        this.x = width - 25;
      } else {
        this.x = 25;
      }

    }
    if (this.y + 25 > height) {
      this.velocity.y = -(this.velocity.y);
      this.y = -25 + height;
      if (this.down == 0) {
        //this.velocity.x = random(-4, 4)
      }
      this.down += 1;
    }
    
    if(this.y - 25 < 0){
      this.velocity.y = -(this.velocity.y)
      this.y = 25;
    }

    for (var i = 0; i < ball.length; i++) {
      if (this.touches(ball[i])) {
        resolveCollision(this, ball[i]);
      }
      //console.log('ok');

    }
    this.velocity.x = this.velocity.x * 0.993;
    this.velocity.y = this.velocity.y * 0.993;
  }

  show() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.r, this.r);
    //console.log(this.x);
  }

}

// function mouseClicked() {
//   if ((mouseX > 80 || mouseY > 23) && (mouseX < width - 50 || mouseY > 23)) {
//     ball.push(new Ball());
//   }
// }

function mousePressed(){
  tempx = mouseX;
  tempy = mouseY;
}
function mouseDragged(){
  drag = true;
}

function mouseReleased(){
  drag = false;
  velx = tempx - mouseX;
  vely = tempy - mouseY;
  ball.push(new Ball(velx,vely));
  
}

function ESC() {
  let fs = fullscreen();
  fullscreen(!fs);
}


function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

    // Grab angle between the two colliding particles
    const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotates(particle.velocity, angle);
    const u2 = rotates(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
      y: u1.y
    };
    const v2 = {
      x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
      y: u2.y
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotates(v1, -angle);
    const vFinal2 = rotates(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

function rotates(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

function REDO() {
  ball = [];
}

window.addEventListener('deviceorientation', function(e) 
{
  alphas = e.alpha;
  beta = e.beta;
  gamma = e.gamma;
  if(check < 10){
    ialphas = alphas;
    ibeta = beta;
    igamma = gamma;
  }
});
