ball = [];
temp = [];

var oW = 0;
var oH = 0;

function setup() {
  createCanvas(windowWidth,windowHeight);
  oW = windowWidth;
  oH = windowHeight;
  pipe = new Pipe();
  
  button = createButton('fullScreen');
  button.position(7, 3);
  button.mousePressed(ESC);
  
  button = createButton('reset');
  button.position(width - 45, 3);
  button.mousePressed(REDO);
}

function draw() {
  background(220);
  // pipe.move();
  // pipe.display();
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
}

class Pipe {
  constructor() {
    this.x = width - 86;
    this.y = height - width/2;
    this.speed = createVector(4,0);

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
  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    this.velocity = createVector(0,0)
    this.mass = 1;
    this.g = 1;
    this.r = 50;
    this.sidea = 0;
    this.down = 0;
    this.angle = 0;
    this.touches = function(other){
      var d = sqrt((this.x - other.x)*(this.x - other.x) + (this.y - other.y)*(this.y - other.y))
      if(d < 50){
        return true;
      }else{
        return false;
      }
      
    }
  }
    
  
  update() {
    this.velocity.y += this.g;
    this.y += this.velocity.y;
    this.velocity.x += this.sidea;
    this.x += this.velocity.x;
    
    
    if(this.x +25 > width || this.x - 25 < 0){
      this.velocity.x = - this.velocity.x;
      if (this.x + 25 > width){
        this.x = width - 25;
      }else{
        this.x = 25;
      }
      
    }    
    if (this.y + 25 > height) {
      this.velocity.y = -(this.velocity.y * 0.9);
      this.y = -25 + height;
      if(this.down == 0){
        this.velocity.x = random(-4, 4)
      }
      this.down += 1;
    }
    
    for(var i = 0; i < ball.length; i++){
      if(this.touches(ball[i])){
        resolveCollision(this,ball[i]);
      }
    //console.log('ok');
    
    }
  }

  show() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.r, this.r);
    //console.log(this.x);
  }

}

function mouseClicked() {
  ball.push(new Ball());
}
function ESC(){
    let fs = fullscreen();
    fullscreen(!fs);
    if(fs=true){
      createCanvas(displayWidth,displayHeight);
    
    }else{
      createCanvas(oW,oH);
    }
    background(220);
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
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

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

function REDO(){
  ball = [];
}
