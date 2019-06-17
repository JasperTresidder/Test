
function setup() {
  createCanvas(600, 600);
  pipe = new Pipe();
  frameRate = 40;
}

function draw() {
  background(220);
  pipe.move();
  pipe.display();
}

class Pipe {
  constructor() {
    this.x = width - 30;
    this.y = height - 300;
    this.speed = createVector(4, 6);
    
  }

  move() {
    if(this.x <= 0 || this.x >= width){
      this.speed.x = -this.speed.x;
    }
    if(this.y <= 0 || this.y >= height){
      this.speed.y = -this.speed.y;
    }
    this.x = this.x - this.speed.x;
    this.y = this.y - this.speed.y;
  }

  display() {
    fill(0);
    ellipse(this.x,this.y,20,20);
    console.log(this.y);
  }
}