-- Migration pour corriger les doublons et ajouter une contrainte d'unicité

-- 1. Supprimer les doublons (garder la soumission la plus récente pour chaque examen/étudiant)
DELETE s1 FROM soumissions_examen s1
INNER JOIN soumissions_examen s2 
WHERE s1.id < s2.id 
  AND s1.examen_id = s2.examen_id 
  AND s1.etudiant_id = s2.etudiant_id;

-- 2. Ajouter une contrainte d'unicité pour éviter les doublons futurs
-- Note: Si la contrainte existe déjà, cette commande échouera mais ce n'est pas grave
ALTER TABLE soumissions_examen
ADD CONSTRAINT unique_examen_etudiant UNIQUE (examen_id, etudiant_id);

