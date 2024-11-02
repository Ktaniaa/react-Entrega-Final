import React from 'react';
import '../styles/productCard.css';
import { NavLink } from 'react-router-dom';

const Item = ({ item }) => {
  return (
    <ul>
      <li><img src={item.image} alt={item.title} /></li>
      <li><h2>{item.title}</h2></li>
      <li><span>{item.description}</span></li>
      <li><span>${item.price}</span></li>
      <li><NavLink to={`/detail/${item.id}`}><button>Ver Detalle</button></NavLink></li>
    </ul>
  );
};

export default Item;
