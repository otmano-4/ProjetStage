package com.projetstage.backend.controller;

import com.projetstage.backend.model.Classe;
import com.projetstage.backend.model.Utilisateur;
import com.projetstage.backend.repository.ClasseRepository;
import com.projetstage.backend.dto.ClasseDTO;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import com.projetstage.backend.repository.UtilisateurRepository;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "*")
public class ClasseController {

    private final ClasseRepository classeRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ClasseController(ClasseRepository classeRepository, UtilisateurRepository utilisateurRepository) {
        this.classeRepository = classeRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // ✅ Liste des classes
    @GetMapping
    public List<ClasseDTO> getAll() {
        return classeRepository.findAll()
                .stream()
                .map(ClasseDTO::new)
                .toList();
    }

    // ✅ Créer une classe
    @PostMapping
    public ClasseDTO create(@RequestBody Classe classe) {
        Classe saved = classeRepository.save(classe);
        return new ClasseDTO(saved);
    }

    // ✅ Supprimer une classe
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        classeRepository.deleteById(id);
    }

    // ✅ Récupérer une classe par ID avec ses étudiants
    @GetMapping("/{id}")
    public ClasseDTO getById(@PathVariable Long id) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        return new ClasseDTO(classe);
    }


    @PostMapping("/{classeId}/add-etudiant/{userId}")
    public Classe addEtudiantToClasse(@PathVariable Long classeId, @PathVariable Long userId) {
        
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new RuntimeException("Classe not found"));
        
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Utilisateur.Role.ETUDIANT) {
            throw new RuntimeException("You can only add ETUDIANT to a class");
        }

        classe.getEtudiants().add(user);
        return classeRepository.save(classe);
    }


    @PostMapping("/{classeId}/upload-excel")
    public Classe uploadStudentsExcel(@PathVariable Long classeId, @RequestParam("file") MultipartFile file) {
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new RuntimeException("Classe not found"));

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {  // Skip header row
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String nom = row.getCell(0).getStringCellValue();
                String email = row.getCell(1).getStringCellValue();
                String motDePasse = row.getCell(2).getStringCellValue();

                // Find existing student
                Optional<Utilisateur> existing = utilisateurRepository.findByEmail(email);

                Utilisateur etudiant;

                if (existing.isPresent()) {
                    etudiant = existing.get();
                } else {
                    // Create new student
                    etudiant = new Utilisateur();
                    etudiant.setNom(nom);
                    etudiant.setEmail(email);
                    etudiant.setMotDePasse(motDePasse);
                    etudiant.setRole(Utilisateur.Role.ETUDIANT);

                    etudiant = utilisateurRepository.save(etudiant);
                }

                // Add to class if not already added
                if (!classe.getEtudiants().contains(etudiant)) {
                    classe.getEtudiants().add(etudiant);
                }
            }

            return classeRepository.save(classe);

        } catch (Exception e) {
            throw new RuntimeException("Error processing Excel file: " + e.getMessage());
        }
    }




    // // ✅ Ajouter un étudiant manuellement
    // @PostMapping("/{id}/students")
    // public ClasseDTO addStudent(@PathVariable Long id, @RequestBody Student student) {
    //     Classe classe = classeRepository.findById(id)
    //             .orElseThrow(() -> new RuntimeException("Classe non trouvée"));

    //     student.setClasse(classe);
    //     studentRepository.save(student);

    //     return new ClasseDTO(classe);
    // }

    // // ✅ Ajouter plusieurs étudiants via Excel (JSON array)
    // @PostMapping("/{id}/students/bulk")
    // public ClasseDTO addStudentsBulk(@PathVariable Long id, @RequestBody List<Student> students) {
    //     Classe classe = classeRepository.findById(id)
    //             .orElseThrow(() -> new RuntimeException("Classe non trouvée"));

    //     students.forEach(student -> student.setClasse(classe));
    //     studentRepository.saveAll(students);

    //     return new ClasseDTO(classe);
    // }
}
