# Normes de Codage

## Conventions de nommage des variables

| Type                | Format                  | Exemple              |
|---------------------|-------------------------|----------------------|
| Paramètre           | pNomDuParametre        | `pUtilisateur`       |
| Variable locale     | lNomDeVariable         | `lCompteur`          |
| Propriété privée    | _NomDePropriete        | `_MotDePasse`        |
| Propriété publique  | NomDePropriete         | `Utilisateur`        |

## Règles d'utilisation

- Les paramètres de méthodes doivent toujours commencer par `p` suivi d'une majuscule
- Les variables locales doivent commencer par `l` suivi d'une majuscule
- Les propriétés privées doivent commencer par `_` suivi d'une majuscule
- Les propriétés publiques doivent commencer par une majuscule

## Exemples de code

## Template de commentaire

```-- initial Nom Prenom - 01/01/2024 - Description du commentaire```

### Exemple en React

```csharp
// cm - 10/03/2025 - Création du composant UserProfile

import React, { useState, useEffect } from 'react';

// cm - 10/03/2025 - Hook personnalisé pour récupérer les données utilisateur
function useUserData(pUserId) {
  const [lUserData, setUserData] = useState(null);
  const [lIsLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // cm - 10/03/2025 - Fonction pour récupérer les données asynchrones
    const lFetchData = async () => {
      try {
        const lResponse = await fetch(`/api/users/${pUserId}`);
        const lData = await lResponse.json();
        setUserData(lData);
      } catch (lError) {
        console.error(lError);
      } finally {
        setIsLoading(false);
      }
    };
    
    lFetchData();
  }, [pUserId]);
  
  return { lUserData, lIsLoading };
}

// cm - 10/03/2025 - Composant d'affichage du profil utilisateur
function UserProfile({ pUserId, pShowDetails }) {
  // cm - 10/03/2025 - Utilisation du hook personnalisé
  const { lUserData, lIsLoading } = useUserData(pUserId);
  
  // cm - 10/03/2025 - Fonction de formatage du nom
  const _formatName = (pFirstName, pLastName) => {
    return `${pFirstName} ${pLastName.toUpperCase()}`;
  };
  
  if (lIsLoading) {
    return <div>Chargement...</div>;
  }
  
  return (
    <div className="user-profile">
      <h2>{_formatName(lUserData.firstName, lUserData.lastName)}</h2>
      {pShowDetails && (
        // cm - 10/03/2025 - Section conditionnelle pour les détails
        <div className="user-details">
          <p>Email: {lUserData.email}</p>
          <p>Rôle: {lUserData.role}</p>
        </div>
      )}
    </div>
  );
}

export default UserProfile;