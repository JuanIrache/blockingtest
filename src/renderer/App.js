import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

export default () => {
  const [counter, setCounter] = useState(0);
  const [result, setResult] = useState(null);

  const solved = (e, data) => setResult(data);

  useEffect(() => {
    ipcRenderer.on('result', solved);
    return () => {
      ipcRenderer.removeListener('result', solved);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setCounter(counter + 1);
    }, 1);
  }, [counter]);

  const onClick = () => {
    setResult(0);
    ipcRenderer.send('expensive', counter);
  };

  return (
    <div>
      <div className="counter">Counter: {counter}</div>
      <button onClick={onClick}>Expensive</button>
      <div className="result">Expensive computation result: {result}</div>
    </div>
  );
};
