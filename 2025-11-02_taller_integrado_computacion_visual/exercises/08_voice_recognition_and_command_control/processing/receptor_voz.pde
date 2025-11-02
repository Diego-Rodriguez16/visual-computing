import oscP5.*;
import netP5.*;

OscP5 oscP5;
float x, y;
boolean mover = false;
String estado = "esperando...";

void setup() {
    size(600, 400);
    oscP5 = new OscP5(this, 12000); // Port same as Python
    x = width/2;
    y = height/2;
    textSize(22);
}

void draw() {
    background(30);
    
    // Update movement
    if (mover) {
        if (estado.equals("adelante")) y -= 2;
        if (estado.equals("atras")) y += 2;
        if (estado.equals("izquierda")) x -= 2;
        if (estado.equals("derecha")) x += 2;
    }

    // Draw object
    fill(255, 180, 0);
    ellipse(x, y, 50, 50);
    
    fill(255);
    text("Comando: " + estado, 20, height - 30);
}

void oscEvent(OscMessage msg) {
    String addr = msg.addrPattern();
    println("OSC message received:", addr);
    
    switch(addr) {
        case "/adelante":
            estado = "adelante"; mover = true; break;
        case "/atras":
            estado = "atras"; mover = true; break;
        case "/izquierda":
            estado = "izquierda"; mover = true; break;
        case "/derecha":
            estado = "derecha"; mover = true; break;
        case "/detener":
            estado = "detenido"; mover = false; break;
    }
}
