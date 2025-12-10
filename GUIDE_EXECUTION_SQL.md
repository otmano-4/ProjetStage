# 📝 Guide d'Exécution des Scripts SQL

Ce guide explique comment exécuter les scripts de migration SQL pour corriger les problèmes de base de données.

## 📋 Scripts disponibles

1. **migration_add_started_at.sql** - Ajoute la colonne `started_at` à la table `soumissions_examen`
2. **migration_fix_duplicates.sql** - Supprime les doublons et ajoute une contrainte d'unicité

## 🚀 Méthode 1 : MySQL Workbench (Recommandé)

### Étapes :

1. **Ouvrir MySQL Workbench**
   - Lancez MySQL Workbench sur votre ordinateur
   - Connectez-vous à votre serveur MySQL (localhost:3306)

2. **Sélectionner la base de données**
   ```sql
   USE projetstage;
   ```

3. **Ouvrir le script SQL**
   - Menu : `File` → `Open SQL Script`
   - Naviguez vers le dossier `backend/`
   - Sélectionnez le fichier SQL (ex: `migration_fix_duplicates.sql`)

4. **Exécuter le script**
   - Cliquez sur l'icône ⚡ (Execute) ou appuyez sur `Ctrl+Shift+Enter`
   - Vérifiez les messages dans l'onglet "Output" en bas

## 🖥️ Méthode 2 : Ligne de commande MySQL

### Windows (CMD ou PowerShell) :

1. **Ouvrir le terminal**
   - Appuyez sur `Win + R`, tapez `cmd` et appuyez sur Entrée
   - Ou ouvrez PowerShell

2. **Se connecter à MySQL**
   ```bash
   mysql -u root -p
   ```
   - Entrez votre mot de passe : `otman123`

3. **Sélectionner la base de données**
   ```sql
   USE projetstage;
   ```

4. **Exécuter le script**
   ```bash
   source C:/Users/pret/Desktop/ProjetStage/backend/migration_fix_duplicates.sql
   ```
   
   Ou copiez-collez directement le contenu du fichier dans le terminal MySQL.

### Linux/Mac :

```bash
mysql -u root -p projetstage < backend/migration_fix_duplicates.sql
```

## 🌐 Méthode 3 : phpMyAdmin (si installé)

1. **Ouvrir phpMyAdmin** dans votre navigateur (généralement `http://localhost/phpmyadmin`)

2. **Sélectionner la base de données** `projetstage` dans le menu de gauche

3. **Cliquer sur l'onglet "SQL"** en haut

4. **Copier-coller le contenu** du script SQL dans la zone de texte

5. **Cliquer sur "Exécuter"**

## 📝 Méthode 4 : Exécution directe dans le terminal

### Depuis le dossier du projet :

```bash
# Windows (PowerShell)
cd C:\Users\pret\Desktop\ProjetStage\backend
mysql -u root -potman123 projetstage < migration_fix_duplicates.sql

# Linux/Mac
cd ~/Desktop/ProjetStage/backend
mysql -u root -p projetstage < migration_fix_duplicates.sql
```

## ⚠️ Ordre d'exécution recommandé

Exécutez les scripts dans cet ordre :

1. **D'abord** : `migration_add_started_at.sql` (si pas déjà fait)
2. **Ensuite** : `migration_fix_duplicates.sql`

## ✅ Vérification après exécution

Pour vérifier que tout s'est bien passé, exécutez ces requêtes :

```sql
-- Vérifier que la colonne started_at existe
DESCRIBE soumissions_examen;

-- Vérifier qu'il n'y a plus de doublons
SELECT examen_id, etudiant_id, COUNT(*) as count
FROM soumissions_examen
GROUP BY examen_id, etudiant_id
HAVING COUNT(*) > 1;

-- Si cette requête ne retourne aucun résultat, c'est bon ! ✅
```

## 🔧 En cas d'erreur

### Erreur : "Duplicate entry"
- Cela signifie que la contrainte existe déjà, c'est normal, ignorez cette erreur.

### Erreur : "Column already exists"
- La colonne `started_at` existe déjà, vous pouvez ignorer cette erreur.

### Erreur de connexion
- Vérifiez que MySQL est démarré
- Vérifiez les identifiants dans `application.properties`

## 📍 Emplacement des fichiers

Les scripts SQL se trouvent dans :
```
C:\Users\pret\Desktop\ProjetStage\backend\
├── migration_add_started_at.sql
└── migration_fix_duplicates.sql
```

## 💡 Astuce

Si vous utilisez Docker pour MySQL, vous pouvez aussi exécuter :

```bash
docker exec -i mysql_db mysql -uroot -potman123 projetstage < backend/migration_fix_duplicates.sql
```

