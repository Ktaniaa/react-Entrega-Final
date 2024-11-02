import React from "react";
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import '../styles/onlyOnePCard.css';
import ItemCount from "./ItemCount";
import { db } from '../firebase/config';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import Swal from "sweetalert2"; // Importar SweetAlert2

const ItemDetail = ({ product }) => {
    const navigate = useNavigate(); // Inicializar useNavigate

    // Verificar si el array `product` tiene elementos
    if (!product || product.length === 0) {
        return <p>No se encontraron productos</p>;
    }

    const handleAddToCart = async (quantity, item) => {
        try {
            // Buscar una orden existente con estado "generada"
            const ordersRef = collection(db, 'orders');
            const q = query(ordersRef, where('status', '==', 'generada'));
            const querySnapshot = await getDocs(q);

            let orderRef;
            let orderId;

            if (!querySnapshot.empty) {
                const existingOrder = querySnapshot.docs[0];
                orderRef = doc(db, 'orders', existingOrder.id);
                const orderData = existingOrder.data();

                let items = orderData.items || [];
                let totalAmount = orderData.totalAmount || 0;

                // Buscar si el artículo ya existe en el array
                const existingItemIndex = items.findIndex((i) => i.itemId === item.id);

                if (existingItemIndex >= 0) {
                    items[existingItemIndex].quantity += quantity;
                } else {
                    items.push({
                        itemId: item.id,
                        title: item.title,
                        description: item.description,
                        price: item.price,
                        quantity: quantity,
                    });
                }

                totalAmount += item.price * quantity;

                await updateDoc(orderRef, {
                    items,
                    totalAmount,
                });
            } else {
                const counterRef = doc(db, 'counters', 'orderCounter');
                const counterSnap = await getDoc(counterRef);

                if (counterSnap.exists()) {
                    const currentCounter = counterSnap.data().lastOrderId;
                    orderId = currentCounter + 1;

                    await updateDoc(counterRef, {
                        lastOrderId: orderId,
                    });
                } else {
                    orderId = 1;
                    await setDoc(counterRef, {
                        lastOrderId: orderId,
                    });
                }

                orderRef = await addDoc(ordersRef, {
                    orderId: orderId,
                    items: [{
                        itemId: item.id,
                        title: item.title,
                        description: item.description,
                        price: item.price,
                        quantity: quantity,
                    }],
                    totalAmount: item.price * quantity,
                    orderDate: new Date(),
                    status: "generada",
                });
            }

            // Mostrar alerta de éxito con SweetAlert2
            await Swal.fire({
                title: "Artículo agregado al carrito",
                text: "¡Has agregado un artículo exitosamente!",
                icon: "success",
                confirmButtonText: "Aceptar"
            });

            navigate('/'); // Redirigir a la página de inicio
            window.location.reload(); // Forzar recarga de la página
        } catch (error) {
            console.error("Error al agregar el artículo al carrito:", error);
        }
    };

    return (
        <ul>
            {product.map((item, index) => (
                <li key={index}>
                    <img src={item.image} alt={item.title} />
                    <h2>{item.title}</h2>
                    <span>{item.description}</span>
                    <p>${item.price}</p>
                    <p>Count: {item.count}</p>
                    <p>Rate: {item.rate}</p>
                    <ItemCount onAdd={(quantity) => handleAddToCart(quantity, item)} />
                </li>
            ))}
        </ul>
    );
};

export default ItemDetail;
