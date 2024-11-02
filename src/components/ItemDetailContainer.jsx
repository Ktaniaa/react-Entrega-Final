import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config"; // Asegúrate de que la ruta esté correcta
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import ItemDetail from "./ItemDetail";
import "../styles/onlyOnePCard.css";

const ItemDetailContainer = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (id) {
          // Obtiene un documento específico por su ID
          const docRef = doc(db, "items", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setFilteredProducts([{ id: docSnap.id, ...docSnap.data() }]);
          }
        } else {
          // Obtiene todos los documentos si no hay un `id`
          const itemsRef = collection(db, "items");
          const querySnapshot = await getDocs(itemsRef);
          const itemsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setFilteredProducts(itemsData);
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  // Mensaje de carga
  if (loading) {
    return <p className="cargaProd">Cargando producto...</p>;
  }

  return (
    <div className="CardCSS">
      <ItemDetail product={filteredProducts} /> {/* Muestra los productos filtrados */}
    </div>
  );
};

export default ItemDetailContainer;
