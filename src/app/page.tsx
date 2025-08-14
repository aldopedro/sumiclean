'use client'
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/login");
  }

  function handleConsultar() {
    router.push("/consultar-agendamentos");
  }

  return (
    <div className={styles.main}>
      <button className={styles.buttonConsultar} onClick={handleConsultar}>
        Consultar Agendamentos
      </button>

      <div className={styles.background}>
        <h1 className={styles.title}>BEM-VINDO</h1>
        <h1 className={styles.subtitle}>À <strong>SumiClean</strong></h1>
        <h1 className={styles.description} onClick={e => handleSubmit(e)}>
          Agende serviços <br /> de faxina online
          <div className={styles.backContainer}>
            <button
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
        </h1>
        <div className={styles.gost}></div>
      </div>
    </div>
  );
}
