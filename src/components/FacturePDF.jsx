import React from 'react';
import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import writtenNumber from 'written-number';
import logo from '../img/4KDesign.png';
import { styles } from './FacturePDF.styles';

writtenNumber.defaults.lang = 'fr';

const FacturePDF = ({ facture, clientName, clientEmail, clientAdresse, clientTelephone }) => {
  const numberToWords = (num) => {
    try {
      const intPart = Math.floor(num);
      const decimalPart = Math.round((num - intPart) * 100);
      
      let result = writtenNumber(intPart, { noAnd: true }) + ' Ariary';
      
      if (decimalPart > 0) {
        result += ' et ' + writtenNumber(decimalPart, { noAnd: true }) + ' centimes';
      }
      
      return result.charAt(0).toUpperCase() + result.slice(1);
    } catch (error) {
      console.error("Erreur de conversion:", error);
      return "Montant non convertible";
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
        <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image src={logo} style={styles.logo} />
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyTitle}>TOUS TRAVAUX D'IMPRESSION - DTF - SERIGRAPHIE</Text>
              <Text style={styles.companyDetail}>ITL 13 Tsarahonenana Itaosy</Text>
              <Text style={styles.companyDetail}>034 20 841 29 – 034 90 841 29</Text>
              <Text style={styles.companyContact}>contact@4kdesigns-mada.com</Text>
              <Text style={styles.companyWebsite}>www.4kdesigns-mada.com</Text>
            </View>
        </View>

          <View style={styles.devisInfo}>
            <Text style={styles.devisNumber}>
              FACTURE N°: {facture.numero_facture || '4K-012'}
            </Text>
            <Text style={styles.devisDate}>
              Date : {new Date(facture.date_facture).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </Text>
          </View>
        </View>

        {/* Sections Client et Objet */}
        <View style={styles.infoSections}>
          <View style={styles.objectInfo}>
            <Text style={styles.comment}>Objet : {facture.Objet || '..........................................'}</Text>
            <Text style={styles.comment}>Responsable : {facture.created_by || 'Non spécifié'}</Text>
            <Text style={styles.comment}>Autre commentaire : {facture.commentaire || '..........................................'}</Text>
          </View>
          
          <View style={styles.clientInfoBox}>
              <Text style={styles.sectionTitle}>CLIENT</Text>
              <View style={styles.clientDetails}>
                  <Text style={styles.clientDetail}>Nom : {clientName}</Text>
                  <Text style={styles.clientDetail}>Adresse : {clientAdresse || 'Non renseignée'}</Text>
                  <Text style={styles.clientDetail}>Téléphone : {clientTelephone || 'Non renseigné'}</Text>
                  <Text style={styles.clientDetail}>Email : {clientEmail || 'Non renseigné'}</Text>
              </View>
          </View>
        </View>

        {/* Tableau des articles */}
        <View style={styles.tableContainer}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.colIndex}>N°</Text>
              <Text style={styles.colDesignation}>DÉSIGNATION</Text>
              <Text style={styles.colQuantity}>Unité</Text>
              <Text style={styles.colQuantity}>QTÉ</Text>
              <Text style={styles.colPrice}>PRIX UNITAIRE</Text>
              <Text style={styles.colAmount}>MONTANT</Text>
            </View>

            {facture.liste_articles.map((article, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.colIndex}>{idx + 1}</Text>
                <Text style={styles.colDesignation}>{article.nom}</Text>
                <Text style={styles.colQuantity}>{article.unité}</Text>
                <Text style={styles.colQuantity}>{article.quantite}</Text>
                <Text style={styles.colPrice}>{parseFloat(article.prix).toFixed(2)} MGA</Text>
                <Text style={styles.colAmount}>
                  {(article.quantite * parseFloat(article.prix)).toFixed(2)} MGA
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totaux */}
        <View style={styles.totals}>
          <View style={styles.totalContainer}>
            <View style={styles.totalLeft}>
              <Text style={styles.totalNote}>Arrêté à la somme de MONTANT TOTAL de :</Text>
              <Text style={styles.totalInWords}>{numberToWords(facture.prix_total)}</Text>
            </View>
            <View style={styles.totalRight}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>MONTANT TOTAL</Text>
                <Text style={styles.totalValue}>{facture.prix_total.toFixed(2)} MGA</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>ACCOMPTE (70%)</Text>
                <Text style={styles.totalValue}>{(facture.prix_total * 0.7).toFixed(2)} MGA</Text>
              </View>
              <View style={[styles.totalRow, styles.finalTotal]}>
                <Text style={[styles.totalLabel, styles.bold]}>RESTE A PAYER (30%)</Text>
                <Text style={[styles.totalValue, styles.bold]}>
                  {(facture.prix_total * 0.3).toFixed(2)} MGA
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Conditions de paiement */}
        <View style={styles.paymentConditions}>
          <Text style={styles.underlinedTitle}>Conditions de paiement :</Text>
          <Text style={styles.paymentText}>70% à la commande, 30% à la livraison</Text>
          <Text style={[styles.underlinedTitle, styles.mt10]}>Mode de paiement :</Text>
          <Text style={styles.paymentText}>Espèce ou MVola (034 90 841 29 au nom de Julie Anna Eulalie)</Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Le responsable</Text>
            <View style={styles.signatureLine}></View>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Le client</Text>
            <View style={styles.signatureLine}></View>
          </View>
        </View>
        {/* Footer */}
        <View style={styles.footerr} fixed>
          <Text style={styles.footerLine}>
            ACW – 4K DESIGNS MADAGASCAR – AGENCE WEB – TOUS TRAVAUX D'IMPRESSION – DTF - SERIGRAPHIE
          </Text>
          <Text style={styles.footerLine}>
            STAT : 63121 22 2013 0 00 524 – NIF 4 001 124 966
          </Text>
          <Text style={styles.footerLinee}>
            www.agence-acw.com – www.4kdesigns-mada.com – www.astcomweb.com
          </Text>
          <Text style={styles.footerLine}>
            ITL 13 TSARAHONENANA ITAOSY
          </Text>
          
        </View>
      </Page>
    </Document>
  );
};

export default FacturePDF;