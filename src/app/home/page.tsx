'use client'
import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import img1 from "../../../public/img1.png";
import img2 from "../../../public/img2.png";

type TwoOptions = 1 | 2 | null;

const imagesTwo = [
  img1.src,
  img2.src,
];

const Home: React.FC = () => {
  const [selectedTwo, setSelectedTwo] = useState<TwoOptions>(null);

  function handleSubmit() {
    if (selectedTwo === 1) {
      window.location.href = `/home/leve`;
    } else if (selectedTwo === 2) {
      window.location.href = `/home/pesada`;
    } else {
      alert("Selecione uma opção!");
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1>Qual serviço você deseja?</h1>
        <div>
          {imagesTwo.map((img, idx) => (
            <label
              key={idx}
              className={`${styles.checkboxContainer} ${selectedTwo === idx + 1 ? styles.checked : ""}`}
            >
              <Image
                src={img}
                alt={`Opção ${idx + 1}`}
                className={styles.checkboxImage}
                width={166}
                height={218}
              />
              <input
                type="radio"
                name="servico"
                className={styles.customCheckbox}
                checked={selectedTwo === idx + 1}
                onChange={() => setSelectedTwo(idx + 1 as TwoOptions)}
              />
            </label>
          ))}
        </div>
        <button className={styles.buttonSubmit} onClick={handleSubmit}>Agendar</button>
      </div>
    </div>
  );
}

export default Home;