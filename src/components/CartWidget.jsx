import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config'; // Asegúrate de que este sea el path correcto a tu configuración de Firebase
import { collection, query, where, getDocs } from 'firebase/firestore';
import imgCart from '../assets/cart.png';

const CartWidget = () => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const fetchItemCount = async () => {
      try {
        // Consulta la colección de órdenes con estado "generada"
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('status', '==', 'generada'));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          let totalItems = 0;
          querySnapshot.forEach((doc) => {
            const orderData = doc.data();
            if (orderData.items && Array.isArray(orderData.items)) {
              // Suma la cantidad de cada artículo en la orden
              totalItems += orderData.items.reduce((sum, item) => sum + item.quantity, 0);
            }
          });
          setItemCount(totalItems);
        } else {
          setItemCount(0); // No hay órdenes "generadas"
        }
      } catch (error) {
        console.error('Error al obtener la cantidad de artículos:', error);
      }
    };

    fetchItemCount();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={imgCart} width={18} alt="Cart" />
      <label style={{ marginLeft: '5px' }}>{itemCount}</label>
    </div>
  );
};

export default CartWidget;
