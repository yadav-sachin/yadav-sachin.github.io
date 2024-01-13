let flowField;
let particles = [];

class Particle {
  constructor() {
    // Initializing the position randomly
    this.pos = createVector(random(width), random(height));
    // Velocity and acceleration
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4; // Maximum speed of particle
    this.prevPos = this.pos.copy(); // To store the previous position
  }

  // Method to follow the flow field
  follow(flowField) {
    let x = floor(this.pos.x / flowField.scl);
    let y = floor(this.pos.y / flowField.scl);
    let index = x + y * flowField.cols;
    let force = flowField.field[index];

    // Apply that force to the particle's acceleration
    this.applyForce(force);
  }

  // Method to apply a force to a particle
  applyForce(force) {
    this.acc.add(force);
  }

  // Update the particle's position
// Update the particle's position
    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0); // Resetting acceleration
    
        // Check for wrapping around the edges
        let wrapX = false, wrapY = false;
    
        if (this.pos.x > width) { this.pos.x = 0; wrapX = true; }
        if (this.pos.x < 0) { this.pos.x = width; wrapX = true; }
        if (this.pos.y > height) { this.pos.y = 0; wrapY = true; }
        if (this.pos.y < 0) { this.pos.y = height; wrapY = true; }
    
        // Reset prevPos if the particle wraps around an edge
        if (wrapX || wrapY) {
        this.updatePrev();
        }
    }

  // Display the particle
  show() {
    stroke(0, 173, 238, 80); // Light blue color with transparency
    strokeWeight(3); // Slightly larger particles
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  // Update the previous position
  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }
}

class FlowField {
    constructor() {
      this.scl = 20; // Scale of the flow field
      this.cols = floor(width / this.scl);
      this.rows = floor(height / this.scl);
      this.field = new Array(this.cols * this.rows);
      this.zoff = 0; // 3rd dimension in noise
  
      let xoff = 0; // Adjusted for more gradual changes in noise values
      for (let i = 0; i < this.cols; i++) {
        let yoff = 0;
        for (let j = 0; j < this.rows; j++) {
          let index = i + j * this.cols;
          let angle = noise(xoff, yoff, this.zoff) * PI * 4; // More sinuous angles
          let v = p5.Vector.fromAngle(angle);
          v.setMag(0.5); // Lower magnitude for smoother, more fluid motion
          this.field[index] = v;
          yoff += 0.1; // Adjust noise step for y-axis
        }
        xoff += 0.1; // Adjust noise step for x-axis
      }
    }
  
    // Method to update the flow field
    update() {
      this.zoff += 0.03; // Adjust the speed of the 'flow' of the noise
      let xoff = 0;
      for (let i = 0; i < this.cols; i++) {
        let yoff = 0;
        for (let j = 0; j < this.rows; j++) {
          let index = i + j * this.cols;
          let angle = noise(xoff, yoff, this.zoff) * PI * 4;
          let v = p5.Vector.fromAngle(angle);
          v.setMag(0.5);
          this.field[index] = v;
          yoff += 0.1;
        }
        xoff += 0.1;
      }
    }
  
    // Method to display the flow field (optional)
    display() {
      for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
          let index = i + j * this.cols;
          let v = this.field[index];
          push();
          translate(i * this.scl, j * this.scl);
          rotate(v.heading());
          stroke(0, 50);
          strokeWeight(1); // Optional: Adjust stroke weight for visibility
          line(0, 0, this.scl, 0);
          pop();
        }
      }
    }
  }
  

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60); // Set a higher frame rate for smoother animations
    flowField = new FlowField();
    for (let i = 0; i < 30000; i++) {
        particles[i] = new Particle();
    }
}

function draw() {
    background(0, 25); // Slight transparency for a trailing effect

  flowField.update();
  // flowField.display(); // Uncomment to see the flow field

  for (let particle of particles) {
    particle.follow(flowField);
    particle.update();
    particle.show();
  }
}
