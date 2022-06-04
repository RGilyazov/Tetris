import "./App.css";
import Glass from "./components/glass";
import React from "react";
import shortid from "shortid";
import {
  figuresArr,
  colorsArr,
  touchZoneSizeX,
  sensitivity,
  touchZoneSizeY,
} from "./Constants";

function App() {
  function getRandomColor() {
    return colorsArr[Math.floor(Math.random() * colorsArr.length)];
  }
  function getNewFigure(cols) {
    const figNum = Math.floor(Math.random() * figuresArr.length);
    const color = getRandomColor();
    return {
      ...figuresArr[figNum],
      cells: figuresArr[figNum].cells.map((cell) => ({
        ...cell,
        value: { ...cell.value, color: color },
      })),
      x: Math.floor((cols - 2) / 2),
      y: 0,
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

  const [state, setState] = React.useState({
    rows: 20,
    cols: 10,
    glass: getEmptyGlass(20, 10),
    figure: getNewFigure(10),
    nextFigure: getNewFigure(10),
    score: 0,
    speed: 1,
    pause: false,
    gameOver: false,
    lastScore: 0,
    lastSpeed: 1,
  });

  const [action, setAction] = React.useState("");

  function togglePause() {
    setState((prevState) => {
      console.log(prevState);
      return { ...prevState, pause: !prevState.pause, gameOver: false };
    });
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
      if (prevState.pause) return prevState;
      const newFigure = getMovedFigure(prevState.figure, dx, dy, rotate);
      if (isValidPosition(newFigure, prevState.glass))
        return {
          ...prevState,
          figure: newFigure,
        };
      else if (dy > 0) {
        if (prevState.figure.y === 0) {
          return {
            ...prevState,
            figure: prevState.nextFigure,
            nextFigure: getNewFigure(state.cols),
            glass: getEmptyGlass(prevState.rows, prevState.cols),
            lastScore: prevState.score,
            lastSpeed: prevState.speed,
            speed: 1,
            score: 0,
            gameOver: true,
            pause: true,
          };
        } else {
          let { glass: newGlass, add_score } = getClearedGlass(
            putFigure(prevState.figure, prevState.glass)
          );

          return {
            ...prevState,
            figure: prevState.nextFigure,
            nextFigure: getNewFigure(state.cols),
            glass: newGlass,
            score: prevState.score + add_score,
            speed: 1 + Math.floor((prevState.score + add_score) / 20),
          };
        }
      } else {
        return prevState;
      }
    });
  }

  function getClearedGlass(glass) {
    let add_score = 0;
    const newGlass = [];
    for (let i = 0; i < glass.length; i++) {
      if (!glass[i].every((cell) => cell.filled === true)) {
        newGlass.push(copyRow(glass[i]));
      } else {
        newGlass.unshift(getEmptyRow(glass[i].length));
        add_score += 1;
      }
    }
    return { glass: newGlass, add_score: add_score };
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
      case " ":
        togglePause();
        break;
      default:
        break;
    }
  }

  function makeAction() {
    switch (action) {
      case "Rotate":
        moveFigure(0, 0, true);
        break;
      case "MoveDown":
        moveFigure(0, 1, false);
        break;
      case "MoveLeft":
        moveFigure(-1, 0, false);
        break;
      case "MoveRight":
        moveFigure(1, 0, false);
        break;
      default:
        break;
    }
  }

  function handleTouchStart(event) {
    const x = event.changedTouches[0].clientX;
    const y = event.changedTouches[0].clientY;
    event.stopPropagation();
    event.preventDefault();
    if (y > window.innerHeight * (1 - touchZoneSizeY)) setAction("MoveDown");
    else if (x < window.innerWidth * touchZoneSizeX) setAction("MoveLeft");
    else if (x > window.innerWidth * (1 - touchZoneSizeX))
      setAction("MoveRight");
    else setAction("Rotate");
  }

  React.useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  });

  React.useEffect(() => {
    let interval = window.setInterval(() => makeAction(), sensitivity);
    return () => {
      window.clearInterval(interval);
    };
  });

  React.useEffect(() => {
    let interval = window.setInterval(
      () => moveFigure(0, 1),
      1000 / state.speed
    );
    return () => {
      window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.speed]);

  React.useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
    };
  });

  React.useEffect(() => {
    const clearAction = () => setAction("");
    window.addEventListener("touchend", clearAction);
    return () => {
      window.removeEventListener("touchend", clearAction);
    };
  });

  return (
    <div className="App">
      <header className="App-header">
        <Glass
          value={{
            glass: putFigure(state.figure, state.glass),
            maxWidth: window.innerWidth,
            maxHight: window.innerHeight,
            score: state.score,
            speed: state.speed,
          }}
          pause={state.pause}
          gameOver={state.gameOver}
          lastScore={state.lastScore}
          lastSpeed={state.lastSpeed}
          preview={false}
          previewGlass={putFigure(
            { ...state.nextFigure, x: 0 },
            getEmptyGlass(4, 3)
          )}
        />
      </header>
    </div>
  );
}

export default App;
