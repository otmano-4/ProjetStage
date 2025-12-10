-- Migration pour ajouter la colonne started_at à la table soumissions_examen
ALTER TABLE soumissions_examen 
ADD COLUMN started_at DATETIME NULL;

-- Mettre à jour les soumissions existantes avec createdAt comme startedAt
UPDATE soumissions_examen 
SET started_at = created_at 
WHERE started_at IS NULL;

