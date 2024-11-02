// ItemCount.js
import React, { useState } from 'react';

const ItemCount = ({ onAdd }) => {
  const [count, setCount] = useState(1);

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => {
    if (count > 1) setCount(count - 1);
  };

  return (
    <div>
        <button onClick={handleDecrement}>-</button>
        <span>{count}</span>
        <button onClick={handleIncrement}>+</button><br/>
        <button onClick={() => onAdd(count)}>Agregar al carrito</button>
    </div>
  );
};

export default ItemCount;
