import "./App.css";
import Glass from "./components/glass";
import React from "react";
import shortid from "shortid";
import { figuresArr, colorsArr } from "./Constants";

function App() {
  function getRandomColor() {
    return colorsArr[Math.floor(Math.random() * colorsArr.length)];
  }
  function getNewFigure() {
    const figNum = Math.floor(Math.random() * figuresArr.length);
    const color = getRandomColor();
    return {
      ...figuresArr[figNum],
      cells: figuresArr[figNum].cells.map((cell) => ({
        ...cell,
        value: { ...cell.value, color: color },
      })),
    };
  }

  function getEmptyRow(cols) {
    let row = new Array(cols).fill({ filled: false, color: "#FFFFFF" });
    row.id = shortid.generate();
    return row;
  }

  function copyRow(row) {
    let newRow = [...row];
    newRow.id = row.id;
    return newRow;
  }

  function getEmptyGlass(rows, cols) {
    const result = [];
    for (let i = 0; i < rows; i++) {
      result.push(getEmptyRow(cols));
    }
    return result;
  }

  function copyGlass(glass) {
    const newGlass = [];
    for (let i = 0; i < glass.length; i++) {
      newGlass.push(copyRow(glass[i]));
    }

    return newGlass;
  }

  function getRealCords(figure, cellIndex) {
    const result = {
      x: figure.x + figure.cells[cellIndex].x,
      y: figure.y + figure.cells[cellIndex].y,
    };
    return result;
  }

  function putFigure(figure, glass) {
    const newGlass = copyGlass(glass);

    for (let i = 0; i < figure.cells.length; i++) {
      const coords = getRealCords(figure, i);
      newGlass[coords.y][coords.x] = figure.cells[i].value;
    }
    return newGlass;
  }

  function getMovedFigure(figure, dx, dy, rotate) {
    let newCells = figure.cells;
    const x0 = figure.x0;
    const y0 = figure.y0;
    if (rotate) {
      newCells = [];
      for (let i = 0; i < figure.cells.length; i++) {
        newCells.push({
          ...figure.cells[i],
          x: x0 - (figure.cells[i].y - y0),
          y: y0 + (figure.cells[i].x - x0),
        });
      }
    }

    return {
      ...figure,
      x: figure.x + dx,
      y: figure.y + dy,
      cells: newCells,
    };
  }

  function isValidPosition(figure, glass) {
    for (let i = 0; i < figure.cells.length; i++) {
      const coords = getRealCords(figure, i);
      if (coords.y < 0 || coords.y > glass.length - 1) return false;
      if (coords.x < 0 || coords.x > glass[0].length - 1) return false;
      if (glass[coords.y][coords.x].filled === true) return false;
    }
    return true;
  }

  function moveFigure(dx, dy, rotate) {
    setState((prevState) => {
      const newFigure = getMovedFigure(prevState.figure, dx, dy, rotate);
      if (isValidPosition(newFigure, prevState.glass))
        return {
          ...prevState,
          figure: newFigure,
        };
      else if (dy > 0) {
        return {
          ...prevState,
          figure: getNewFigure(),
          glass: getClearedGlass(putFigure(prevState.figure, prevState.glass)),
        };
      } else {
        return prevState;
      }
    });
  }

  function getClearedGlass(glass) {
    const newGlass = [];
    for (let i = 0; i < glass.length; i++) {
      if (!glass[i].every((cell) => cell.filled === true)) {
        newGlass.push(copyRow(glass[i]));
      } else {
        newGlass.unshift(getEmptyRow(glass[i].length));
      }
    }
    return newGlass;
  }

  function handleUserKeyPress(event) {
    switch (event.key) {
      case "ArrowUp":
        moveFigure(0, 0, true);
        break;
      case "ArrowDown":
        moveFigure(0, 1, false);
        break;
      case "ArrowLeft":
        moveFigure(-1, 0, false);
        break;
      case "ArrowRight":
        moveFigure(1, 0, false);
        break;
      default:
        break;
    }
  }

  const [state, setState] = React.useState({
    rows: 20,
    cols: 10,
    glass: getEmptyGlass(20, 10),
    figure: getNewFigure(),
  });

  React.useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, []);

  React.useEffect(() => {
    let interval = window.setInterval(() => moveFigure(0, 1), 1000);
    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Glass
          value={{
            glass: putFigure(state.figure, state.glass),
            maxWidth: 500,
            maxHight: 500,
          }}
        />
      </header>
    </div>
  );
}

export default App;
