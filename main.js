const heightSlider = document.getElementById("height-slider");
const heightFactorSlider = document.getElementById("height-factor-slider");
const amountSlider = document.getElementById("amount-slider");
const thicknessSlider = document.getElementById("thickness-slider");
const angleSlider = document.getElementById("angle-slider");

const canvasContainer = document.getElementById("canvas-container");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let HEIGHT = 200; // The height of the line
let HEIGHT_FACTOR = 1.25; // The factor of the height
let THICKNESS = 10; // The thickness of the line
let AMOUNT = 10; // The amount of lines drawn
let ANGLE = 15 * (Math.PI / 180);

onresize = () => updateCanvas();

/** Updates the canvas width and height and calculates the starting rectangle */
function updateCanvas() {
    // Initialize the width and height of the canvas
    ctx.canvas.width = canvasContainer.clientWidth;
    ctx.canvas.height = canvasContainer.clientHeight;

    // Calculate the starting rectangle points
    const startingPoints = [
        { x: canvasContainer.clientWidth / 2, y: canvasContainer.clientHeight },
        { x: canvasContainer.clientWidth / 2, y: canvasContainer.clientHeight - HEIGHT }
    ];
    drawFractal(startingPoints);
}

/**
 * Draws the fractal canopy
 * @param {*} startingPoints The starting bottom points if the line
 */
function drawFractal(startingPoints) {
    // Draw the default line
    drawLine(startingPoints, AMOUNT);

    // Draw the rest of the fractal recursively
    drawFractalRecursive(startingPoints, HEIGHT / HEIGHT_FACTOR, AMOUNT);
}

/**
 * Draws the fractal canopy recursively
 * @param {*} points The points of the line
 * @param {*} amount The current amount left of steps to draw 
 */
function drawFractalRecursive(points, height, amount) {
    if (amount <= 0) return;

    const newPoints = calculateTopPoints(points, height);
    drawLine([points[1], newPoints[0]], amount);
    drawLine([points[1], newPoints[1]], amount);

    drawFractalRecursive([points[1], newPoints[0]], height / HEIGHT_FACTOR, amount - 1);
    drawFractalRecursive([points[1], newPoints[1]], height / HEIGHT_FACTOR, amount - 1);
}

/**
 * Draws a line between two points
 * @param {*} point1 The first point of the line
 * @param {*} point2 The second point of the line
 * eg: [{ x: 0, y: 0 }, { x: 10, y: 10 }]
 * @param amount The current amount left of steps to draw 
 */
function drawLine([point1, point2], amount) {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineWidth = (THICKNESS / 10) * amount;
    ctx.stroke();
    ctx.closePath();
}

/**
 * Calculates the new top points of the lines
 * @param {*} bottomPoint The bottom point of the current line
 * @param {*} topPoint The top point of the current line
 * @param {*} height The height of the calulated line
 * @returns 
 */
function calculateTopPoints([bottomPoint, topPoint], height) {
    // Caluclate the new vector
    let vec = {
        x: topPoint.x - bottomPoint.x,
        y: topPoint.y - bottomPoint.y
    };

    // Calculate the length of the new vector
    const vecLength = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));

    // Normalize the new vector and set corresponding height
    vec = {
        x: (vec.x / vecLength) * height,
        y: (vec.y / vecLength) * height
    };

    // Rotate the vector to the left
    const rightVec = {
        x: (vec.x * Math.cos(ANGLE)) + (vec.y * -Math.sin(ANGLE)),
        y: (vec.x * Math.sin(ANGLE)) + (vec.y * Math.cos(ANGLE))
    };

    // Rotate the vector to the right
    const leftVec = {
        x: (vec.x * Math.cos(-ANGLE)) + (vec.y * -Math.sin(-ANGLE)),
        y: (vec.x * Math.sin(-ANGLE)) + (vec.y * Math.cos(-ANGLE))
    };

    return [
        { x: topPoint.x + leftVec.x, y: topPoint.y + leftVec.y },
        { x: topPoint.x + rightVec.x, y: topPoint.y + rightVec.y }
    ];
}

/**
 * Changes the current height of the fractal canopy
 * @param {*} value The new height
 */
function changeHeight(value) {
    heightSlider.labels[0].textContent = `Line Height: ${value}`;
    HEIGHT = value;
    updateCanvas();
}

/**
 * Changes the current height factor of the fractal canopy
 * @param {*} value The new height factor
 */
function changeHeightFactor(value) {
    heightFactorSlider.labels[0].textContent = `Line Height Factor: ${value}`;
    HEIGHT_FACTOR = value;
    updateCanvas();
}

/**
 * Changes the current amount of the fractal canopy drawn
 * @param {*} value The new amount
 */
function changeAmount(value) {
    amountSlider.labels[0].textContent = `Line Amount: ${value}`;
    AMOUNT = value;
    updateCanvas();
}

/**
 * Changes the current line thickness of the fractal canopy
 * @param {*} value The new thickness
 */
function changeThickness(value) {
    thicknessSlider.labels[0].textContent = `Line Thickness: ${value}`;
    THICKNESS = value;
    updateCanvas();
}

/**
 * Changes the angle of the fractal canopy drawn
 * @param {*} value The new angle
 */
function changeAngle(value) {
    angleSlider.labels[0].textContent = `Angle: ${value}`;
    ANGLE = value * (Math.PI / 180);
    updateCanvas();
}

