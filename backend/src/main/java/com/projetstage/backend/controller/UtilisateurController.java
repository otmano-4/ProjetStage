package com.projetstage.backend.controller;

import com.projetstage.backend.model.Utilisateur;
import com.projetstage.backend.repository.UtilisateurRepository;
import com.projetstage.backend.dto.UtilisateurDTO;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "*")
public class UtilisateurController {

    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurController(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    // ✅ Liste des utilisateurs (DTO)
    @GetMapping
    public List<UtilisateurDTO> getAll() {
        return utilisateurRepository.findAll()
                .stream()
                .map(UtilisateurDTO::new)
                .toList();
    }

    // ✅ Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public UtilisateurDTO getById(@PathVariable Long id) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return new UtilisateurDTO(u);
    }

    // ✅ Inscription
    @PostMapping("/inscription")
    public UtilisateurDTO inscrire(@RequestBody Utilisateur utilisateur) {
        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return new UtilisateurDTO(saved);
    }

    // ✅ Connexion (login)
    @PostMapping("/login")
    public UtilisateurDTO login(@RequestBody Utilisateur loginData) {
        Utilisateur u = utilisateurRepository.findByEmail(loginData.getEmail())
                .filter(x -> x.getMotDePasse().equals(loginData.getMotDePasse()))
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
        return new UtilisateurDTO(u);
    }

    // ✅ Modifier un utilisateur
    @PutMapping("/{id}")
    public UtilisateurDTO update(@PathVariable Long id, @RequestBody Utilisateur newData) {
        Utilisateur updated = utilisateurRepository.findById(id)
                .map(u -> {
                    u.setNom(newData.getNom());
                    u.setEmail(newData.getEmail());
                    u.setMotDePasse(newData.getMotDePasse());
                    u.setRole(newData.getRole());
                    return utilisateurRepository.save(u);
                })
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return new UtilisateurDTO(updated);
    }

    // ✅ Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        utilisateurRepository.deleteById(id);
    }
}
