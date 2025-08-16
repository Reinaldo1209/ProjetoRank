import React, { useState } from 'react';
import axios from 'axios';

const PIX_API_URL = 'https://api.exemplo.com/pix'; // Troque pela URL real da API

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      // Exemplo de payload, ajuste conforme sua API
      const response = await axios.post(PIX_API_URL, {
        valor: 5.00, // valor por concurso cadastrado
        descricao: 'Pagamento por cadastro de gabarito',
        // outros dados do usuário se necessário
      });
      setPixData(response.data);
    } catch (err) {
      setError('Erro ao gerar cobrança. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #eee' }}>
      <h1>Checkout</h1>
  <p>Valor: <strong>R$ 5,00</strong> por concurso cadastrado</p>
      <button onClick={handleCheckout} disabled={loading || pixData} style={{ padding: '12px 24px', fontSize: '1.1rem', background: '#00B37E', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
        {loading ? 'Gerando cobrança...' : 'Gerar QR Code PIX'}
      </button>
      {error && <p style={{ color: 'red', marginTop: 16 }}>{error}</p>}
      {pixData && (
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <h2>Pagamento via PIX</h2>
          <img src={pixData.qrCodeImageUrl} alt="QR Code PIX" style={{ width: 200, height: 200, marginBottom: 16 }} />
          <p><strong>Copia e Cola:</strong></p>
          <textarea value={pixData.copiaECola} readOnly style={{ width: '100%', fontSize: '1rem', marginBottom: 16 }} />
          <p><strong>Chave PIX:</strong> {pixData.chavePix}</p>
          <p style={{ color: '#00B37E', fontWeight: 'bold' }}>Após o pagamento, sua assinatura será ativada automaticamente.</p>
        </div>
      )}
    </div>
  );
}

export default Checkout;
