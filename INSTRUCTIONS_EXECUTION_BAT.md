# 📋 Instructions Détaillées : Exécuter executer_migrations.bat

## 🎯 Méthode Simple : Double-clic sur le fichier

### Étape 1 : Trouver le fichier

1. **Ouvrez l'Explorateur de fichiers Windows**
   - Appuyez sur `Windows + E` ou cliquez sur l'icône 📁 dans la barre des tâches

2. **Naviguez vers le dossier du projet**
   - Allez dans : `C:\Users\pret\Desktop\ProjetStage\backend\`
   - Ou utilisez le chemin : `Desktop` → `ProjetStage` → `backend`

3. **Cherchez le fichier** `executer_migrations.bat`
   - C'est un fichier avec une icône d'engrenage ⚙️ ou une fenêtre noire

### Étape 2 : Exécuter le fichier

**Option A : Double-clic simple**
1. **Double-cliquez** sur `executer_migrations.bat`
2. Une fenêtre noire (invite de commande) va s'ouvrir
3. Le script va s'exécuter automatiquement
4. Attendez que le message "Execution terminee !" apparaisse
5. Appuyez sur une touche pour fermer la fenêtre

**Option B : Clic droit → Exécuter en tant qu'administrateur (si nécessaire)**
1. **Clic droit** sur `executer_migrations.bat`
2. Sélectionnez **"Exécuter en tant qu'administrateur"**
3. Confirmez si Windows demande la permission

### Étape 3 : Vérifier le résultat

Vous devriez voir dans la fenêtre noire :
```
========================================
Execution des scripts de migration SQL
========================================

[1/2] Execution de migration_add_started_at.sql...
OK: migration_add_started_at.sql execute avec succes

[2/2] Execution de migration_fix_duplicates.sql...
OK: migration_fix_duplicates.sql execute avec succes

========================================
Execution terminee !
========================================
```

## ⚠️ Si ça ne fonctionne pas

### Problème 1 : "MySQL n'est pas dans le PATH"

**Solution :**
1. Ouvrez PowerShell en tant qu'administrateur
2. Naviguez vers le dossier backend :
   ```powershell
   cd C:\Users\pret\Desktop\ProjetStage\backend
   ```
3. Exécutez manuellement :
   ```powershell
   mysql -u root -potman123 projetstage < migration_add_started_at.sql
   mysql -u root -potman123 projetstage < migration_fix_duplicates.sql
   ```

### Problème 2 : "Le fichier ne s'ouvre pas"

**Solution :**
1. **Clic droit** sur `executer_migrations.bat`
2. Sélectionnez **"Ouvrir avec"** → **"Invite de commandes"** ou **"Windows PowerShell"**

### Problème 3 : "Accès refusé"

**Solution :**
1. **Clic droit** sur `executer_migrations.bat`
2. Sélectionnez **"Propriétés"**
3. En bas, cochez **"Débloquer"** si disponible
4. Cliquez sur **"OK"**
5. Réessayez le double-clic

## 🖼️ Guide Visuel

```
📁 Desktop
  └── 📁 ProjetStage
      └── 📁 backend
          ├── 📄 executer_migrations.bat  ← DOUBLE-CLIQUEZ ICI
          ├── 📄 migration_add_started_at.sql
          └── 📄 migration_fix_duplicates.sql
```

## 📝 Alternative : Exécution manuelle dans PowerShell

Si le double-clic ne fonctionne pas, suivez ces étapes :

1. **Ouvrez PowerShell**
   - Appuyez sur `Windows + X`
   - Sélectionnez **"Windows PowerShell"** ou **"Terminal"**

2. **Naviguez vers le dossier**
   ```powershell
   cd C:\Users\pret\Desktop\ProjetStage\backend
   ```

3. **Exécutez le script**
   ```powershell
   .\executer_migrations.bat
   ```

4. **Ou exécutez les commandes directement**
   ```powershell
   mysql -u root -potman123 projetstage < migration_add_started_at.sql
   mysql -u root -potman123 projetstage < migration_fix_duplicates.sql
   ```

## ✅ Vérification finale

Après l'exécution, vérifiez que tout fonctionne :

1. **Redémarrez votre backend Spring Boot**
2. **Testez la soumission d'un examen**
3. **Vérifiez qu'il n'y a plus d'erreurs 500**

---

**Besoin d'aide ?** Si vous rencontrez toujours des problèmes, utilisez MySQL Workbench (voir GUIDE_EXECUTION_SQL.md)

