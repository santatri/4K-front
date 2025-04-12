import React, { useState } from 'react';
import { FaBox, FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import Pagination from './Pagination';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../../config'; // Assurez-vous que le chemin est correct

const ProduitTable = ({
  filteredProduits,
  currentPage,
  itemsPerPage,
  handleEdit,
  handleDelete,
  isLoading,
  onPageChange,
  fetchProduits
}) => {
  const [quantiteToAdd, setQuantiteToAdd] = useState({});
  const [showAddForm, setShowAddForm] = useState({});
  const [localLoading, setLocalLoading] = useState({});

  const handleAddQuantite = (produitId) => {
    setShowAddForm(prev => ({ 
      ...prev, 
      [produitId]: !prev[produitId] 
    }));
    if (!showAddForm[produitId]) {
      setQuantiteToAdd(prev => ({ 
        ...prev, 
        [produitId]: 1 
      }));
    }
  };

  const handleQuantiteChange = (produitId, value) => {
    const numValue = parseInt(value) || 0;
    setQuantiteToAdd(prev => ({ 
      ...prev, 
      [produitId]: Math.max(0.5, numValue) 
    }));
  };

  const submitAddQuantite = async (produitId) => {
    try {
      setLocalLoading(prev => ({ ...prev, [produitId]: true }));
      
      const quantite = quantiteToAdd[produitId] || 0.5;
      
      if (quantite < 1) {
        throw new Error("La quantité doit être au moins 1");
      }
  
      const response = await axios.put(
        `${API_URL}/api/produits/${produitId}/add`,
        { quantite },
        {
          headers: { 'Content-Type': 'application/json' },
          validateStatus: (status) => status < 500
        }
      );
  
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
  
      fetchProduits();
      setShowAddForm(prev => ({ ...prev, [produitId]: false }));
      
      // Notification de succès
      toast.success(response.data.message || "Quantité ajoutée avec succès", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
    } catch (error) {
      console.error("Erreur addQuantite:", error);
      
      // Notification d'erreur
      toast.error(error.response?.data?.message || error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLocalLoading(prev => ({ ...prev, [produitId]: false }));
    }
  };

  const cancelAddQuantite = (produitId) => {
    setShowAddForm(prev => ({ ...prev, [produitId]: false }));
  };

  const totalPages = Math.ceil(filteredProduits.length / itemsPerPage);
  const currentItems = filteredProduits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Pagination en haut */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredProduits.length}
        onPageChange={onPageChange}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((produit) => (
              <tr key={produit.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaBox className="text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{produit.nom}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">{produit.description || 'RIEN'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">{produit.unité}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${produit.quantite > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {produit.quantite} en stock
                    </span>
                    
                    {showAddForm[produit.id] && (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={quantiteToAdd[produit.id] || 1}
                          onChange={(e) => handleQuantiteChange(produit.id, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          disabled={localLoading[produit.id]}
                        />
                        <button
                          onClick={() => submitAddQuantite(produit.id)}
                          className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50 transition"
                          disabled={localLoading[produit.id]}
                          title="Confirmer"
                        >
                          {localLoading[produit.id] ? (
                            <ClipLoader size={14} color="#16a34a" />
                          ) : (
                            <FaCheck size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => cancelAddQuantite(produit.id)}
                          className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition"
                          title="Annuler"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {produit.prix} MGA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleAddQuantite(produit.id)}
                      className={`p-1 rounded-full transition ${showAddForm[produit.id] 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-blue-600 hover:bg-blue-50'}`}
                      title="Ajouter au stock"
                    >
                      <FaPlus size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(produit)}
                      className="p-1 text-yellow-600 hover:text-yellow-800 rounded-full hover:bg-yellow-50 transition"
                      title="Modifier"
                      disabled={isLoading}
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(produit.id)}
                      className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition"
                      title="Supprimer"
                      disabled={isLoading}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination en bas */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredProduits.length}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ProduitTable;