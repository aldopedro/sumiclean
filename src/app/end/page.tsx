'use client'
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function End() {
  const router = useRouter();

  function handleRetornar() {
    router.push('/');
  }

  return (
    <div className={styles.main}>
      <button className={styles.buttonConsultar} onClick={handleRetornar}>
        Retornar ao início
      </button>
      <div className={styles.background}></div>
    </div>
  );
}
