'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';

export default function Pagamento() {
    const router = useRouter();
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<'cartao' | 'pix' | 'dinheiro' | null>(null);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h2 className={styles.title}>Escolha a forma de pagamento</h2>

        <div className={styles.buttonsGroup}>
          <button
            type="button"
            className={`${styles.paymentButton} ${pagamentoSelecionado === 'cartao' ? styles.selected : ''}`}
            onClick={() => setPagamentoSelecionado('cartao')}
          >
            Cartão
          </button>
          <button
            type="button"
            className={`${styles.paymentButton} ${pagamentoSelecionado === 'pix' ? styles.selected : ''}`}
            onClick={() => setPagamentoSelecionado('pix')}
          >
            Pix
          </button>
          <button
            type="button"
            className={`${styles.paymentButton} ${pagamentoSelecionado === 'dinheiro' ? styles.selected : ''}`}
            onClick={() => setPagamentoSelecionado('dinheiro')}
          >
            Dinheiro
          </button>
        </div>

        <div className={styles.paymentDetails}>
          {pagamentoSelecionado === 'cartao' && (
            <form className={styles.cartaoForm} onSubmit={(e) => e.preventDefault()}>
              <label>
                Número do cartão
                <input type="text" maxLength={19} placeholder="1234 5678 9012 3456" />
              </label>
              <label>
                Nome no cartão
                <input type="text" placeholder="Nome impresso no cartão" />
              </label>
              <label>
                Data de validade
                <input type="month" placeholder="MM/AA" />
              </label>
              <label>
                Código de segurança (CVV)
                <input type="text" maxLength={4} placeholder="123" />
              </label>
            </form>
          )}

          {pagamentoSelecionado === 'pix' && (
            <div className={styles.pixContainer}>
              <img src="/qrcode.png" alt="QR Code Pix" className={styles.qrCode} />
              <p>Escaneie o QR Code para pagar via Pix</p>
            </div>
          )}

          {pagamentoSelecionado === 'dinheiro' && (
            <p className={styles.dinheiroText}>
              O pagamento em dinheiro será recebido após o término da faxina.
            </p>
          )}

          {!pagamentoSelecionado && (
            <p className={styles.selectText}>Por favor, selecione uma forma de pagamento.</p>
          )}
        </div>

        <button
          className={styles.finalizarButton}
          onClick={() => router.push('/end')}
          disabled={!pagamentoSelecionado}
        >
          Finalizar
        </button>
      </div>
    </main>
  );
}
