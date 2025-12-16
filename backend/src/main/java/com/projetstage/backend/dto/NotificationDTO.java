package com.projetstage.backend.dto;

import com.projetstage.backend.model.Notification;
import java.time.LocalDateTime;

public class NotificationDTO {
    private Long id;
    private String type;
    private String titre;
    private String message;
    private LocalDateTime dateCreation;
    private boolean lu;
    private Long examenId;

    public NotificationDTO(Notification notification) {
        this.id = notification.getId();
        this.type = notification.getType().name();
        this.titre = notification.getTitre();
        this.message = notification.getMessage();
        this.dateCreation = notification.getDateCreation();
        this.lu = notification.isLu();
        this.examenId = notification.getExamenId();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public boolean isLu() {
        return lu;
    }

    public void setLu(boolean lu) {
        this.lu = lu;
    }

    public Long getExamenId() {
        return examenId;
    }

    public void setExamenId(Long examenId) {
        this.examenId = examenId;
    }
}

