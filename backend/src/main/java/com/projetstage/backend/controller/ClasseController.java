package com.projetstage.backend.controller;

import com.projetstage.backend.model.Classe;
import com.projetstage.backend.model.Utilisateur;
import com.projetstage.backend.repository.ClasseRepository;
import com.projetstage.backend.dto.ClasseDTO;
import com.projetstage.backend.dto.ClasseDTOetudiant;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import com.projetstage.backend.repository.UtilisateurRepository;

import jakarta.transaction.Transactional;

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
public List<ClasseDTOetudiant> getAll() {
    return classeRepository.findAll()
            .stream()
            .map(ClasseDTOetudiant::new)
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
        Classe classe = classeRepository.findByIdWithEtudiants(id)
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

    @Transactional
    @PostMapping("/{classeId}/upload-excel")
public Classe uploadStudentsExcel(
        @PathVariable Long classeId,
        @RequestParam("file") MultipartFile file) {

    Classe classe = classeRepository.findById(classeId)
            .orElseThrow(() -> new RuntimeException("Classe not found"));

    try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
        Sheet sheet = workbook.getSheetAt(0);

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;

            String email = getCellValue(row.getCell(0));
            String nom = getCellValue(row.getCell(1));
            String motDePasse = getCellValue(row.getCell(2));

            Utilisateur etudiant = utilisateurRepository.findByEmail(email)
                    .orElseGet(() -> {
                        Utilisateur u = new Utilisateur();
                        u.setNom(nom);
                        u.setEmail(email);
                        u.setMotDePasse(motDePasse);
                        u.setRole(Utilisateur.Role.ETUDIANT);
                        return utilisateurRepository.save(u);
                    });

            if (!classe.getEtudiants().contains(etudiant)) {
                classe.getEtudiants().add(etudiant);
            }
        }

        return classeRepository.save(classe);

    } catch (Exception e) {
        throw new RuntimeException("Error processing Excel file: " + e.getMessage());
    }
}

private String getCellValue(Cell cell) {
    if (cell == null) return "";
    return switch (cell.getCellType()) {
        case STRING -> cell.getStringCellValue();
        case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
        case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
        default -> "";
    };
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
