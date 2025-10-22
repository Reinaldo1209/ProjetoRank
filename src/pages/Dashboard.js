import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../api';

// Estilo para o botão secundário (Alterar Senha)
const secondaryButtonStyle = {
    background: 'transparent',
    color: 'var(--primary)',
    border: '2px solid var(--primary)',
};

// Estilo para o botão de perigo (Sair)
const dangerButtonStyle = {
    background: '#c00',
};

function Dashboard() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    
    // Estados para o formulário de Perfil
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ nome: '', email: '', avatarUrl: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Estados para o formulário de Senha
    const [editingPassword, setEditingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (!loading && !user) navigate('/login');
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user) {
            setForm({ nome: user.nome || '', email: user.email || '', avatarUrl: user.avatarUrl || '' });
        }
    }, [user]);

    if (loading) return <main className="page-content"><p>Carregando...</p></main>;
    if (!user) return null;


    // Lista fixa de avatares disponíveis (sem upload)
    const avatarList = [
        '/avatars/avatar1.png',
        '/avatars/avatar2.png',
        '/avatars/avatar3.png',
        '/avatars/avatar4.png',
        '/avatars/avatar5.png',
        '/avatars/avatar6.png',
        '/avatars/avatar7.png',
        '/avatars/avatar8.png',
    ];

    // Handler unificado para o formulário de perfil
    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // Handler para o formulário de senha
    const handlePasswordFormChange = e => setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // --- FUNÇÃO handleSave AJUSTADA ---
    const handleSave = async () => {
        setSaving(true); setError('');

        if (!user || !user.id) {
            setError("Erro: Usuário não autenticado ou ID não encontrado.");
            setSaving(false);
            return;
        }

        try {
            // 1. Monta o DTO completo que o backend espera
            const payload = {
                id: user.id, // O DTO precisa do ID
                nome: form.nome,
                email: form.email,
                avatarUrl: form.avatarUrl,
                role: user.role, // Envia o 'role' atual, já que não é editável
                creditos: user.creditos ?? 0 // Envia os 'creditos' atuais
            };
            
            // 2. Chama a URL correta (api/Usuario/{id}) com PUT
            const res = await authFetch(`/Usuario/${user.id}`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });

            if (res.ok) {
                // O backend retorna 204 (NoContent), não precisamos ler o JSON
                alert('Perfil atualizado com sucesso! A página será recarregada.');
                window.location.reload();
            } else {
                const txt = await res.text();
                setError('Erro ao salvar: ' + (txt || res.statusText));
            }
        } catch (err) {
            setError('Erro ao salvar: ' + String(err));
        }
        setSaving(false);
    };
    // --- FIM DO AJUSTE ---


    // Lógica para alterar senha (com console.log)
    const handlePasswordSave = async () => {
        setSavingPassword(true);
        setPasswordError('');

        const payload = {
            oldPassword: passwordForm.oldPassword,
            newPassword: passwordForm.newPassword,
        };

        console.log('Enviando para o backend (/auth/change-password):', JSON.stringify(payload, null, 2));

        try {
            // Simula a chamada de API
            const res = await authFetch('/auth/change-password', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });

            if (res.ok) {
                alert('Senha alterada com sucesso!');
                setEditingPassword(false);
                setPasswordForm({ oldPassword: '', newPassword: '' });
            } else {
                const txt = await res.text();
                if (res.status === 400 || res.status === 401) {
                    setPasswordError('Senha antiga incorreta ou a nova senha não atende aos requisitos.');
                } else {
                    setPasswordError('Erro ao alterar senha: ' + (txt || res.statusText));
                }
            }
        } catch (err) {
            setPasswordError('Erro de rede: ' + String(err));
        }
        setSavingPassword(false);
    };

    const avatarPreview = form.avatarUrl || '/avatars/default.png';

    return (
        <div className="page-content" style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: 120, height: 120, borderRadius: 999, overflow: 'hidden', border: '2px solid var(--primary)', flexShrink: 0, background: '#f0f0f0' }}>
                    <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                    <h1 className="global-h1" style={{ margin: 0, fontSize: '2.5rem' }}>{editing ? form.nome : user.nome || 'Usuário'}</h1>
                    <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-medium)' }}>{editing ? form.email : user.email}</p>
                    <p>Créditos: <strong>{user.creditos ?? 0}</strong></p>
                    <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <button 
                            onClick={() => { setEditing(s => !s); setEditingPassword(false); }} 
                            className="global-button"
                        >
                            {editing ? 'Cancelar Edição' : 'Editar Perfil'}
                        </button>
                        <button 
                            onClick={() => { setEditingPassword(s => !s); setEditing(false); }} 
                            className="global-button" 
                            style={secondaryButtonStyle}
                        >
                            {editingPassword ? 'Cancelar Senha' : 'Alterar Senha'}
                        </button>
                        <button 
                            onClick={() => { logout(); navigate('/'); }} 
                            className="global-button" 
                            style={dangerButtonStyle}
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </div>

            {/* --- FORMULÁRIO DE EDIÇÃO (Perfil) --- */}
            {editing && (
                <div className="global-card" style={{ marginTop: 32, maxWidth: 700 }}>
                    <h2 style={{ marginTop: 0 }}>Editar Perfil</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <label style={{ fontWeight: 600 }}>Nome:
                            <input name="nome" value={form.nome} onChange={handleChange} className="input-base" style={{ marginTop: 6 }} />
                        </label>
                        <label style={{ fontWeight: 600 }}>Email:
                            <input name="email" value={form.email} onChange={handleChange} className="input-base" style={{ marginTop: 6 }} />
                        </label>
                        
                        <label style={{ fontWeight: 600 }}>Avatar:</label>
                        <p style={{ marginTop: -12, color: 'var(--text-medium)' }}>Selecione um avatar da lista.</p>
                        <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {avatarList.map((av, idx) => (
                                <label key={av} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <input
                                        type="radio"
                                        name="avatarUrl"
                                        value={av}
                                        checked={form.avatarUrl === av}
                                        onChange={handleChange}
                                        style={{ marginBottom: 6 }}
                                    />
                                    <div style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '50%', border: form.avatarUrl === av ? '3px solid var(--primary)' : '1px solid #ccc', overflow: 'hidden' }}>
                                        <img src={av} alt={`Avatar ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                </label>
                            ))}
                        </div>
                        
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div style={{ marginTop: 12 }}>
                            <button onClick={handleSave} disabled={saving} className="global-button">
                                {saving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- FORMULÁRIO DE ALTERAR SENHA (Novo) --- */}
            {editingPassword && (
                <div className="global-card" style={{ marginTop: 32, maxWidth: 700 }}>
                    <h2 style={{ marginTop: 0 }}>Alterar Senha</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <label style={{ fontWeight: 600 }}>Senha Antiga:
                            <input 
                                type="password"
                                name="oldPassword" 
                                value={passwordForm.oldPassword} 
                                onChange={handlePasswordFormChange} 
                                className="input-base" 
                                style={{ marginTop: 6 }} 
                            />
                        </label>
                        <label style={{ fontWeight: 600 }}>Senha Nova:
                            <input 
                                type="password"
                                name="newPassword" 
                                value={passwordForm.newPassword} 
                                onChange={handlePasswordFormChange} 
                                className="input-base" 
                                style={{ marginTop: 6 }} 
                            />
                        </label>
                        
                        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                        
                        <div style={{ marginTop: 12 }}>
                            <button onClick={handlePasswordSave} disabled={savingPassword} className="global-button">
                                {savingPassword ? 'Salvando...' : 'Salvar Senha'}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* --- SEÇÃO DE CONCURSOS (Não mexida) --- */}
            <div className="global-card" style={{ marginTop: 32 }}>
                <h3 style={{ marginTop: 0 }}>Concursos Desbloqueados</h3>
                {user.concursosDesbloqueados && user.concursosDesbloqueados.length > 0 ? (
                    <ul>
                        {user.concursosDesbloqueados.map(c => <li key={c.id}>{c.nome}</li>)}
                    </ul>
                ) : (
                    <p>Você não desbloqueou concursos ainda.</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;