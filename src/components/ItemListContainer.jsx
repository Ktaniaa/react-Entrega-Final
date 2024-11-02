import React, { useEffect, useState } from 'react';
import '../styles/start.css';
import ItemList from './ItemList';
import '../styles/productCard.css';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/config';  // Importa tu configuración de Firebase
import { collection, getDocs, query, where } from "firebase/firestore";

const ItemListContainer = ({ greeting }) => {
  const [products, setProducts] = useState([]);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let productsFiltered = [];

        if (categoryId) {
          // Filtra los productos por categoría
          const productsQuery = query(
            collection(db, "items"),
            where("category", "==", categoryId)
          );
          const querySnapshot = await getDocs(productsQuery);
          productsFiltered = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } else {
          // Obtiene todos los productos si no hay categoría
          const productsQuery = collection(db, "items");
          const querySnapshot = await getDocs(productsQuery);
          productsFiltered = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }
        setProducts(productsFiltered);
      } catch (error) {
        //Error si no encuentro productos
      }
    };

    fetchProducts();
  }, [categoryId]);

  return (
    <>    
      <h1>{greeting}</h1>
      <p className="textoInicio">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui tenetur veritatis non aperiam quisquam similique molestias excepturi placeat repellendus laudantium impedit, repellat, consequuntur quos laborum distinctio, labore accusantium! Quibusdam, esse.</p>
      <div className='productCardCSS'>
        <ItemList products={products}/>
      </div>
    </>
  );
}

export default ItemListContainer;
