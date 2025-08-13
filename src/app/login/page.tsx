'use client';

import styles from "./login.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [incorrect, setIncorrect] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        if (!email || !password) {
            setIncorrect(true);
            return;
        }

        try {
            setLoading(true);
            setIncorrect(false);

            const response = await fetch("https://sumiclean-q7p6.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha: password })
            });

            if (!response.ok) {
                setIncorrect(true);
                return;
            }

            const data = await response.json();

            // Salva dados do usuário no localStorage
            localStorage.setItem("user", JSON.stringify({
                id: data.id,
                token: data.token
            }));

            router.push("/home");
        } catch (error) {
            console.error(error);
            setIncorrect(true);
        } finally {
            setLoading(false);
        }
    }

    function handleBackClick() {
        window.location.href = "/";
    }

    function handleNewUser() {
        router.push("/cadastro");
    }

    return (
        <div className={styles.main}>
            <div className={styles.background}></div>

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

            <form className={styles.mainForm} onSubmit={handleSubmit}>
                <div className={styles.form}>
                    <h2 className={styles.formTitle}>Fazer Login</h2>

                    <input
                        className={incorrect ? styles.formIncorrect : styles.formEmail}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        placeholder="E-mail"
                    />
                    <input
                        className={incorrect ? styles.formIncorrect : styles.formPassword}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        placeholder="Senha"
                    />

                    {incorrect && (
                        <p style={{ color: "red", fontSize: "0.9rem" }}>
                            Email ou senha incorretos.
                        </p>
                    )}

                    <div className={styles.formForget}>
                        <span><strong>Esqueceu a senha?</strong></span>
                    </div>

                    <button className={styles.formSignin} type="submit" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>

                    <button
                        className={styles.formNewUser}
                        type="button"
                        onClick={handleNewUser}
                    >
                        Novo cadastro
                    </button>
                </div>
            </form>
        </div>
    );
}
