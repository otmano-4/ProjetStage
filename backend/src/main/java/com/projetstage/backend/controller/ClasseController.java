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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

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

    @Transactional
    @GetMapping("/{id}")
    public ClasseDTO getById(@PathVariable Long id) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));

        // Force initialization of lazy collections
        classe.getEtudiants().size();
        classe.getProfesseurs().size();

        return new ClasseDTO(classe);
    }


    // @GetMapping("/{id}")
    // public ClasseDTO getById(@PathVariable Long id) {
    //     Classe classe = classeRepository.findByIdWithEtudiantsAndProfesseurs(id)
    //             .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
    //     return new ClasseDTO(classe);
    // }



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
    public ClasseDTO uploadStudentsExcel(
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

                classe.getEtudiants().add(etudiant);
            }

            classeRepository.save(classe);

            return new ClasseDTO(classe);

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



    @Transactional
    @PostMapping("/{id}/students")
    public ResponseEntity<ClasseDTO> addStudent(@PathVariable Long id, @RequestBody ClasseDTOetudiant.CreateStudentDTO dto) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Classe non trouvée"));

        Utilisateur etudiant = utilisateurRepository.findByEmail(dto.getEmail())
                .orElseGet(() -> {
                    Utilisateur u = new Utilisateur();
                    u.setNom(dto.getNom());
                    u.setEmail(dto.getEmail());
                    u.setMotDePasse(dto.getMotDePasse());
                    u.setRole(Utilisateur.Role.ETUDIANT);
                    return utilisateurRepository.save(u);
                });

        if (!classe.getEtudiants().contains(etudiant)) {
            classe.getEtudiants().add(etudiant);
            classeRepository.save(classe);
        }

        return ResponseEntity.ok(new ClasseDTO(classe));
    }



    @Transactional
    @PostMapping("/{classeId}/add-professeur/{userId}")
    public ClasseDTO addProfesseurToClasse(@PathVariable Long classeId, @PathVariable Long userId) {
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new RuntimeException("Classe not found"));

        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Utilisateur.Role.PROFESSEUR) {
            throw new RuntimeException("You can only add PROFESSEUR to a class");
        }

        if (classe.getProfesseurs() == null) {
            classe.setProfesseurs(new java.util.HashSet<>());
        }

        classe.getProfesseurs().add(user);
        classeRepository.save(classe);

        // Return a DTO instead of the entity
        return new ClasseDTO(classe);  
    }



    

    @GetMapping("/professeur/{profId}")
    public List<ClasseDTOetudiant> getClassesByProfesseur(@PathVariable Long profId) {
        return classeRepository.findAllByProfesseurId(profId)
                .stream()
                .map(ClasseDTOetudiant::new)
                .collect(Collectors.toList());
    }

}
