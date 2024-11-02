import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import "../styles/cart.css";
import Swal from "sweetalert2"; // Importar SweetAlert2

const Cart = () => {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    confirmEmail: ""
  });
  const [emailError, setEmailError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate(); // Inicializar useNavigate

  useEffect(() => {
    const fetchOrder = async () => {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("status", "==", "generada"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        const orderData = orderDoc.data();
        setOrderId(orderDoc.id);
        setItems(orderData.items || []);
        setTotalAmount(orderData.totalAmount || 0);
      }
    };

    fetchOrder();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEmailValidation = () => {
    setEmailError(formData.email !== formData.confirmEmail ? "Los emails no coinciden" : null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmPurchase = async () => {
    if (Object.values(formData).some((field) => field.trim() === "")) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (emailError) {
      alert("Por favor, corrige los errores antes de confirmar.");
      return;
    }

    try {
      if (orderId) {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
          status: "finalizada",
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            email: formData.email,
          }
        });

        await Swal.fire({
          title: `Orden ${orderId} generada con éxito`,
          text: "¡Gracias por tu compra!",
          icon: "success",
          confirmButtonText: "Aceptar"
        });

        setItems([]);
        setTotalAmount(0);
        closeModal();
        navigate('/');
        window.location.reload();
      } else {
        alert("No se encontró ninguna orden para finalizar.");
      }
    } catch (error) {
      console.error("Error al confirmar la compra:", error);
      alert("Hubo un error al procesar la compra.");
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = items.filter(item => item.itemId !== itemId);
    setItems(updatedItems);
    const newTotalAmount = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(newTotalAmount);

    if (orderId) {
      const orderRef = doc(db, "orders", orderId);
      updateDoc(orderRef, { items: updatedItems, totalAmount: newTotalAmount })
        .then(() => {
          // Recargar la página después de actualizar la base de datos
          window.location.reload();
        })
        .catch(error => console.error("Error al actualizar la orden:", error));
    }
  };

  return (
    <div>
      <h1>Carrito de Compras</h1>

      {items.length > 0 ? (
        <ul className="cartContent">
          {items.map((item) => (
            <li key={item.itemId}>
              <h2>{item.title}</h2>
              <p>Descripcion: {item.description}</p>
              <p>Cantidad: {item.quantity}</p>
              <p>Precio unitario: ${item.price}</p>
              <p>Subtotal: ${item.price * item.quantity}</p>
              <button onClick={() => handleRemoveItem(item.itemId)}>Eliminar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay productos en el carrito.</p>
      )}

      {totalAmount > 0 && <h3>Total de la orden: ${totalAmount}</h3>}

      {items.length > 0 && (
        <button onClick={openModal}>Finalizar compra</button>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Datos del Cliente</h2>
            <form>
              <label>
                Nombre:
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <br />
              <label>
                Apellido:
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <br />
              <label>
                Teléfono:
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <br />
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleEmailValidation}
                  required
                />
              </label>
              <br />
              <label>
                Confirmar Email:
                <input
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleInputChange}
                  onBlur={handleEmailValidation}
                  required
                />
              </label>
              {emailError && <p style={{ color: "red" }}>{emailError}</p>}
              <br />
              <button type="button" onClick={closeModal}>Cancelar</button>
              <button type="button" onClick={handleConfirmPurchase}>Confirmar Compra</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
