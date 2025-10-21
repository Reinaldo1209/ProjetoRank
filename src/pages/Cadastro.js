// src/pages/Cadastro.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// styles moved to src/pages/global.css (CSS variables + utility classes)
import { useAuth } from '../context/AuthContext';

// --- ÍCONES (SVG Paths) ---
const ICONS = {
    user: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    email: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    lock: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
    eye: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
    eyeOff: "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75C21.27 7.61 17 4.5 12 4.5c-1.25 0-2.44.23-3.53.65l1.99 1.99c.52-.09 1.05-.14 1.54-.14zM2.38 4.21L1.21 5.38l2.27 2.27C2.18 8.99 1.19 10.43 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l2.05 2.05 1.17-1.17L3.55 3.05 2.38 4.21zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
};

// --- ESTILOS DA PÁGINA ---
const pageStyles = {
    layoutContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 140px)', // Ajustar conforme altura do seu header/footer
        padding: '2rem',
    },
    formSide: {
        flex: 1,
        maxWidth: '500px',
        padding: '2rem',
    },
    illustrationSide: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--background-gradient)',
        borderRadius: '16px',
        textAlign: 'center',
        color: 'var(--text-dark)',
    },
    inputGroup: {
        position: 'relative',
        marginBottom: '1rem',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '2px solid var(--border)',
        backgroundColor: 'var(--background-light)',
        fontSize: '1rem',
        paddingLeft: '40px',
    },
    inputIcon: {
        position: 'absolute',
        left: '12px',
        top: '14px', // Alinhado com o input
        color: 'var(--text-medium)',
    },
    validationMessage: {
        fontSize: '0.85rem',
        marginTop: '6px',
        fontWeight: '600',
    },
    passwordStrengthMeter: {
        height: '8px',
        width: '100%',
        backgroundColor: 'var(--border)',
        borderRadius: '4px',
        marginTop: '8px',
        overflow: 'hidden',
    },
    strengthBar: {
        height: '100%',
        width: '0%',
        borderRadius: '4px',
        transition: 'width 0.3s ease, background-color 0.3s ease',
    },
};

// --- LÓGICA DE VALIDAÇÃO ---
const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
};

const strengthLevels = {
    0: { width: '0%', color: 'transparent', label: '' },
    1: { width: '20%', color: '#e74c3c', label: 'Muito Fraca' },
    2: { width: '40%', color: '#f39c12', label: 'Fraca' },
    3: { width: '60%', color: '#f1c40f', label: 'Razoável' },
    4: { width: '80%', color: '#2ecc71', label: 'Forte' },
    5: { width: '100%', color: '#27ae60', label: 'Muito Forte' },
};


function Cadastro() {
    const navigate = useNavigate();
    const { cadastro } = useAuth();

    const [formData, setFormData] = useState({ nome: '', email: '', senha: '', confirmaSenha: '' });
    const [validation, setValidation] = useState({ senhaMatch: true });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const score = getPasswordStrength(formData.senha);
        setPasswordStrength(score);
        if (formData.confirmaSenha) {
            setValidation({ senhaMatch: formData.senha === formData.confirmaSenha });
        }
    }, [formData.senha, formData.confirmaSenha]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!validation.senhaMatch || passwordStrength < 3) {
            setError('Por favor, verifique se as senhas coincidem e se a senha é pelo menos "Razoável".');
            return;
        }
        setIsLoading(true);
        const success = await cadastro({
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha
        });
        setIsLoading(false);
        if (success) {
            navigate('/login');
        } else {
            setError('Erro ao cadastrar. Tente novamente.');
        }
    };

    const strength = strengthLevels[passwordStrength];

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-lg-6" style={pageStyles.formSide}>
                <h1 className="global-h1">Crie sua Conta</h1>
                <p className="subtitle" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    Junte-se à comunidade e comece a trilhar seu caminho para a aprovação!
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Campos do formulário */}
                        <div style={pageStyles.inputGroup}>
                            <div style={pageStyles.inputIcon}><svg width="20" height="20" viewBox="0 0 24 24"><path d={ICONS.user} fill="currentColor" /></svg></div>
                            <input className="form-control mb-3 input-base" name="nome" type="text" placeholder="Nome Completo" value={formData.nome} onChange={handleChange} style={{ paddingLeft: '40px' }} required />
                        </div>
                    <div style={pageStyles.inputGroup}>
                        <div style={pageStyles.inputIcon}><svg width="20" height="20" viewBox="0 0 24 24"><path d={ICONS.email} fill="currentColor" /></svg></div>
                        <input className="form-control mb-3 input-base" name="email" type="email" placeholder="Seu melhor e-mail" value={formData.email} onChange={handleChange} style={{ paddingLeft: '40px' }} required />
                    </div>

                    {/* Campo Senha com Medidor de Força */}
                    <div style={pageStyles.inputGroup}>
                        <div style={pageStyles.inputIcon}><svg width="20" height="20" viewBox="0 0 24 24"><path d={ICONS.lock} fill="currentColor" /></svg></div>
                        <input className="form-control mb-3 input-base" name="senha" type={showPassword ? 'text' : 'password'} placeholder="Crie uma senha" value={formData.senha} onChange={handleChange} style={{ paddingLeft: '40px' }} required />
                        <div style={pageStyles.passwordStrengthMeter}><div style={{...pageStyles.strengthBar, width: strength.width, backgroundColor: strength.color}}></div></div>
                        {formData.senha && <p style={{...pageStyles.validationMessage, color: strength.color}}>{strength.label}</p>}
                    </div>

                    {/* Campo Confirmar Senha com Validação */}
                    <div style={pageStyles.inputGroup}>
                        <div style={pageStyles.inputIcon}><svg width="20" height="20" viewBox="0 0 24 24"><path d={ICONS.lock} fill="currentColor" /></svg></div>
                        <input className="form-control mb-3 input-base" name="confirmaSenha" type={showPassword ? 'text' : 'password'} placeholder="Confirme sua senha" value={formData.confirmaSenha} onChange={handleChange} style={{ paddingLeft: '40px' }} required />
                        {formData.confirmaSenha && (
                            <p style={{...pageStyles.validationMessage, color: validation.senhaMatch ? strengthLevels[5].color : strengthLevels[1].color}}>
                                {validation.senhaMatch ? '✓ As senhas coincidem' : '✗ As senhas não coincidem'}
                            </p>
                        )}
                    </div>
                    
                    {/* Botão de Envio e Link para Login */}
                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                    <button type="submit" className={isLoading ? 'global-button-disabled btn btn-primary' : 'global-button btn btn-primary'} disabled={isLoading}>
                        {isLoading ? 'Criando...' : 'Criar Conta'}
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-medium)' }}>
                        Já tem uma conta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Faça login</Link>
                    </p>
                </form>
            </div>

            <div className="col-lg-6" style={pageStyles.illustrationSide}>
                <div>
                    <h2>🎯</h2>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Sua Jornada Começa Agora</h2>
                    <p>Ao se cadastrar, você terá acesso a rankings, estatísticas personalizadas e um histórico completo do seu progresso. </p>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Cadastro;