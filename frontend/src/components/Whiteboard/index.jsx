import { useEffect, useLayoutEffect, useState } from 'react';
import rough from 'roughjs';

const roughGenerator = rough.generator();

const Whiteboard = ({ canvasRef, ctxRef, elements, setElements }) => {
  

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;
  }, []);
  const [isDrawing, setIsDrawing] = useState(false);
  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);

    elements.forEach((element) => {
      roughCanvas.linearPath(element.path);
    });
  }, [elements]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setElements((prevElements) => [
      ...prevElements,
      {
        type: 'pencil',
        offsetX,
        offsetY,
        path: [[offsetX, offsetY]],
        storke: 'black',
        //storkeWidth: 5,
      },
    ]);
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (isDrawing) {
      const { path } = elements[elements.length - 1];
      const newPath = [...path, [offsetX, offsetY]];
      setElements((prevElements) =>
        prevElements.map((ele, index) => {
          if (index === elements.length - 1) {
            return {
              ...ele,
              path: newPath,
            };
          } else {
            return ele;
          }
        })
      );
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="border border-dark border-3 h-100 w-100"
    ></canvas>
  );
};

export default Whiteboard;
