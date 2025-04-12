import React from "react";
import { FaUser, FaBox, FaPlus, FaTrash, FaTimes, FaSave, FaFileAlt, FaComment } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import SearchSelect from './SearchSelect';

const FactureForm = ({
  nouvelleFacture,
  nouvelArticle,
  loading,
  clients,
  produits,
  handleChange,
  handleChangeArticle,
  handleAjouterArticle,
  handleSupprimerArticle,
  handleAnnuler,
  handleSubmit
}) => {
  return (
    <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Nouvelle Facture</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FaUser className="mr-2 text-blue-500" />
            Client
          </label>
          <SearchSelect
            value={nouvelleFacture.client_id}
            onChange={(value) => handleChange({ target: { name: "client_id", value } })}
            options={clients.map(client => ({
              value: client.id,
              label: `${client.nom} - ${client.email}`
            }))}
            placeholder="Rechercher un client..."
            loading={loading.clients}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date de facturation</label>
          <input
            type="date"
            name="date_facture"
            value={nouvelleFacture.date_facture}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>
      </div>

      {/* Nouveaux champs Objet et Commentaire */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FaFileAlt className="mr-2 text-blue-500" />
            Objet
          </label>
          <input
            type="text"
            name="Objet"
            value={nouvelleFacture.Objet || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Objet de la facture (facultatif)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FaComment className="mr-2 text-blue-500" />
            Autre commentaire
          </label>
          <textarea
            name="commentaire"
            value={nouvelleFacture.commentaire || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Commentaires supplémentaires (facultatif)"
          />
        </div>
      </div>

      {/* Ajout d'articles */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <FaBox className="mr-2 text-blue-500" />
          Articles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Produit</label>
            <SearchSelect
              value={nouvelArticle.produit_id}
              onChange={(value) => {
                const selectedProduit = produits.find(p => p.id == value);
                if (selectedProduit) {
                  handleChangeArticle({ target: { name: "produit_id", value: selectedProduit.id } });
                  handleChangeArticle({ target: { name: "nom", value: selectedProduit.nom } });
                  handleChangeArticle({ target: { name: "unité", value: selectedProduit.unité } });
                  handleChangeArticle({ target: { name: "prix", value: selectedProduit.prix } });
                }
              }}
              options={produits.map(produit => ({
                value: produit.id,
                label: `${produit.nom}  - ${produit.prix} MGA (Stock: ${produit.quantite})- ${produit.unité}`
              }))}
              placeholder="Rechercher un produit..."
              loading={loading.produits}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
            <input
              type="number"
              name="quantite"
              min="0"
              step="0.01"
              value={nouvelArticle.quantite}
              onChange={handleChangeArticle}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prix Unitaire</label>
            <input
              type="number"
              name="prix"
              min="0"
              step="0.01"
              value={nouvelArticle.prix}
              onChange={handleChangeArticle}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-100"
              disabled
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAjouterArticle}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Ajouter
            </button>
          </div>
        </div>
        
        {nouvelleFacture.liste_articles.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix Unitaire</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {nouvelleFacture.liste_articles.map((article, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{article.nom}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{article.quantite}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{article.unité}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{article.prix} MGA</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{article.quantite * article.prix} MGA</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleSupprimerArticle(index)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                          title="Supprimer"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <div className="text-lg font-semibold">
                Total: <span className="text-blue-600">{nouvelleFacture.prix_total} MGA</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleAnnuler}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium flex items-center"
        >
          <FaTimes className="mr-2" /> Annuler
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading.submit || nouvelleFacture.liste_articles.length === 0}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading.submit ? (
            <ClipLoader size={18} color="#ffffff" className="mr-2" />
          ) : (
            <FaSave className="mr-2" />
          )}
          Enregistrer la Facture
        </button>
      </div>
    </div>
  );
};

export default FactureForm;