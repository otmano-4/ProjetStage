# Guide de Test - Fonctionnalités Examen

## 📋 Prérequis
1. Backend démarré sur `http://localhost:8080`
2. Frontend démarré sur `http://localhost:5173`
3. Base de données MySQL avec des données de test

## 🔄 Flux Complet de Test

### Étape 1 : Professeur crée un examen avec questions

1. **Connectez-vous en tant que PROFESSEUR**
2. Allez sur `/professeur/exams`
3. Cliquez sur "Create Exam" et créez un examen
4. Cliquez sur l'examen créé pour voir les détails
5. **Ajoutez des questions de différents types :**
   - **Question MULTIPLE (QCM)** : 
     - Type: QCM / Choix multiples
     - Intitulé: "Quelle est la capitale de la France ?"
     - Options: Paris, Londres, Berlin, Madrid
     - Réponse correcte: Paris
     - Barème: 2 pts
   
   - **Question TRUE_FALSE** :
     - Type: Vrai / Faux
     - Intitulé: "Java est un langage de programmation"
     - Options: Vrai,Faux (pré-rempli)
     - Réponse correcte: Vrai
     - Barème: 1 pt
   
   - **Question TEXT (ouverte)** :
     - Type: Question ouverte
     - Intitulé: "Expliquez le concept de polymorphisme"
     - Réponse correcte: (peut être vide ou une réponse exemple)
     - Barème: 5 pts

### Étape 2 : Étudiant répond et soumet l'examen

1. **Connectez-vous en tant qu'ÉTUDIANT**
2. Allez sur `/etudiant/exams`
3. Cliquez sur l'examen créé par le professeur
4. **Répondez aux questions :**
   - Pour QCM/Vrai-Faux : Sélectionnez une réponse
   - Pour Question ouverte : Tapez votre réponse
5. **Optionnel :** Cliquez sur "Sauvegarder le brouillon" pour sauvegarder sans soumettre
6. **Cliquez sur "Soumettre mes réponses"**
7. ✅ **Vérification :** Vous devriez voir un message avec votre score auto (pour les QCM/Vrai-Faux)

### Étape 3 : Professeur voit les soumissions

1. **Reconnectez-vous en tant que PROFESSEUR**
2. Allez sur `/professeur/exams` et cliquez sur l'examen
3. **Vérifiez le tableau "Soumissions des étudiants" :**
   - Vous devriez voir l'étudiant avec son statut "SOUMIS"
   - Score Auto devrait être calculé (ex: 2/3 si 1 QCM correct sur 2)
   - Score Manuel = 0 (pas encore corrigé)
   - Score Total = Score Auto

### Étape 4 : Professeur corrige les questions TEXT manuellement

1. **Dans la vue professeur, cliquez sur "Voir" à côté de la soumission de l'étudiant**
2. **La section "Détails de la soumission" s'affiche :**
   - Vous voyez toutes les réponses de l'étudiant
   - Les questions MULTIPLE/TRUE_FALSE sont marquées "AUTO_CORRIGE" (vert)
   - Les questions TEXT sont marquées "A_CORRIGER" (jaune)
3. **Pour chaque question TEXT :**
   - Un champ de saisie "Note" apparaît
   - Entrez une note entre 0 et le barème (ex: 4/5)
   - Cliquez sur "Noter"
   - ✅ **Vérification :** La note est enregistrée et le statut passe à "CORRIGE_MANUEL" (bleu)
   - ✅ **Vérification :** Le Score Manuel et Score Total sont mis à jour automatiquement

### Étape 5 : Professeur valide la soumission

1. **Après avoir corrigé TOUTES les questions TEXT :**
   - Le bouton "Valider" devrait apparaître (si statut = SOUMIS)
2. **Cliquez sur "Valider"**
   - ✅ **Vérification :** Le statut passe à "CORRIGE"
   - ✅ **Vérification :** Un message de succès s'affiche
   - ✅ **Vérification :** Le bouton "Valider" disparaît et le bouton "Publier" apparaît

### Étape 6 : Professeur publie les résultats

1. **Quand le statut est "CORRIGE", cliquez sur "Publier les résultats"**
2. ✅ **Vérification :** Le statut passe à "PUBLIE"
3. ✅ **Vérification :** Un message de succès s'affiche

### Étape 7 : Étudiant voit ses résultats

1. **Reconnectez-vous en tant qu'ÉTUDIANT**
2. Allez sur `/etudiant/exams` et cliquez sur l'examen
3. ✅ **Vérification :** Une section "Résultats publiés" apparaît en haut avec :
   - Score automatique : X / Y
   - Score manuel : X / Y
   - Score total : X / Y
4. ✅ **Vérification :** Pour chaque question :
   - Les réponses correctes sont en vert avec un ✓
   - Les réponses incorrectes sont en rouge
   - La réponse correcte est affichée pour les QCM/Vrai-Faux
   - La note attribuée est affichée pour chaque question
   - Le barème est affiché

## 🐛 Dépannage

### Problème : Les scores auto sont à 0
- **Cause :** Les réponses ne correspondent pas exactement (espaces, casse)
- **Solution :** Vérifiez que la réponse correcte dans la question correspond exactement à ce que l'étudiant a saisi

### Problème : Le bouton "Valider" n'apparaît pas
- **Cause :** Il reste des questions TEXT non corrigées
- **Solution :** Corrigez toutes les questions TEXT (statut doit être "CORRIGE_MANUEL")

### Problème : L'étudiant ne voit pas les résultats
- **Cause :** Le statut n'est pas "PUBLIE"
- **Solution :** Le professeur doit cliquer sur "Publier les résultats"

### Problème : Les réponses ne s'affichent pas côté professeur
- **Cause :** L'étudiant n'a pas encore soumis
- **Solution :** Assurez-vous que l'étudiant a cliqué sur "Soumettre mes réponses" (pas juste sauvegardé le brouillon)

## ✅ Checklist de Fonctionnalités

- [ ] Correction automatique des questions MULTIPLE/TRUE_FALSE lors de la soumission
- [ ] Affichage des scores auto dans le tableau des soumissions
- [ ] Interface de correction manuelle pour les questions TEXT
- [ ] Mise à jour automatique des scores après correction manuelle
- [ ] Bouton "Valider" apparaît quand toutes les réponses TEXT sont corrigées
- [ ] Statut passe à "CORRIGE" après validation
- [ ] Bouton "Publier" apparaît quand statut = "CORRIGE"
- [ ] Statut passe à "PUBLIE" après publication
- [ ] Étudiant voit les résultats publiés avec détails complets
- [ ] Affichage des réponses correctes/incorrectes avec codes couleur
- [ ] Affichage des notes par question

