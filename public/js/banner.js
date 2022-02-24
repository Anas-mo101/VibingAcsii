const S = 500

let dt = 0

const cursor = {
  x: 0, y: 0
}

function setup() {
  let canvas = createCanvas(windowWidth, S).parent("lineCanvas");
  background(0)
  // canvas.position(0,0,)
}

function draw() {
  background(0)
  stroke(255)
  strokeWeight(8)
  
  cursor.x = lerp(cursor.x, mouseX, 0.1)
  cursor.y = lerp(cursor.y, mouseY, 0.1)
  
  fill(255)
  circle(cursor.x, cursor.y, 8)
  noFill(255)
  
  const p1 = {
    x: -10, y: S/2
  }
  
  const p2 = {
    x: cursor.x - 100, 
    y: cursor.y + 100 * Math.sin(dt/ 50)
  }
  
  const p3 = {
    x: cursor.x + 100, 
    y: cursor.y + 100 * Math.cos(dt/ 50)
  }
  
  const p4 = {
    x: windowWidth,
    y: S/2
  }
  
  bezier(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y)
  
  strokeWeight(2)
  line(p1.x, p1.y, p2.x, p2.y)
  line(p2.x, p2.y, p3.x, p3.y)
  line(p3.x, p3.y, p4.x, p4.y)
  
  dt += 1
}
