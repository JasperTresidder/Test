ball = [];
temp = [];

function setup() {
  createCanvas(900, 1200);
  pipe = new Pipe();
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
  if (ball.length > 14) {
    for (var i = 14; i > -1; i--) {
      temp[i - 14] = ball[i];
    }
    temp.pop();
    ball = [];
    for (var i = 0; i < temp.length; i++) {
      ball[i] = temp[13 - i];
    }
    temp = [];
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
    ellipse(this.x, this.y, 50, 50);
  }

}

function mouseClicked() {
  ball.push(new Ball());
}
