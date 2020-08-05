let model;
let targetLabel;
let state = 'collection';

let keyPressedVal;

function setup() {
    createCanvas(400, 400);
    background('#659DBD');

    text('Select a key and click to group letters, repeat and press "T" to train model.', 4, 13);
    text('When training done, click anywhere for neural network to guess your click.', 4, 27);
    text('Built with ml5.js & p5.js', 270, 392);

    let options = {
        inputs: ['x', 'y'],
        outputs: ['label'],
        task: 'classification',
        debug: true
    };
    model = ml5.neuralNetwork(options);
}

function keyPressed() {
    keyPressedVal = key;
    if ('t' === key) {
        state = 'training';
        console.log('Starting training..');
        text('Training model...', 50, 389);

        model.normalizeData();
        let options = {
            epochs: 200
        };
        model.train(options, whileTraining, finishedTraining);
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

    if (!keyPressedVal) {
        alert("Please select a key before clicking on canvas");
        return;
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