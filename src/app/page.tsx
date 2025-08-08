'use client'
import styles from "./page.module.css";
import {useRouter} from "next/navigation";

export default function Home() {
 const router =  useRouter()
function handleSubmit (e : React.FormEvent) {
  e.preventDefault()
  router.push("/login")}


  return (
    <div className={styles.main}>
      <div className={styles.background}>
        <h1 className={styles.title}>BEM-VINDO</h1>
        <h1 className={styles.subtitle}>À <strong>SumiClean</strong></h1>
        <h1 className={styles.description} onClick={e => handleSubmit(e)}>Agende serviços <br/> de faxina online</h1>
        <div className={styles.gost}></div>
      </div>
    </div>
  );
}
