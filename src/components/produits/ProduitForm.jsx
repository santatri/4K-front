import React, { useEffect, useState } from 'react';
import { FaBox, FaInfoCircle, FaHashtag, FaDollarSign, FaSave, FaTimes, FaPlus, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const ProduitForm = ({
  formData,
  editingProduit,
  isLoading,
  message,
  success,
  handleChange,
  handleSubmit,
  handleCancel,
  formRef
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSuccess, setToastSuccess] = useState(false);

  useEffect(() => {
    if (message) {
      setToastMessage(message);
      setToastSuccess(success);
      setShowToast(true);
      
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message, success]);

  return (
    <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto relative">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            {editingProduit ? 'Modifier Produit' : 'Ajouter un Nouveau Produit'}
          </h2>
          {editingProduit && (
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <FaTimes className="inline mr-1" /> Annuler
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaBox className="mr-2 text-blue-500" /> Nom du Produit
              </label>
              <input
                type="text"
                name="nom"
                placeholder="Nom du produit"
                value={formData.nom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaBox className="mr-2 text-blue-500" /> Unité de Mesure
              </label>
              <input
                type="text"
                name="unité"
                placeholder="Unité de mesure (ex: kg, L ,m²,catre, etc.)"
                value={formData.unité}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" /> Description
              </label>
              <textarea
                name="description"
                placeholder="Description du produit"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="quantite" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaHashtag className="mr-2 text-blue-500" /> Quantité en Stock
              </label>
              <input
                type="number"
                name="quantite"
                placeholder="Quantité disponible"
                value={formData.quantite}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaDollarSign className="mr-2 text-blue-500" /> Prix Unitaire
              </label>
              <input
                type="number"
                name="prix"
                placeholder="Prix en DH"
                value={formData.prix}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium flex items-center"
            disabled={isLoading}
          >
            <FaTimes className="mr-2" /> Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition font-medium flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <ClipLoader size={18} color="#ffffff" className="mr-2" />
            ) : (
              <>
                {editingProduit ? (
                  <FaSave className="mr-2" />
                ) : (
                  <FaPlus className="mr-2" />
                )}
                {editingProduit ? 'Enregistrer' : 'Ajouter'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Notification Toast */}
      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className={`animate-fade-in-up p-4 rounded-lg shadow-lg flex items-center ${
            toastSuccess ? 'bg-green-500' : 'bg-red-500'
          } text-white max-w-md`}>
            {toastSuccess ? (
              <FaCheck className="mr-2" />
            ) : (
              <FaExclamationTriangle className="mr-2" />
            )}
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduitForm;