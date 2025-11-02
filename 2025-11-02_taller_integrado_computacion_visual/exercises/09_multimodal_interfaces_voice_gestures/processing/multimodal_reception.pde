  import oscP5.*;
  import netP5.*;
  
  OscP5 oscP5;
  color currentColor;
  
  void setup() {
    size(400, 400);
    oscP5 = new OscP5(this, 12000);
    currentColor = color(150); // gris inicial
  }
  
  void draw() {
    background(currentColor);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("Esperando comandos OSC...", width/2, height/2);
  }
  
  void oscEvent(OscMessage msg) {
    String addr = msg.addrPattern();
    println("Received:", addr);
    
    if (addr.equals("/adelante_rapido")) {
      currentColor = color(0, 255, 0);  // Verde brillante
    } else if (addr.equals("/adelante")) {
      currentColor = color(0, 100, 255);  // Azul
    } else if (addr.equals("/saludo")) {
      currentColor = color(255, 255, 0);  // Amarillo
    } else if (addr.equals("/detener")) {
      currentColor = color(0);  // Negro
    } else {
      currentColor = color(150);  // Default gris
    }
  }
