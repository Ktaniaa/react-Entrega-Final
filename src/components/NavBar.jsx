import React from 'react'
/*Importo el CSS correspondiente a la Barra de navegacion*/ 
import '../styles/navbar.css'
import CartWidget from './CartWidget'
import {Link, NavLink } from 'react-router-dom'

const NavBar = () => {
  return (
    <ul className='naveBar'>
        <li><NavLink to={"/"}>Home</NavLink></li>
        <li><NavLink to={"/category/women's clothing"}>Women's clothing</NavLink></li>
        <li><NavLink to={"/category/men's clothing"}>Men's clothing</NavLink></li>
        <li><NavLink to={"/category/electronics"}>Electronics</NavLink></li>
        <li><NavLink to={"/category/jewelery"}>Jewelery</NavLink></li>
        {/*Importo CartWidget para utilizarlo dentro de la NavBar*/}
        <li><NavLink to={"/cart"}><CartWidget/></NavLink></li>
    </ul>
  )
}

export default NavBar