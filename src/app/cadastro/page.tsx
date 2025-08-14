'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./cadastro.module.css";

export default function Cadastro() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [endereco, setEndereco] = useState("");
    const [numero, setNumero] = useState("");
    const [referencia, setReferencia] = useState("");
    const [telefone, setTelefone] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (!nome || !email || !senha || !endereco || !numero || !telefone) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("https://sumiclean-q7p6.onrender.com/cadastro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha, endereco, numero, referencia, telefone })
            });

            if (!response.ok) throw new Error("Erro ao cadastrar.");

            const data = await response.json();

            localStorage.setItem("user", JSON.stringify({
                id: data.id,
                token: data.token
            }));

            router.push("/home");
        } catch (error) {
            console.error(error);
            alert("Erro ao cadastrar.");
        } finally {
            setLoading(false);
        }
    }

    function handleBackClick() {
        window.location.href = "/";
    }

    return (
        <div className={styles.main}>
            <div className={styles.backContainer}>
                <button
                    onClick={handleBackClick}
                    className={styles.backButton}
                    type="button"
                    aria-label="Voltar"
                >
                    <svg
                        className={styles.backArrow}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19 12H5M12 19L5 12L12 5"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <div className={styles.container}>
                <h2 className={styles.title}>Cadastro</h2>

                <div className={styles.field}>
                    <label className={styles.label}>Nome:</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Senha:</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Telefone: </label>
                    <input
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className={styles.input}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Endereço (rua):</label>
                    <input
                        type="text"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Número da residência:</label>
                    <input
                        type="text"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Ponto de referência:</label>
                    <input
                        type="text"
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={styles.button}
                >
                    {loading ? "Cadastrando..." : "Cadastrar"}
                </button>
            </div>
        </div>
    );
}
