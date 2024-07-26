let shapesCon = document.querySelector(".shapesCon");
let shapes = shapesCon.querySelectorAll(".button");
let isDrawing = false;
let isErasing = false;
let currentLine;
let selectedShape = null;
let colorPicker = document.getElementById('bgColorPicker');

// Undo and Redo stacks
let undoStack = [];
let redoStack = [];
let currentState = null;

function saveState() {
  undoStack.push(layer.toObject());
  redoStack = []; // Clear redo stack on new action
}

function undo() {
  if (undoStack.length > 0) {
    saveState(); // Save current state to redo stack before undo
    const lastState = undoStack.pop();
    layer.destroyChildren();
    layer.add(Konva.Node.create(lastState, stage));
    layer.batchDraw();
    showButtons(); // Ensure buttons are shown
  }
}

function redo() {
  if (redoStack.length > 0) {
    saveState(); // Save current state to undo stack before redo
    const redoState = redoStack.pop();
    layer.destroyChildren();
    layer.add(Konva.Node.create(redoState, stage));
    layer.batchDraw();
    showButtons(); // Ensure buttons are shown
  }
}

// Event listeners for undo and redo buttons
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('redoBtn').addEventListener('click', redo);

function generateCanva() {
  let prev = document.querySelector(".prevCon > .prev");

  var stage = new Konva.Stage({
    container: 'prev',
    width: prev.clientWidth,
    height: prev.clientHeight,
  });
  var layer = new Konva.Layer();
  stage.add(layer);

  var tr = new Konva.Transformer({
    centeredScaling: true,
  });
  layer.add(tr);

  document.getElementById("imagePicker").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageObj = new Image();
        imageObj.onload = function () {
          const shape = new Konva.Image({
            x: 10,
            y: 10,
            image: imageObj,
            width: 100,
            height: 100,
            draggable: true,
          });
          layer.add(shape);
          layer.draw();
          
          shape.on('click', (evt) => {
            evt.cancelBubble = true; // Prevent the stage click event from firing
            tr.nodes([shape]);
            layer.draw();
            selectedShape = shape;
            showButtons(); // Ensure buttons are shown
          });
        };
        imageObj.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  Array.from(shapes).forEach((e, i) => {
    e.addEventListener("click", (dets) => {
      const shapeType = dets.currentTarget.classList[1];

      if (shapeType === "image") {
        document.getElementById("imagePicker").click();
      } else if (shapeType === "draw") {
        isDrawing = !isDrawing;
        stage.container().style.cursor = isDrawing ? 'crosshair' : 'default';
      } else {
        let shape;
        try {
          if (shapeType === "rect") {
            shape = new Konva.Rect({
              x: 20 + (i * 120),
              y: 20,
              width: 100,
              height: 50,
              fill: 'green',
              draggable: true,
            });
          } else if (shapeType === "circle") {
            shape = new Konva.Circle({
              x: 50 + (i * 120),
              y: 50,
              radius: 40,
              fill: 'blue',
              draggable: true,
            });
          } else if (shapeType === "tringle") {
            shape = new Konva.RegularPolygon({
              x: 60 + (i * 120),
              y: 70,
              sides: 3,
              radius: 50,
              fill: 'yellow',
              draggable: true,
            });
          } else if (shapeType === "path") {
            shape = new Konva.Path({
              x: 60 + (i * 120),
              y: 70,
              data: 'M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80',
              fill: 'purple',
              draggable: true,
            });
          } else if (shapeType === "text") {
            shape = new Konva.Text({
              x: 10 + (i * 120),
              y: 10,
              text: 'Hello, Konva!',
              fontSize: 20,
              fontFamily: 'Calibri',
              fill: 'black',
              draggable: true,
            });
          } else if (shapeType === "tag") {
            shape = new Konva.Rect({
              x: 10 + (i * 120),
              y: 10,
              width: 100,
              height: 50,
              fill: 'orange',
              draggable: true,
              cornerRadius: [10, 10, 0, 0],
            });
          } else if (shapeType === "star") {
            shape = new Konva.Star({
              x: 60 + (i * 120),
              y: 70,
              numPoints: 5,
              innerRadius: 30,
              outerRadius: 70,
              fill: 'pink',
              draggable: true,
            });
          } else if (shapeType === "line") {
            shape = new Konva.Line({
              points: [10 + (i * 120), 10, 150, 100],
              stroke: 'black',
              strokeWidth: 5,
              draggable: true,
            });
          }

          if (shape) {
            layer.add(shape);
            layer.draw();
            shape.on('click', (evt) => {
              evt.cancelBubble = true; // Prevent the stage click event from firing
              tr.nodes([shape]);
              layer.draw();
              selectedShape = shape;
              showButtons(); // Ensure buttons are shown
            });
          }
        } catch (error) {
          console.error('Error creating shape:', error);
        }
      }
    });
  });

  stage.on('mousedown touchstart', function (e) {
    if (!isDrawing) return;
    const pos = stage.getPointerPosition();
    currentLine = new Konva.Line({
      stroke: 'black',
      strokeWidth: 2,
      points: [pos.x, pos.y],
      draggable: true,
    });
    layer.add(currentLine);
  });

  stage.on('mousemove touchmove', function (e) {
    if (!isDrawing || !currentLine) return;
    const pos = stage.getPointerPosition();
    let newPoints = currentLine.points().concat([pos.x, pos.y]);
    currentLine.points(newPoints);
    layer.batchDraw();
  });

  stage.on('mouseup touchend', function (e) {
    currentLine = null;
  });

  stage.on('click', () => {
    if (isDrawing) return;
    tr.nodes([]);
    layer.draw();
    selectedShape = null;
    hideButtons();
  });

  document.getElementById('eraseBtn').addEventListener('click', () => {
    isErasing = !isErasing;
    stage.container().style.cursor = isErasing ? 'crosshair' : 'default';
  });

  document.getElementById('bgColorBtn').addEventListener('click', () => {
    if (selectedShape) {
      colorPicker.click();
    }
  });

  colorPicker.addEventListener('input', () => {
    if (selectedShape) {
      selectedShape.fill(colorPicker.value);
      layer.batchDraw();
    }
  });

  document.getElementById('modifyTextBtn').addEventListener('click', () => {
    if (selectedShape && selectedShape instanceof Konva.Text) {
      const newText = prompt('Enter new text:', selectedShape.text());
      if (newText !== null) {
        selectedShape.text(newText);
        layer.batchDraw();
      }
    }
  });

  document.getElementById('deleteBtn').addEventListener('click', () => {
    if (selectedShape) {
      selectedShape.destroy();
      layer.draw();
      hideButtons();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (selectedShape) {
        selectedShape.destroy();
        layer.draw();
        hideButtons();
      }
    }
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    var dataURL = stage.toDataURL({ pixelRatio: 3 });
    var link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas-image.png';
    link.click();
  });

  function showButtons() {
    document.getElementById('eraseBtn').style.display = 'inline';
    document.getElementById('bgColorBtn').style.display = 'inline';
    document.getElementById('modifyTextBtn').style.display = selectedShape instanceof Konva.Text ? 'inline' : 'none';
    document.getElementById('deleteBtn').style.display = 'inline';
  }

  function hideButtons() {
    document.getElementById('eraseBtn').style.display = 'none';
    document.getElementById('bgColorBtn').style.display = 'none';
    document.getElementById('modifyTextBtn').style.display = 'none';
    document.getElementById('deleteBtn').style.display = 'none';
  }
}

generateCanva();
