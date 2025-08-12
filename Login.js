import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("✅ Login realizado com sucesso!");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          alert("❌ E-mail inválido.");
          break;
        case "auth/user-not-found":
          alert("❌ Usuário não encontrado.");
          break;
        case "auth/wrong-password":
          alert("❌ Senha incorreta.");
          break;
        default:
          alert("⚠️ Erro inesperado. Tente novamente.");
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail"
        required
      />
      <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
        required
      />
      <button type="submit">Entrar</button>
    </form>
  );
}


