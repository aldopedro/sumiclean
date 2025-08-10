'use client'
import styles from "./login.module.css";
import {useState} from "react"
import {useRouter} from "next/navigation";

export default function Home() {
 const router =  useRouter()
const [email, setEmail] = useState<string> ()
const [password, setPassword] = useState<string> ()
const [incorrect, setIncorrect] = useState<boolean> (false)
function handleSubmit (e : React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  if (email === "sumiclean@gmail.com" && password === "Sumidouro2025") {
    router.push("/home")
  } else {
    setIncorrect(true)
  }

}
function handleBackClick() {
    window.location.href = "/";
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
      <div className={styles.background}></div>
      <form className={styles.mainForm} action="" onSubmit={e => handleSubmit(e)}>
        <div className={styles.form}>
          <h2 className={styles.formTitle}>Fazer Login</h2>
          <input className={incorrect ? styles.formIncorrect : styles.formEmail} onChange={e => setEmail(e.target.value)}type="email" name="email" id="email" placeholder="E-mail" />
          <input className={incorrect ? styles.formIncorrect : styles.formPassword} onChange={e => setPassword(e.target.value)} type="password" name="pass" id="pass" placeholder="Senha" />
          <div className={styles.formForget}>

          <span >
            <strong>
              Esqueceu a senha?
              </strong>
              </span>
          </div>
          <button className={styles.formSignin} onClick={handleSubmit} >Entrar</button>
          <button className={styles.formNewUser}>Novo cadastro</button>
        </div>
      </form>
    </div>
  );
}
