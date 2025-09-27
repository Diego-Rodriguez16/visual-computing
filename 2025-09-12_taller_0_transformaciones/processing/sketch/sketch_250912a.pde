// Processing (Java mode) - 3D Transform Demo
// Requirements covered:
// - translate(), rotate(), scale()
// - pushMatrix() / popMatrix()
// - time-driven animation with millis() / frameCount / sin()

float baseSize = 120;

void setup() {
  size(800, 600, P3D);  // 3D renderer
  smooth(8);
}

void draw() {
  background(18, 22, 35);
  lights();

  // --- Time parameters ---
  float t = millis() / 1000.0;           // seconds since start
  float angle = t * 0.8;                 // rotation speed (rad/s approx.)
  float wave = sin(t * 1.2);             // smooth wave for translation/scale
  float s = 1.0 + 0.3 * wave;            // scale between ~0.7 and 1.3

  // --- Ground/reference (optional) ---
  pushMatrix();
  translate(width/2, height*0.85, -200);
  rotateX(PI/2.2);
  noStroke();
  fill(30, 34, 50);
  rectMode(CENTER);
  rect(0, 0, 800, 500);
  popMatrix();

  // --- Animated box ---
  pushMatrix();
  // Center of screen + wavy translation in X/Z
  translate(width/2 + 180 * sin(t * 0.7), height/2, 120 * sin(t * 0.5));

  // Rotations around X and Y
  rotateY(angle);
  rotateX(angle * 0.7);

  // Smooth scaling
  scale(s);

  // Draw the box
  stroke(220);
  strokeWeight(1.5);
  fill(90, 150, 255);
  box(baseSize);
  popMatrix();

  // --- HUD text (optional, helps learning) ---
  hint(DISABLE_DEPTH_TEST);
  camera(); // reset matrices for 2D HUD
  fill(230);
  textSize(14);
  text("t = " + nf(t, 1, 2) + " s", 12, 20);
  text("angle = " + nf(angle, 1, 2), 12, 40);
  text("scale = " + nf(s, 1, 2), 12, 60);
  hint(ENABLE_DEPTH_TEST);
}
