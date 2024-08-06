import React, { useState } from "react";
import appFirebase from "../credenciales";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import "./Login.css";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const Login = ({ onAuthSuccess }) => {
    const [registrando, setRegistrando] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [apellido, setApellido] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (registrando) {
                const emailFake = `${nombreUsuario}@fake.com`; // Crear un email ficticio
                const userCredential = await createUserWithEmailAndPassword(auth, emailFake, password);
                await updateProfile(userCredential.user, {
                    displayName: `${nombreUsuario} ${apellido}`
                });
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    nombreUsuario,
                    apellido
                });
                alert('Usuario registrado con éxito');
            } else {
                const emailFake = `${nombreUsuario}@fake.com`;
                const userCredential = await signInWithEmailAndPassword(auth, emailFake, password);
                const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    alert(`Inicio de sesión exitoso. Bienvenido, ${userData.nombreUsuario} ${userData.apellido}`);
                } else {
                    throw new Error('Usuario no encontrado');
                }
            }
            onAuthSuccess();
            setNombreUsuario('');
            setApellido('');
            setPassword('');
        } catch (error) {
            console.error(error);
            alert('Error: ' + error.message);
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Ingresar Nombre de Usuario"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        id='nombreUsuario'
                    />
                    {registrando && (
                        <input 
                            type="text" 
                            placeholder="Ingresar Apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            id='apellido'
                        />
                    )}
                    <input 
                        type="password" 
                        placeholder="Ingresar Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="submit-button" type="submit" disabled={loading}>
                        {registrando ? "Regístrate" : "Inicia Sesión"}
                    </button>
                </form>
                <h4>
                    {registrando ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
                    <button className="toggle-button" onClick={() => setRegistrando(!registrando)} disabled={loading}>
                        {registrando ? "Inicia Sesión" : "Regístrate"}
                    </button>
                </h4>
            </div>
        </div>
    );
};

export default Login;
