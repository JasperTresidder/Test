ball = [];

function setup() {
  createCanvas(600, 500);
  pipe = new Pipe();
  frameRate = 40;
}

function draw() {
  background(220);
  pipe.move();
  pipe.display();
  if (typeof ball[0] != "undefined") {
    for (var i = 0; i < ball.length; i++) {
      ball[i].update();
      ball[i].show();
    }
  }
}

class Pipe {
  constructor() {
    this.x = width - 86;
    this.y = height - 300;
    this.speed = createVector(4);

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
    ellipse(this.x, this.y, 10, 10);
    ellipse(this.x + 85, this.y, 10, 10);
  }
}

class Ball {
  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    this.g = 1;
    this.v = 0;
  }
  update() {
    if (this.y >= height) {
      this.v = -(this.v * 0.9);
      this.y = height - 0.01;
    }
    this.v += this.g;
    this.y += this.v;
  }

  show() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, 25, 25);
  }

}

function mouseReleased(){
  ball.push(new Ball());
}
