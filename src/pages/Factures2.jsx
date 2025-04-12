import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { FaFileInvoiceDollar } from 'react-icons/fa';
import FactureForm from '../components/factures/FactureForm';
import FactureList from '../components/factures/FactureList';
import { calculerMontantTotal } from '../utils/factureUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../config'; // Assurez-vous que le chemin est correct

const Factures = () => {
  const topRef = useRef(null);

  // États
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState({
    factures: false,
    clients: false,
    produits: false,
    submit: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  const [nouvelleFacture, setNouvelleFacture] = useState({
    client_id: "",
    numero_facture: "",
    date_facture: new Date().toISOString().split("T")[0],
    liste_articles: [],
    prix_total: 0,
    Objet: "", // Nouveau champ
    commentaire: "" // Nouveau champ
  });

  const [nouvelArticle, setNouvelArticle] = useState({
    produit_id: "",
    nom: "",
    quantite: 1,
    prix: 0,
  });

  

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(prev => ({...prev, factures: true, clients: true, produits: true}));
      
      const [facturesRes, clientsRes, produitsRes] = await Promise.all([
        fetch(`${API_URL}/api/factures`),
        fetch(`${API_URL}/api/clients`),
        fetch(`${API_URL}/api/produits`)
      ]);

      const [facturesData, clientsData, produitsData] = await Promise.all([
        facturesRes.json(),
        clientsRes.json(),
        produitsRes.json()
      ]);

      const sortedFactures = facturesData.sort((a, b) => 
        new Date(b.date_facture) - new Date(a.date_facture)
      ).map(facture => ({
        ...facture,
        liste_articles: Array.isArray(facture.liste_articles)
          ? facture.liste_articles
          : JSON.parse(facture.liste_articles || "[]"),
        Objet: facture.Objet || "", // Assure que Objet existe
        commentaire: facture.commentaire || "" // Assure que commentaire existe
      }));

      setFactures(sortedFactures);
      setClients(clientsData);
      setProduits(produitsData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(prev => ({...prev, factures: false, clients: false, produits: false}));
    }
  }, []);
  // Dans le composant Factures
  useEffect(() => {
  if (topRef.current) {
    topRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredFactures = useMemo(() => {
    return factures.filter(facture => {
      const client = clients.find(c => c.id === facture.client_id);
      const clientName = client ? client.nom.toLowerCase() : '';
      return (
        clientName.includes(searchTerm.toLowerCase()) ||
        facture.numero_facture?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facture.date_facture.includes(searchTerm) ||
        facture.prix_total.toString().includes(searchTerm) ||
        (facture.Objet && facture.Objet.toLowerCase().includes(searchTerm.toLowerCase())) || // Recherche dans Objet
        (facture.commentaire && facture.commentaire.toLowerCase().includes(searchTerm.toLowerCase())) // Recherche dans commentaire
      );
    });
  }, [factures, clients, searchTerm]);

  const totalPages = Math.ceil(filteredFactures.length / itemsPerPage);
  const paginatedFactures = filteredFactures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setNouvelleFacture(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleChangeArticle = useCallback((e) => {
    const { name, value } = e.target;
    setNouvelArticle(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectProduit = useCallback((e) => {
    const produitId = e.target.value;
    const selectedProduit = produits.find(p => p.id == produitId);
    
    if (selectedProduit) {
      setNouvelArticle(prev => ({
        ...prev,
        produit_id: selectedProduit.id,
        nom: selectedProduit.nom,
        prix: selectedProduit.prix
      }));
    }
  }, [produits]);

  const handleAjouterArticle = useCallback(() => {
    if (!nouvelArticle.produit_id || nouvelArticle.quantite <= 0 || nouvelArticle.prix < 0) {
      toast.error("Veuillez sélectionner un produit et une quantité valide.");
      return;
    }
  
    const produitSelectionne = produits.find(p => p.id == nouvelArticle.produit_id);
    
    if (!produitSelectionne) {
      toast.error("Produit introuvable dans la base de données.");
      return;
    }
  
    if (produitSelectionne.quantite < nouvelArticle.quantite) {
      toast.error(`Stock insuffisant! Il ne reste que ${produitSelectionne.quantite} unités disponibles.`);
      return;
    }
  
    const articleExistantIndex = nouvelleFacture.liste_articles.findIndex(
      article => article.produit_id === nouvelArticle.produit_id
    );
  
    setNouvelleFacture(prev => {
      let updatedArticles;
      
      if (articleExistantIndex !== -1) {
        const nouvelleQuantite = prev.liste_articles[articleExistantIndex].quantite + nouvelArticle.quantite;
        
        if (produitSelectionne.quantite < nouvelleQuantite) {
          toast.error(`Quantité totale (${nouvelleQuantite}) dépasse le stock disponible (${produitSelectionne.quantite})!`);
          return prev;
        }
        
        updatedArticles = [...prev.liste_articles];
        updatedArticles[articleExistantIndex] = {
          ...updatedArticles[articleExistantIndex],
          quantite: nouvelleQuantite
        };
      } else {
        updatedArticles = [...prev.liste_articles, nouvelArticle];
      }
  
      const prixTotal = calculerMontantTotal(updatedArticles);
      
      return {
        ...prev,
        liste_articles: updatedArticles,
        prix_total: prixTotal,
      };
    });
  
    setNouvelArticle({ 
      produit_id: "",
      nom: "", 
      quantite: 1, 
      prix: 0 
    });
  }, [nouvelArticle, produits, nouvelleFacture.liste_articles]);

  const handleSupprimerArticle = useCallback((index) => {
    setNouvelleFacture(prev => {
      const updatedArticles = [...prev.liste_articles];
      updatedArticles.splice(index, 1);
      
      const prixTotal = calculerMontantTotal(updatedArticles);
      
      return {
        ...prev,
        liste_articles: updatedArticles,
        prix_total: prixTotal,
      };
    });
  }, []);

  const handleDeleteFacture = useCallback(async (factureId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      return;
    }

    try {
      setLoading(prev => ({...prev, factures: true}));
      
      const response = await fetch(`${API_URL}/api/factures/${factureId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      await fetchData();
      toast.success("Facture supprimée avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setLoading(prev => ({...prev, factures: false}));
    }
  }, [fetchData]);

  const handleAnnuler = useCallback(() => {
    setNouvelleFacture({
      client_id: "",
      numero_facture: "",
      date_facture: new Date().toISOString().split("T")[0],
      liste_articles: [],
      prix_total: 0,
      Objet: "", // Réinitialisation du champ
      commentaire: "" // Réinitialisation du champ
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!nouvelleFacture.client_id) {
      toast.error("Veuillez sélectionner un client.");
      return;
    }
  
    if (nouvelleFacture.liste_articles.length === 0) {
      toast.error("Veuillez ajouter au moins un article.");
      return;
    }
  
    try {
      setLoading(prev => ({...prev, submit: true}));
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error("Session utilisateur invalide");
      }
  
      const response = await fetch(`${API_URL}/api/factures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...nouvelleFacture,
          created_by_id: user.id,
          date_facture: nouvelleFacture.date_facture || new Date().toISOString().split('T')[0],
          Objet: nouvelleFacture.Objet || null, // Envoie null si vide
          commentaire: nouvelleFacture.commentaire || null // Envoie null si vide
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création");
      }
  
      await fetchData();
      handleAnnuler();
      
      toast.success("Facture créée avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(error.message || "Erreur serveur");
    } finally {
      setLoading(prev => ({...prev, submit: false}));
    }
  }, [nouvelleFacture, handleAnnuler, fetchData]);

  const produitOptions = useMemo(() => (
    produits.map(produit => (
      <option key={produit.id} value={produit.id}>
        {produit.nom} - {produit.prix} MGA (Stock: {produit.quantite})
      </option>
    ))
  ), [produits]);

  const clientOptions = useMemo(() => (
    clients.map(client => (
      <option key={client.id} value={client.id}>
        {client.nom} - {client.email}
      </option>
    ))
  ), [clients]);
 
  return (
    <div ref={topRef} className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <FaFileInvoiceDollar className="mr-2 text-blue-500" />
          Gestion des Factures
        </h1>
        <div >
        <FactureForm
          nouvelleFacture={nouvelleFacture}
          nouvelArticle={nouvelArticle}
          loading={loading}
          clients={clients}
          produits={produits}
          handleChange={handleChange}
          handleChangeArticle={handleChangeArticle}
          handleSelectProduit={handleSelectProduit}
          handleAjouterArticle={handleAjouterArticle}
          handleSupprimerArticle={handleSupprimerArticle}
          handleAnnuler={handleAnnuler}
          handleSubmit={handleSubmit}
          clientOptions={clientOptions}
          produitOptions={produitOptions}
        />
        
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
       
        <FactureList
          loading={loading}
          filteredFactures={filteredFactures}
          paginatedFactures={paginatedFactures}
          clients={clients}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onDeleteFacture={handleDeleteFacture}
        />
        </div>
      </div>
    </div>
  );
};

export default Factures;