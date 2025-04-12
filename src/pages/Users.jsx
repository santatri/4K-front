import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import UsersSection from '../components/users/UsersSection';
import { FaUserCheck, FaUsers } from 'react-icons/fa';
import Notification from '../components/users/Notification';
import { ClipLoader } from 'react-spinners';
import { API_URL } from '../config'; // Assurez-vous que le chemin est correct

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        role: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const results = users.filter(user =>
            user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/users/list`);
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            showMessage('Erreur lors du chargement des utilisateurs', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 2000);
    };

    const handleValidate = async (id) => {
        try {
            await axios.put(`${API_URL}/api/users/validate/${id}`);
            showMessage('Utilisateur validé avec succès', 'success');
            setUsers(users.map(user => user.id === id ? { ...user, validated: true } : user));
        } catch (error) {
            console.error('Erreur lors de la validation:', error);
            showMessage('Erreur lors de la validation', 'error');
        }
    };

    const handleInvalidate = async (id) => {
        try {
            await axios.put(`${API_URL}/api/users/invalidate/${id}`);
            showMessage('Utilisateur bloqué avec succès', 'success');
            setUsers(users.map(user => user.id === id ? { ...user, validated: false } : user));
        } catch (error) {
            console.error('Erreur lors de la validation:', error);
            showMessage('Erreur lors du blocage', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
        
        try {
            await axios.delete(`${API_URL}/api/users/${id}`);
            showMessage('Utilisateur supprimé avec succès', 'success');
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            showMessage('Erreur lors de la suppression', 'error');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user.id);
        setEditForm({
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async (id) => {
        try {
            await axios.put(`${API_URL}/api/users/update/${id}`, editForm);
            showMessage('Utilisateur modifié avec succès', 'success');
            setUsers(users.map(user => user.id === id ? { ...user, ...editForm } : user));
            setEditingUser(null);
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
            showMessage('Erreur lors de la modification', 'error');
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    const pendingUsers = filteredUsers.filter(user => !user.validated);
    const validatedUsers = filteredUsers.filter(user => user.validated);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {message.text && <Notification message={message} onClose={() => setMessage({ text: '', type: '' })} />}
            
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Gestion des Utilisateurs</h1>

                {/* Barre de recherche */}
                <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher utilisateurs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>
                </div>

                {/* Sections d'utilisateurs */}
                <UsersSection
                    title="Utilisateurs en attente de validation"
                    icon={FaUserCheck}
                    users={pendingUsers}
                    isLoading={isLoading}
                    editingUser={editingUser}
                    editForm={editForm}
                    handleInputChange={handleInputChange}
                    handleSaveEdit={handleSaveEdit}
                    handleCancelEdit={handleCancelEdit}
                    handleValidate={handleValidate}
                    handleInvalidate={handleInvalidate}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    isPendingSection={true}
                />

                <UsersSection
                    title="Tous les utilisateurs"
                    icon={FaUsers}
                    users={validatedUsers}
                    isLoading={isLoading}
                    editingUser={editingUser}
                    editForm={editForm}
                    handleInputChange={handleInputChange}
                    handleSaveEdit={handleSaveEdit}
                    handleCancelEdit={handleCancelEdit}
                    handleValidate={handleValidate}
                    handleInvalidate={handleInvalidate}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                />
            </div>
        </div>
    );
};

export default Users;