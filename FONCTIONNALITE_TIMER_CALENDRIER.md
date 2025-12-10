# ⏰ Fonctionnalité : Minuteur Automatique Basé sur le Calendrier

## 📋 Résumé

Cette fonctionnalité permet de gérer les examens avec des dates de début et de fin précises, avec un timer automatique et une soumission automatique à l'expiration du temps.

## ✨ Fonctionnalités Implémentées

### 👨‍🏫 Côté Professeur

1. **Création d'examen avec dates**
   - Ajout de champs `dateDebut` et `dateFin` dans le formulaire de création
   - L'examen peut être créé en mode brouillon (non visible)
   - Les dates sont optionnelles (si non définies, l'examen est toujours visible)

2. **Publication d'examen**
   - L'examen devient visible uniquement entre `dateDebut` et `dateFin`
   - Avant `dateDebut` : invisible pour les étudiants
   - Après `dateFin` : bloqué et invisible

### 👨‍🎓 Côté Étudiant

1. **Visibilité conditionnelle**
   - L'examen n'apparaît dans la liste que s'il est dans la période autorisée
   - Message d'erreur si tentative d'accès avant le début ou après la fin

2. **Timer automatique**
   - Le timer démarre automatiquement quand l'étudiant commence l'examen
   - Affichage en temps réel du temps restant
   - Timer basé sur la durée de l'examen (en minutes)

3. **Soumission automatique**
   - À l'expiration du temps : soumission automatique des réponses
   - Blocage de l'accès après la date de fin
   - Message de confirmation après soumission automatique

## 🔧 Modifications Techniques

### Backend

1. **Modèle Examen**
   - Ajout de `dateDebut` (LocalDateTime)
   - Ajout de `dateFin` (LocalDateTime)

2. **Contrôleur**
   - Filtrage des examens par dates dans `getAfficherExams()`
   - Filtrage par dates dans `getByClasse()`
   - Vérification des dates dans `startExam()`

3. **DTOs**
   - `CreateExamenRequest` : ajout des champs dates
   - `ExamenDTO` : ajout des champs dates

### Frontend

1. **Formulaire de création** (`CreateExamen.jsx`)
   - Ajout de champs `datetime-local` pour dateDebut et dateFin
   - Conversion des dates au format ISO pour le backend

2. **Page étudiant** (`ExamenDetails.jsx`)
   - Vérification des dates au chargement
   - Timer amélioré avec soumission automatique
   - Fonction `handleAutoSubmit()` pour la soumission automatique
   - Vérification de la date de fin dans le timer

## 📝 Migration Base de Données

Un script SQL a été créé : `backend/migration_add_dates_examen.sql`

```sql
ALTER TABLE examens ADD COLUMN date_debut DATETIME NULL;
ALTER TABLE examens ADD COLUMN date_fin DATETIME NULL;
```

**⚠️ Important :** Exécutez ce script avant d'utiliser la fonctionnalité !

## 🚀 Utilisation

### Pour le Professeur

1. Créer un examen
2. Remplir les champs :
   - Titre, Description, Durée
   - **Date de début** : quand l'examen devient visible
   - **Date de fin** : quand l'examen est bloqué
3. Cocher "Publier l'examen"
4. Cliquer sur "Create Exam"

### Pour l'Étudiant

1. L'examen apparaît dans la liste uniquement entre les dates définies
2. Cliquer sur l'examen pour le commencer
3. Le timer démarre automatiquement
4. Répondre aux questions
5. À l'expiration du temps : soumission automatique
6. Après la date de fin : accès bloqué

## 🔄 Flux Complet

```
Professeur crée examen avec dates
  ↓
Examen invisible avant dateDebut
  ↓
DateDebut atteinte → Examen visible
  ↓
Étudiant commence → Timer démarre
  ↓
Étudiant répond aux questions
  ↓
Temps écoulé OU dateFin atteinte
  ↓
Soumission automatique
  ↓
Examen bloqué après dateFin
```

## ⚙️ Comportement des Dates

- **dateDebut = null** : L'examen est visible immédiatement (si publié)
- **dateFin = null** : L'examen reste accessible indéfiniment (sauf après soumission)
- **dateDebut et dateFin définies** : L'examen est visible uniquement dans cette période

## 🐛 Gestion des Erreurs

- Message d'erreur si tentative d'accès avant dateDebut
- Message d'erreur si tentative d'accès après dateFin
- Soumission automatique si le temps est écoulé
- Blocage automatique après dateFin

## ✅ Tests à Effectuer

1. ✅ Créer un examen avec dates
2. ✅ Vérifier que l'examen n'est pas visible avant dateDebut
3. ✅ Vérifier que l'examen est visible entre les dates
4. ✅ Vérifier que le timer démarre automatiquement
5. ✅ Vérifier la soumission automatique à l'expiration
6. ✅ Vérifier que l'examen est bloqué après dateFin

---

**Date d'implémentation** : 2024  
**Statut** : ✅ Implémenté et prêt à tester

