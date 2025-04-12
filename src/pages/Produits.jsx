import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import ProduitForm from '../components/produits/ProduitForm';
import ProduitTable from '../components/produits/ProduitTable';
import { API_URL } from '../config'; // Assurez-vous que le chemin est correct

const Produits = () => {
    const [produits, setProduits] = useState([]);
    const [filteredProduits, setFilteredProduits] = useState([]);
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        quantite: 0,
        prix: 0,
        unité: ''
    });
    const [editingProduit, setEditingProduit] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const formRef = useRef(null);
    const topRef = useRef(null);

    useEffect(() => {
        fetchProduits();
    }, []);

    useEffect(() => {
        // Solution hybride
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'auto' });
        } else {
            window.scrollTo(0, 0);
        }
    }, []);
    useEffect(() => {
        const results = produits.filter(produit =>
            produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            produit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            produit.quantite.toString().includes(searchTerm) ||
            produit.prix.toString().includes(searchTerm)
        );
        setFilteredProduits(results);
        setCurrentPage(1);
    }, [searchTerm, produits]);

    const fetchProduits = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/produits`);
            if (response.data && response.data.length > 0) {
                setProduits(response.data);
                setFilteredProduits(response.data);
            } else {
                console.error('Aucun produit trouvé');
                setProduits([]);
                setFilteredProduits([]);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccess(false);
        try {
            if (editingProduit) {
                await axios.put(`${API_URL}/api/produits/${editingProduit}`, formData);
                setMessage('Produit modifié avec succès');
            } else {
                await axios.post(`${API_URL}/api/produits`, formData);
                setMessage('Produit ajouté avec succès');
            }
            setFormData({ nom: '', description: '', quantite: 0, prix: 0 , unité: '' });
            setEditingProduit(null);
            setSuccess(true);
            fetchProduits();
            setSearchTerm('');
        } catch (error) {
            console.error("Erreur Axios:", error);
            if (error.response) {
                setMessage(error.response.data.message || "Erreur lors de l'opération");
            } else {
                setMessage("Erreur de connexion avec le serveur");
            }
            setSuccess(false);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const handleEdit = (produit) => {
        setEditingProduit(produit.id);
        setFormData({
            nom: produit.nom,
            description: produit.description,
            quantite: produit.quantite,
            prix: produit.prix,
            unité: produit.unité
        });

        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
        
        setIsLoading(true);
        try {
            await axios.delete(`${API_URL}/api/produits/${id}`);
            setMessage('Produit supprimé avec succès');
            setSuccess(true);
            fetchProduits();
        } catch (error) {
            setMessage(`Erreur lors de la suppression du produit: ${error.response?.data?.message || error.message}`);
            setSuccess(false);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const handleCancel = () => {
        setFormData({ nom: '', description: '', quantite: 0, prix: 0 , unité: '' });
        setEditingProduit(null);
        setMessage('');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div ref={topRef}  className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">Gestion des Produits</h1>

            <ProduitForm
                formData={formData}
                editingProduit={editingProduit}
                isLoading={isLoading}
                message={message}
                success={success}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                formRef={formRef}
            />

            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h2 className="text-xl font-semibold text-gray-700">Liste des Produits</h2>
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher produits..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>
                </div>
                
                {filteredProduits.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                        {searchTerm ? 
                            "Aucun produit ne correspond à votre recherche." : 
                            "Aucun produit trouvé. Commencez par ajouter un nouveau produit."}
                    </div>
                ) : (
                    <ProduitTable
                        filteredProduits={filteredProduits}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        isLoading={isLoading}
                        onPageChange={handlePageChange}
                        fetchProduits={fetchProduits}
                    />
                )}
            </div>
        </div>
    );
};

export default Produits;