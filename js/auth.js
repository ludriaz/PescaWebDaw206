
`use strict`
// Importa las funciones necesarias del SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js"; // Inicializa la app de Firebase
import { 
    getAuth, // Obtiene el servicio de autenticación de Firebase
    signInWithEmailAndPassword,
    signOut, //Método para cerrar sesion
    sendPasswordResetEmail, // Método para iniciar sesión con correo y contraseña
    createUserWithEmailAndPassword, // Método para registrar un nuevo usuario con correo y contraseña
    onAuthStateChanged // Metodo para la recuperacion de la sesion
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";


// CONFIGURACION DE FIREBASE
// Estos son los datos necesarios para conectar la aplicación a tu proyecto en Firebase.
// Puedes obtener esta configuración en el panel de Firebase de tu proyecto.
    const firebaseConfig = {
        apiKey: "AIzaSyBqTt1-nvjeBCqhLlqXZJxFcuyDCRJDOl0",
        authDomain: "agriweb-app-daw206.firebaseapp.com",
        projectId: "agriweb-app-daw206",
        storageBucket: "agriweb-app-daw206.firebasestorage.app",
        messagingSenderId: "199469924064",
        appId: "1:199469924064:web:74ed2f179dac2631ebda85",
        measurementId: "G-71N15R9SR3"
      };

// Inicializa Firebase
const app = initializeApp(firebaseConfig); // Inicializa la aplicación con la configuración de Firebase
const auth = getAuth(app); // Obtiene la instancia del servicio de autenticación

// Captura los elementos del DOM
const loginForm = document.getElementById('loginForm');
const messageContainerError = document.getElementById('message-error');
const messageContainerSuccess = document.getElementById('message-success');
const registerButton = document.getElementById('registerButton');
const btnRecuperar = document.getElementById("btnRecuperar");
const logoutButton = document.getElementById("logoutButton");
// Función para mostrar mensajes
function mostrarMensaje(tipo, mensaje) {
    if (tipo === 'error' || tipo === 'registro') {
        messageContainerError.style.display = 'block';
        messageContainerError.textContent = mensaje;
        messageContainerError.style.color = 'red';
        messageContainerSuccess.style.display = 'none';
    } else if (tipo === 'exito') {
        messageContainerSuccess.style.display = 'block';
        messageContainerSuccess.textContent = mensaje;
        messageContainerSuccess.style.color = 'green';
        messageContainerError.style.display = 'none';
        loginForm.style.display = 'none'; // Ocultar el formulario solo en caso de éxito
    }

}

auth.onAuthStateChanged((user)=>{
 console.log("Cambio pagina",user);
});

// Función para obtener mensajes de error personalizados
function obtenerMensajeError(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'El correo electrónico ingresado no es válido.';
        case 'auth/weak-password':
            return 'La contraseña debe tener al menos 6 caracteres.';
        case 'auth/email-already-in-use':
            return 'Este correo electrónico ya está en uso. Por favor, utiliza otro correo o inicia sesión.';
        case 'auth/invalid-credential':
            return 'Contraseña incorrecta, pruebe de nuevo o trate de recuperarla';
        default:
            return 'Ocurrió un error durante la autenticación. Inténtalo de nuevo más tarde.';
    }
}

// REGISTRAR NUEVOS USUARIOS
 export async function registrarUsuario() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        mostrarMensaje('error', 'Por favor, ingresa un correo y una contraseña para registrarte.');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        mostrarMensaje('exito', 'Registro exitoso. ¡Bienvenido!');
        console.log('Nuevo usuario:', userCredential.user.email);

        // Redirigir al usuario al dashboard
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error('Código de error:', error.code);
        mostrarMensaje('error', 'Error en el registro: ' + obtenerMensajeError(error.code));
    }
}

// Asigna la función al botón de registro
if (registerButton) {
registerButton.addEventListener('click', registrarUsuario);
}

async function iniciarSesion(event) {
    event.preventDefault(); // Evita el envío automático del formulario

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        mostrarMensaje('exito', 'Inicio de sesión exitoso');
        console.log("Inicio de sesión exitoso");
        console.log('Usuario:', userCredential.user.email);

        // Redirigir al usuario al dashboard
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error('Error de autenticación:', error); 
        console.error('Código de error:', error.code); 
        console.error('Mensaje de error:', error.message);

        let mensajeError = 'Error en el inicio de sesión. Inténtalo de nuevo más tarde.';

        if (error.code === 'auth/user-not-found') {
            mensajeError = 'Usuario no encontrado. Verifica tus credenciales.';
        } else if (error.code === 'auth/invalid-credential') {
            mensajeError = 'Contraseña incorrecta. Inténtalo de nuevo.';
        } else if (error.code === 'auth/invalid-email') {
            mensajeError = 'Correo electrónico inválido.';
        }

        mostrarMensaje('error', mensajeError);
    }
}

// Asigna la función al evento submit del formulario
if(loginForm){
loginForm.addEventListener('submit', iniciarSesion);
}

async function recuperarContrasena(event) {
    event.preventDefault();

    const email = document.getElementById("emailRecuperar").value.trim();

    if (!email) {
        alert("Por favor, ingresa un correo válido.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
    } catch (error) {
        console.error("Error al enviar correo de recuperación:", error);
        alert("Error: " + error.message);
    }
}

// Asigna la función al botón de recuperación de contraseña
if (btnRecuperar) {
btnRecuperar.addEventListener("click", recuperarContrasena);
}

async function cerrarSesion() {
    try {
        await signOut(auth);
        console.log('Sesión cerrada');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

// Asigna la función al botón de cierre de sesión
if(logoutButton){
logoutButton.addEventListener('click', cerrarSesion);
}
