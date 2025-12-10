-- Migration pour ajouter les colonnes dateDebut et dateFin à la table examens

-- Ajouter la colonne dateDebut
ALTER TABLE examens 
ADD COLUMN date_debut DATETIME NULL;

-- Ajouter la colonne dateFin
ALTER TABLE examens 
ADD COLUMN date_fin DATETIME NULL;

-- Note: Les colonnes sont NULL par défaut pour permettre la compatibilité avec les examens existants
-- Un examen sans dateDebut/dateFin sera toujours visible (comportement par défaut)

