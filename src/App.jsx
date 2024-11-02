import CartWidget from "./components/CartWidget"
import ItemListContainer from "./components/ItemListContainer"
import NavBar from "./components/NavBar"
import { useState } from "react"
import { BrowserRouter, Route , Routes } from "react-router-dom"
import ItemDetailContainer from "./components/ItemDetailContainer"
import Cart from "./components/Cart"


/* Contenido del HTML */


function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar/>
          <Routes>
            <Route path = "/" element = {<ItemListContainer greeting="Home"/>}/>
            <Route path = "/category/:categoryId" element={<ItemListContainer greeting="Home"/>}/>
            <Route path = "/detail/:id" element={<ItemDetailContainer/>}/>
            <Route path = "/cart" element={<Cart/>}/>
            <Route path = "*" />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
