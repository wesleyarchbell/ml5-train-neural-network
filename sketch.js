let model;
let targetLabel = 'C';
let state = 'collection';

let keyPressedVal;

function setup() {
    createCanvas(400, 400);
    background('#659DBD');

    text('Built with ml5.js & p5.js', 270, 392);

    let options = {
        inputs: ['x', 'y'],
        outputs: ['label'],
        task: 'classification',
        debug: true
    };
    model = ml5.neuralNetwork(options);
    model.loadData('model-data.json', dataLoaded);
}

function dataLoaded() {
    let data = model.data.data.raw;
    for (d in data) {
        console.log(d);    
    }
}

function keyPressed() {    
    if ('t' === key) {
        state = 'training';
        console.log('Starting training..');
        text('Training model...', 50, 389);

        model.normalizeData();
        let options = {
            epochs: 200
        };
        model.train(options, whileTraining, finishedTraining);
    } else if ('s' === key) {
        model.saveData('mouse-notes');
    } 
    targetLabel = key.toUpperCase();
}

function whileTraining(epoch, loss) {
    console.log(epoch);
}

function finishedTraining() {
    state = 'prediction';
    console.log('Finished training model');
    text('done.', 110, 389);
}

function mousePressed() {
    let inputs = {
        x: mouseX,
        y: mouseY
    }

    if (state === 'collection') {
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

    } else if (state === 'prediction') {
        model.classify(inputs, gotResults);
    }
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