import React, { useState, useCallback, memo, useEffect } from "react";
import { RotatingLines } from 'react-loader-spinner';
import './polyfills';

const PDFButton = memo(({ facture, clients }) => {
    const [pdfState, setPdfState] = useState({
        pdfDoc: null,
        status: 'idle' // 'idle' | 'generating' | 'ready' | 'error'
    });
    const [isClient, setIsClient] = useState(false);
    const [PDFDownloadLink, setPDFDownloadLink] = useState(null);
    const [FacturePDF, setFacturePDF] = useState(null);

    useEffect(() => {
        setIsClient(true);
        
        if (typeof window !== 'undefined') {
            window.global = window;
            if (!window.Buffer) {
                import('buffer').then(({ Buffer }) => {
                    window.Buffer = Buffer;
                });
            }
        }

        // Précharge les dépendances
        Promise.all([
            import('./FacturePDF'),
            import('@react-pdf/renderer')
        ]).then(([facturePDF, reactPDF]) => {
            setFacturePDF(() => facturePDF.default);
            setPDFDownloadLink(() => reactPDF.PDFDownloadLink);
        });
    }, []);

    const generatePDF = useCallback(async () => {
        if (!isClient || !FacturePDF || !PDFDownloadLink) return;
        
        setPdfState({ pdfDoc: null, status: 'generating' });
        
        try {
            const client = clients.find(c => c.id == facture.client_id) || {};
            
            setPdfState({ 
                pdfDoc: (
                    <FacturePDF 
                        facture={facture} 
                        clientName={client.nom || "Client inconnu"}
                        clientEmail={client.email || ""}
                        clientAdresse={client.adresse || ""}
                        clientTelephone={client.telephone || ""}
                    />
                ),
                status: 'ready'
            });
        } catch (error) {
            console.error("Erreur de génération PDF:", error);
            setPdfState({ pdfDoc: null, status: 'error' });
        }
    }, [facture, clients, isClient, FacturePDF, PDFDownloadLink]);

    if (!isClient) {
        return (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md opacity-50 cursor-not-allowed">
                Génération PDF...
            </button>
        );
    }

    if (pdfState.status === 'generating') {
        return (
            <div className="flex items-center justify-center bg-gray-200 px-4 py-2 rounded-md">
                <RotatingLines
                    strokeColor="#3b82f6"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="24"
                    visible={true}
                />
                <span className="ml-2">Préparation...</span>
            </div>
        );
    }

    if (pdfState.status === 'error') {
        return (
            <button 
                onClick={generatePDF}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
                Erreur - Réessayer
            </button>
        );
    }

    if (pdfState.status === 'ready' && PDFDownloadLink && pdfState.pdfDoc) {
        return (
            <PDFDownloadLink
                document={pdfState.pdfDoc}
                fileName={`facture_${facture.id}.pdf`}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
            >
                {({ loading }) => loading ? (
                    <>
                        <RotatingLines
                            strokeColor="#ffffff"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="20"
                            visible={true}
                            className="mr-2"
                        />
                        Préparation...
                    </>
                ) : 'Télécharger'}
            </PDFDownloadLink>
        );
    }

    return (
        <button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
            Générer PDF
        </button>
    );
});

export default PDFButton;