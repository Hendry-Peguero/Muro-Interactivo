import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, query, onSnapshot } from "firebase/firestore";
import appFirebase from "../credenciales";
import "./Publications.css";

const db = getFirestore(appFirebase);

const Publications = ({ correoUsuario, handleLogout, onLoginClick }) => {
    const [publicaciones, setPublicaciones] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");

    useEffect(() => {
        const q = query(collection(db, "publicaciones"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const publicacionesArray = [];
            querySnapshot.forEach((doc) => {
                publicacionesArray.push({ id: doc.id, ...doc.data() });
            });
            setPublicaciones(publicacionesArray);
        });
        return () => unsubscribe();
    }, []);

    const handleCrearPublicacion = async () => {
        if (nuevoComentario.trim() === "") {
            alert("El comentario no puede estar vacío");
            return;
        }

        try {
            await addDoc(collection(db, "publicaciones"), {
                comentario: nuevoComentario,
                usuario: correoUsuario,
                fecha: new Date()
            });
            setNuevoComentario("");
        } catch (error) {
            console.error("Error al crear publicación: ", error);
            alert("Error al crear publicación");
        }
    };

    return (
        <div className="publications-container">
            <h1>Publications</h1>
            {correoUsuario ? (
                <>
                    <div className="welcome-container">
                        <p>Bienvenido, {correoUsuario}</p>
                        <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
                    </div>
                    <div className="new-post-container">
                        <input 
                            type="text" 
                            placeholder="Escribe un comentario" 
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                        />
                        <button className="create-post-button" onClick={handleCrearPublicacion}>Crear Publicación</button>
                    </div>
                </>
            ) : (
                <button className="login-button" onClick={onLoginClick}>Iniciar Sesión / Registrarse</button>
            )}
            <div className="posts-list">
                {publicaciones.map((pub) => (
                    <div key={pub.id} className="post">
                        <p>{pub.comentario}</p>
                        <small>{pub.usuario} - {new Date(pub.fecha.seconds * 1000).toLocaleString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Publications;
