import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && !user) {
			navigate('/login');
		}
	}, [user, loading, navigate]);

	if (loading) return <p>Carregando...</p>;
	if (!user) return null;

	return (
		<div style={{ padding: 32 }}>
			<h1>Bem-vindo, {user.nome}!</h1>
			<p>Email: {user.email}</p>
			<p>Tipo de usuário: {user.role || 'User'}</p>
			{/* Adicione mais informações do usuário conforme necessário */}
		</div>
	);
}

export default Dashboard;
