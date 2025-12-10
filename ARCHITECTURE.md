# 🏗️ Architecture du Projet - ProjetStage

## Vue d'ensemble

ProjetStage est une application web full-stack avec une architecture en couches séparant clairement le backend (Spring Boot) et le frontend (React).

## Architecture Backend (Spring Boot)

### Structure en couches

```
┌─────────────────────────────────────┐
│      Controllers (REST API)         │  ← Point d'entrée HTTP
├─────────────────────────────────────┤
│      DTOs (Data Transfer Objects)   │  ← Transfert de données
├─────────────────────────────────────┤
│      Services (Business Logic)      │  ← Logique métier (optionnel)
├─────────────────────────────────────┤
│      Repositories (Data Access)     │  ← Accès aux données
├─────────────────────────────────────┤
│      Models (Entities JPA)          │  ← Modèle de données
├─────────────────────────────────────┤
│      Database (MySQL)               │  ← Persistance
└─────────────────────────────────────┘
```

### Modèle de données

#### Entités principales

1. **Utilisateur**
   - Rôles : ADMIN, PROFESSEUR, ETUDIANT
   - Relations : Many-to-Many avec Classe (étudiants et professeurs)

2. **Classe**
   - Relations : Many-to-Many avec Utilisateur (étudiants et professeurs)
   - Relation : One-to-Many avec Examen

3. **Examen**
   - Propriétaire : Professeur (Many-to-One)
   - Classe : One-to-Many
   - Questions : One-to-Many

4. **Question**
   - Types : TEXT, MULTIPLE, TRUE_FALSE
   - Barème : Double
   - Options : String (séparées par virgules)

5. **SoumissionExamen**
   - Statuts : EN_COURS, SOUMIS, CORRIGE, PUBLIE
   - Scores : Auto, Manuel, Total
   - Timestamps : startedAt, submittedAt, correctedAt, publishedAt

6. **Reponse**
   - Statuts : AUTO_CORRIGE, A_CORRIGER, CORRIGE_MANUEL
   - Note : Double (null si non corrigée)

### Flux de données

#### Création d'un examen
```
Professeur → POST /api/examens
  → ExamenController.create()
  → ExamenRepository.save()
  → Database
```

#### Soumission d'un examen
```
Étudiant → POST /api/examens/{id}/soumissions
  → ExamenController.submitResponses()
  → Correction automatique (MULTIPLE/TRUE_FALSE)
  → Statut: SOUMIS ou CORRIGE
  → Database
```

#### Correction manuelle
```
Professeur → POST /api/examens/soumissions/{reponseId}/corriger
  → ExamenController.corriger()
  → Mise à jour note et statut
  → Recalcul scores
  → Database
```

## Architecture Frontend (React)

### Structure

```
┌─────────────────────────────────────┐
│      Pages (Routes)                 │  ← Composants de page
├─────────────────────────────────────┤
│      Components (Réutilisables)     │  ← Composants UI
├─────────────────────────────────────┤
│      Services (API)                 │  ← Appels HTTP
├─────────────────────────────────────┤
│      Redux Store                    │  ← État global
│        └── Slices                   │  ← Reducers
└─────────────────────────────────────┘
```

### Gestion d'état (Redux)

#### Slices principaux

1. **authSlice**
   - User actuel
   - Token (si implémenté)
   - Rôle

2. **examSlice**
   - Liste des examens
   - Examen sélectionné
   - Soumissions

3. **classSlice**
   - Liste des classes
   - Classe sélectionnée

4. **usersSlice**
   - Liste des utilisateurs

### Routing

- `/login` - Connexion
- `/etudiant/dashboard` - Dashboard étudiant
- `/etudiant/exams` - Liste des examens (étudiant)
- `/etudiant/exams/:id` - Détails examen (étudiant)
- `/professeur/dashboard` - Dashboard professeur
- `/professeur/exams` - Liste des examens (professeur)
- `/professeur/exams/:id` - Détails examen (professeur)
- `/admin/dashboard` - Dashboard admin
- `/admin/utilisateurs` - Gestion utilisateurs
- `/admin/classe` - Gestion classes

### Protection des routes

Utilisation de `ProtectedRoute` pour vérifier les rôles avant d'accéder aux pages.

## Communication Backend-Frontend

### Format des données

- **Request** : JSON
- **Response** : JSON
- **Headers** : `Content-Type: application/json`

### Gestion CORS

Configuration dans `CorsConfig.java` :
```java
@CrossOrigin(origins = "*")
```

⚠️ Pour la production, restreindre les origines autorisées.

## Flux de travail complet

### 1. Création et passage d'un examen

```
Professeur crée examen
  ↓
Ajoute des questions (QCM, Vrai/Faux, Ouvertes)
  ↓
Publie l'examen (afficher = true)
  ↓
Étudiant voit l'examen
  ↓
Commence l'examen (startedAt initialisé)
  ↓
Répond aux questions
  ↓
Soumet (correction auto pour QCM/Vrai-Faux)
  ↓
Professeur corrige les questions ouvertes
  ↓
Valide la soumission
  ↓
Publie les résultats
  ↓
Étudiant voit ses résultats
```

### 2. Gestion des scores

- **Score Auto** : Calculé automatiquement pour MULTIPLE/TRUE_FALSE
- **Score Manuel** : Attribué par le professeur pour TEXT
- **Score Total** : Score Auto + Score Manuel

### 3. Statuts de soumission

```
EN_COURS → SOUMIS → CORRIGE → PUBLIE
```

- **EN_COURS** : L'étudiant est en train de répondre
- **SOUMIS** : L'examen est soumis, en attente de correction
- **CORRIGE** : Toutes les questions sont corrigées
- **PUBLIE** : Les résultats sont visibles par l'étudiant

## Sécurité

### Points d'attention

1. **Authentification** : Actuellement basique (email/password en clair)
   - ⚠️ À améliorer : JWT + BCrypt

2. **Autorisation** : Vérification des rôles côté frontend
   - ⚠️ À améliorer : Vérification côté backend avec Spring Security

3. **Validation** : Validation minimale des entrées
   - ⚠️ À améliorer : Validation complète avec Bean Validation

4. **CORS** : Configuration permissive (`origins = "*"`)
   - ⚠️ À améliorer : Restreindre aux origines autorisées

## Performance

### Optimisations actuelles

- **Lazy Loading** : Relations JPA chargées à la demande
- **DTOs** : Réduction de la taille des réponses JSON
- **EntityGraph** : Chargement optimisé des relations

### Améliorations possibles

- Cache (Redis) pour les données fréquemment consultées
- Pagination pour les listes importantes
- Indexation des colonnes fréquemment requêtées

## Tests

### Backend
- Tests unitaires : `DemoApplicationTests.java`
- Tests d'intégration : À implémenter

### Frontend
- Tests unitaires : À implémenter
- Tests E2E : À implémenter

## Déploiement

### Backend
- JAR exécutable : `mvn clean package`
- Docker : À configurer

### Frontend
- Build de production : `npm run build`
- Serveur statique : Nginx, Apache, ou Vercel/Netlify

## Évolutions futures

1. **Authentification JWT**
2. **Spring Security** pour l'autorisation
3. **WebSockets** pour les notifications en temps réel
4. **Export PDF** des résultats
5. **Graphiques** pour les statistiques
6. **Mode hors ligne** pour les examens
7. **Anti-triche** (détection de changement d'onglet)
8. **Multi-langues** (i18n)

