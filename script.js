const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('equationInput');
const btn = document.getElementById('graphBtn');

const SCALE = 20; 
const CENTER = { x: canvas.width / 2, y: canvas.height / 2 };

// Event Listener to keep the HTML clean
btn.addEventListener('click', updateGraph);

function updateGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    
    try {
        // --- FEATURE 1: Math.js Compilation ---
        // We compile the input string into a fast JS function just ONCE.
        const compiledFormula = math.compile(input.value);
        //This feature acts as a "translator." It takes a human-readable string like x^2 + 5 and converts it into an internal Expression

        // --- FEATURE 2: High-Speed Scope Evaluation ---
        // Now we pass this compiled version to our drawing loop
        const userEquation = (xValue) => {
            // This is much faster because the library already parsed the string
            return compiledFormula.evaluate({ x: xValue });
            //compiled.evaluate means you are assigning the $x$ coordinate to the variable in the formula. 
            // It allows for high-precision results for every single pixel, which is why the line looks so smooth on the canvas.
        };

        drawFunction(userEquation);
    } catch (e) { //catches error is the user's input is invalid 
        console.log("Waiting for valid math input...");
    }
}

function drawFunction(mathFunc) {
    ctx.beginPath();
    ctx.strokeStyle = "#2b78e4"; 
    ctx.lineWidth = 2;

    for (let pixelX = 0; pixelX <= canvas.width; pixelX++) {
        // 1. Map pixel to coordinate
        let mathX = (pixelX - CENTER.x) / SCALE;
        
        // 2. Run the math function
        let mathY = mathFunc(mathX);
        
        // 3. Map math back to pixel (Coordinate Mapping)
        let pixelY = CENTER.y - (mathY * SCALE);

        if (pixelX === 0) ctx.moveTo(pixelX, pixelY);
        else ctx.lineTo(pixelX, pixelY);
    }
    ctx.stroke();
}

function drawGrid() {
    ctx.strokeStyle = "#ddd";
    ctx.beginPath();
    ctx.moveTo(0, CENTER.y); ctx.lineTo(canvas.width, CENTER.y);
    ctx.moveTo(CENTER.x, 0); ctx.lineTo(CENTER.x, canvas.height);
    ctx.stroke();
}

// Draw once on load
updateGraph();