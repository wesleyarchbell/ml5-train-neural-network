let model;
let targetLabel;

function setup() {
    createCanvas(400, 400);

    let options = {
        inputs: ['x', 'y'],
        outputs: ['label'],
        task: 'classification'            
    };
    model = ml5.neuralNetwork(options);
}

function keyPressed() {
    targetLabel = key.toUpperCase();
}

function mousePressed() {

    let inputs = {
        x: mouseX,
        y: mouseY
    }

    let target = {
        label: targetLabel
    }
    model.addData(inputs, target);
    
    stroke(0);
    noFill();
    ellipse(mouseX, mouseY, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(targetLabel, mouseX, mouseY);
}
