let song;
let img;
let fft;
let particles = [];
let GLOBAL_SPEED = 0;

function preload() {
  soundFormats('mp3', 'ogg');
  song = loadSound("./closer.mp3");
  img = loadImage('./background.jpeg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  fft = new p5.FFT();
  
  img.filter(BLUR, 8);
  select('#play').mouseClicked(showPause);
  select('#pause').mouseClicked(showPlay);
  noLoop();
}

function draw() {
  fft.analyze();
  amp = fft.getEnergy(20, 230);
  let bg = amp < 230 ? [255, 255, 255] : [0, 255, 255];
  background(0);
  //stroke(bg);
  
  translate(width/2, height/2);
  
  push();
  if (amp > 215) {
    rotate(random(-0.5, 0.5));
  }
  image(img, 0, 0, width + 100, height + 100);
  pop();
  
  let OLayer = map(amp, 0, 255, 100, 175);
  fill(0, OLayer);
  noStroke();
  rect(0, 0, width, height);
  stroke(bg);
  strokeWeight(3);
  noFill();
  
  let wave = fft.waveform();
  let sum = wave.reduce((prev, el) => {
    return prev + el;
  }, 0);
  console.log(sum);
  for (let t = -1; t <= 1; t +=2){
    beginShape();
    for (let i = 0; i <= 180; i += 0.5){
      let index = floor(map(i, 0, 180, 0, wave.length - 1));
    
      let r = map(wave[index], -1, 1, 150, 350);
    
      let x = r * sin(i) * t;
      let y = r * cos(i);
      vertex(x,y);
    }
    endShape();
  } 
  
  for (let i = 0; i < 3; i ++) {
    let p = new Particle(sum, amp);
    particles.push(p);
  }
  particles = particles.reverse();
  particles.forEach((particle, index) => {
    if (!particle.edges()) {
      particle.rotate();
      particle.update(amp > 215);
      particle.show();
    } else {
      particles.splice(index, 1);
    }
  });
}

class Particle {
  constructor(speed, amp) {
    GLOBAL_SPEED = speed > 0 ? speed * 1.2 : speed * 0.00025;
    this.pos = p5.Vector.random2D().mult(250);
    this.v = createVector(0, 0);
    this.a = this.pos.copy().mult(random(0.0001 * GLOBAL_SPEED, 0.00001 * GLOBAL_SPEED));
    this.w = random(3, 9);
    this.c = amp < 215 ? [random(200, 255), random(200, 255), random(200, 255)] : [0, 255, 255];
  }
  update(cond){
    this.a = this.pos.copy().mult(random(0.0001 * GLOBAL_SPEED, 0.00001 * GLOBAL_SPEED));
    this.v.add(this.a);
    this.pos.add(this.v);
    this.c = amp < 215 ? [random(200, 255), random(200, 255), random(200, 255)] : [0, 255, 255];
    if (cond) {
      this.pos.add(this.v);
      this.pos.add(this.v);
      this.pos.add(this.v);
      this.pos.add(this.v);
    }
  }
  rotate(){
    if (amp > 215) {
      rotate(random(-1.5, 1.5));
    } 
  }
  edges(){
    if (this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y < -height/2 || this.pos.y > height/2) {
      return true;
    } else {
      return false;
    }
  }
  show() {
    noStroke();
    fill(this.c);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
}