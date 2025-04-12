import React, { useRef, useCallback } from "react";
import { FaSearch, FaTrash, FaEdit, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import PDFButton from '../PDFButton';
import Pagination from './Pagination';

const FactureList = ({
  loading,
  filteredFactures,
  paginatedFactures,
  clients,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  onDeleteFacture
}) => {
  const listRef = useRef(null);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    // Petit délai pour s'assurer que le state est bien mis à jour avant le scroll
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 50);
  }, [setCurrentPage]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div 
        ref={listRef} 
        className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center"
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-2 md:mb-0">Historique des Factures</h2>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher factures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>
      
         <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredFactures.length}
            onPageChange={handlePageChange}
          />


      {loading.factures ? (
        <div className="p-8 flex justify-center">
          <ClipLoader size={40} color="#3B82F6" />
        </div>
      ) : filteredFactures.length > 0 ? (
        <>
          <div className="divide-y divide-gray-200">
            {paginatedFactures.map(facture => {
              const client = clients.find(c => c.id === facture.client_id);
              const clientName = client?.nom || "Client inconnu";
              const clientEmail = client?.email || "";
              const clientPhone = client?.telephone || "";
              const clientAddress = client?.adresse || "";
              
              return (
                <div key={facture.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Facture : {facture.numero_facture}</h3>
                          <p className="text-sm text-gray-500">
                            Date: {new Date(facture.date_facture).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                          <p className="text-sm text-gray-500">Effectué par : <samp>{facture.created_by}</samp></p>
                          <p className="text-sm text-gray-500">commentaire : <samp>{facture.commentaire || '..........................................'}</samp></p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Client</h4>
                        <p className="text-gray-800 font-medium">{clientName}</p>
                        
                        {clientEmail && (
                          <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                            <FaEnvelope /> {clientEmail}
                          </p>
                        )}
                        
                        {clientPhone && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaPhone /> {clientPhone}
                          </p>
                        )}
                        
                        {clientAddress && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaMapMarkerAlt /> {clientAddress}
                          </p>
                        )}
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {facture.liste_articles?.map((article, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{article.nom}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">x{article.quantite}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{article.unité}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{article.prix.toFixed(2)} MGA</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                  {(article.prix * article.quantite).toFixed(2)} MGA
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="md:w-64 flex-shrink-0">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="space-y-3">
                          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg text-gray-800">
                            <span>Total:</span>
                            <span>{facture.prix_total.toFixed(2)} MGA</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col items-center">
                          <div className="flex space-x-2">
                            <PDFButton facture={facture} clients={clients} />
                            <button 
                              onClick={() => onDeleteFacture(facture.id)}
                              className="p-2 text-red-500 hover:text-red-700 transition-colors"
                              title="Supprimer la facture"
                              disabled={loading.factures}
                            >
                              {loading.factures ? (
                                <ClipLoader size={16} color="#EF4444" />
                              ) : (
                                <FaTrash />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 text-center mt-2">
                            {facture.liste_articles?.length || 0} article(s)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredFactures.length}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="p-6 text-center text-gray-500">
          {searchTerm ? "Aucune facture ne correspond à votre recherche." : "Aucune facture trouvée."}
        </div>
      )}
    </div>
  );
};

export default FactureList;