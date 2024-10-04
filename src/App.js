import "./App.css"
import {useEffect, useRef, useState} from "react";
import Matter from "matter-js"

function ramdomInt(min, until) {
  const rand = Math.random() * 100000 % (until - min) + min;

  return rand;
}

function App() {
  const canvasRef = useRef();
  const [windowSize, setWindowSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  })

  const [reCount, setReCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Render = Matter.Render;
    const engine = Engine.create()
    const world = engine.world;
    const runner = Matter.Runner.create();

    let shapes = [];

    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: windowSize.width,
        height: windowSize.height,
        isStatic: true,
        wireframes: false,
      }
    })

    const bottomWall = Bodies.rectangle(
      windowSize.width / 2,
      windowSize.height + 5,
      windowSize.width,
      10,
      {
        isStatic: true,
        render: {
          // opacity : 0,
          fillStyle: "red"
        }
      })
    shapes.push(bottomWall)

    const leftWall = Bodies.rectangle(
      -5, windowSize.height / 2, 10, windowSize.height, {
        isStatic: true,
        render: {
          fillStyle: "red"
        }
      })
    shapes.push(leftWall)

    const rightWall = Bodies.rectangle(
      windowSize.width + 5,
      windowSize.height / 2,
      10,
      windowSize.height,
      {
        isStatic: true,
        render: {
          fillStyle: "red"
        }
      })
    shapes.push(rightWall)

    const shapeCount = windowSize.width / 50

    for (let i = 0; i < shapeCount; i++) {
      const width = ramdomInt(50, 150);
      const height = ramdomInt(50, 150);
      const r = ramdomInt(0, 256)
      const g = ramdomInt(0, 256)
      const b = ramdomInt(0, 256)

      const angle = 0//ramdomInt(0, 91);

      const x = ramdomInt(width / 2, windowSize.width - width / 2)
      const y = ramdomInt(-200, -100)

      const shape = Bodies.rectangle(x, y, width, height,
        {
          angle,
          render: {
            fillStyle: `rgb(${r}, ${g}, ${b})`
          },
          restitution: 0.8,
        })

      shapes.push(shape)
    }

    World.add(world, shapes)
    Matter.Runner.run(runner, engine);
    Render.run(render)

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      Render.stop(render);
      World.clear(world, false);
      Engine.clear(engine);
      render.canvas.remove();
    }
  }, [reCount, windowSize])

  return (
    <div className="App">
      <div className="canvas" ref={canvasRef}></div>

      <div className="menu">
        <button onClick={() => {
          setReCount(reCount + 1)
        }}>다시 재생
        </button>

        {windowSize.width},
        {windowSize.height}
      </div>

    </div>
  );

}

export default App;
