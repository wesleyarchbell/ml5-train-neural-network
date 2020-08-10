let model;
let targetLabel = 'C';
let state = 'collection';

let keyPressedVal;

function setup() {
    createCanvas(400, 430);
    background('#659DBD');

    text('Built with ml5.js & p5.js', 270, 422);

    let options = {
        inputs: ['x', 'y'],
        outputs: ['label'],
        task: 'classification',
        debug: true
    };
    model = ml5.neuralNetwork(options);
    model.loadData('model-data.json', dataLoaded);

    let collectButton = createButton('Collect Data');
    collectButton.id("collect");
    collectButton.position(10, 10);
    collectButton.mousePressed(collectionMode);

    let saveDataButton = createButton('Save Data');
    saveDataButton.id("save-data");
    saveDataButton.position(100, 10);
    saveDataButton.mousePressed(saveData);

    let trainButton = createButton('Train Model');
    trainButton.id("train");
    trainButton.position(180, 10);
    trainButton.mousePressed(trainModel);
}

function collectionMode() {
    state = 'collection';
    console.log('collection mode');
}

function dataLoaded() {
    let data = model.data.data.raw;
    for (let i = 0; i < data.length; i++) {
        let inputs = data[i].xs;
        let label = data[i].ys.label;
        drawDataPoint(inputs.x, inputs.y, label);
    }
    trainModel();
}

function saveData() {
    model.saveData('mouse-notes');
}

function keyPressed() {  
    targetLabel = key.toUpperCase();
}

function trainModel() {
    state = 'training';
    console.log('Starting training..');
    text('Training model...', 8, 422);

    model.normalizeData();
    let options = {
        epochs: 200
    };
    model.train(options, whileTraining, finishedTraining);
}

function whileTraining(epoch, loss) {
    console.log(epoch);
}

function finishedTraining() {
    state = 'prediction';
    console.log('Finished training model');
    text('done.', 8, 422);
}

function mousePressed(event) {
    let srcId = event.srcElement.id;
    if ('collect' === srcId || 'train' === srcId || 'save-data' === srcId) {
        return false;
    }
    
    let inputs = {
        x: mouseX,
        y: mouseY
    }

    if (state === 'collection') {
        let target = {
            label: targetLabel
        }
        model.addData(inputs, target);
        drawDataPoint(mouseX, mouseY, targetLabel);

    } else if (state === 'prediction') {
        model.classify(inputs, gotResults);
    }
}

function drawDataPoint(x, y, label) {
    stroke(0);
    noFill();
    ellipse(x, y, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(label, x, y);
}

function gotResults(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    stroke(0);
    fill(0, 0, 255, 100);
    ellipse(mouseX, mouseY, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(results[0].label, mouseX, mouseY);
}