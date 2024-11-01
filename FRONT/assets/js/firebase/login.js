import { auth } from "./core.js";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

function logout() {
  return signOut(auth);
}

function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

function register(email, password, displayName) {
  return createUserWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      const user = userCredential.user;
      return updateProfile(user, { displayName });
    }
  );
}

function authStateListener(callback) {
  onAuthStateChanged(auth, callback);
}

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      login(email, password)
        .then(() => {
          console.log("Login bem-sucedido, redirecionando...");
          // Alteração aqui: use o caminho correto para Home.html
          window.location.href = "/FRONT/assets/Home.html";
        })
        .catch((error) => {
          console.error("Erro ao fazer login:", error);
          alert("Falha no login. Verifique seu e-mail e senha.");
        });
    });
  }
});

// Função adicional para lidar com o login
function handleLogin(email, password) {
  login(email, password)
    .then(() => {
      console.log("Login bem-sucedido via handleLogin, redirecionando...");
      // Alteração aqui também
      window.location.href = "/FRONT/assets/Home.html";
    })
    .catch((error) => {
      console.error("Erro ao fazer login:", error);
      alert("Usuário ou senha inválidos");
    });
}

export {
  login,
  logout,
  resetPassword,
  register,
  authStateListener,
  handleLogin,
};
// ... código de autenticação existente ...
