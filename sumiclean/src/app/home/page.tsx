'use client'
import React, { useState } from "react";
import styles from "./page.module.css";
import img1 from "../../../public/img1.png";
import img2 from "../../../public/img2.png";
import img3 from "../../../public/img3.png";
import img4 from "../../../public/img4.png";
import img5 from "../../../public/img5.png";

type TwoOptions = 1 | 2 | null;
type ThreeOptions = 1 | 2 | 3 | null;

const imagesTwo = [
  img1.src,
  img2.src,
];

const imagesThree = [
  img3.src,
  img4.src,
  img5.src,
];

const Home: React.FC = () => {
  const [selectedTwo, setSelectedTwo] = useState<TwoOptions>(null);
  const [selectedThree, setSelectedThree] = useState<ThreeOptions>(null);
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async () => {
    if (
      !selectedTwo ||
      !selectedThree ||
      !date.trim() ||
      !hour.trim() ||
      !address.trim()
    ) {
      alert("Preencha todos os campos e selecione uma opção de cada grupo.");
      return;
    }

    const payload = {
      service: selectedTwo,
      location: selectedThree,
      date,
      hour,
      address,
    };

    try {
      const response = await fetch("/api/agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("Agendamento enviado com sucesso!");
      } else {
        alert("Erro ao enviar agendamento.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className={styles.main}>
      <div>
        <h1>Qual serviço você deseja?</h1>
        <div>
          {imagesTwo.map((img, idx) => (
            <label
              key={idx}
              className={`${styles.checkboxContainer} ${selectedTwo === idx + 1 ? styles.checked : ""}`}
            >
              <img src={img} alt={`Opção ${idx + 1}`} className={styles.checkboxImage} />
              <input
                type="checkbox"
                className={styles.customCheckbox}
                checked={selectedTwo === idx + 1}
                onChange={() => setSelectedTwo(selectedTwo === idx + 1 ? null : (idx + 1 as TwoOptions))}
              />
            </label>
          ))}
        </div>
        <h1>Onde será o serviço?</h1>
        <div style={{ marginTop: "24px" }}>
          {imagesThree.map((img, idx) => (
            <label
              key={idx}
              className={`${styles.checkboxContainer} ${selectedThree === idx + 1 ? styles.checked : ""}`}
            >
              <img src={img} alt={`Opção ${String.fromCharCode(65 + idx)}`} className={styles.checkboxImage} />
              <input
                type="checkbox"
                className={styles.customCheckbox}
                checked={selectedThree === idx + 1}
                onChange={() => setSelectedThree(selectedThree === idx + 1 ? null : (idx + 1 as ThreeOptions))}
              />
            </label>
          ))}
        </div>
        <div className={styles.mainSchedule}>
          <h1>Detalhes de Agendamento</h1>
          <input
            type="text"
            name="date"
            id="date"
            placeholder="Data da faxina"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <input
            type="text"
            name="hour"
            id="hour"
            placeholder="Hora desejada"
            value={hour}
            onChange={e => setHour(e.target.value)}
          />
          <input
            type="text"
            name="addres"
            id="addres"
            placeholder="Endereço"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          <button type="button" onClick={handleSubmit}>
            Agendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;