package com.stock.stockmanager.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id; // Import for timestamp
import jakarta.persistence.Table;

@Entity // Marks this class as a JPA entity
@Table(name = "notifications") // Specifies the database table name
public class Notification {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates ID for new entities (e.g., AUTO_INCREMENT)
    private Long id;

    private String title;
    private String message;
    @Column(name = "sender_id")
    private Integer senderId;
    private String senderUsername;
    private String senderRole;
    @Column(name = "recipient_id")
    private Integer recipientId;
    private String recipientRole; // e.g., "admin"
    private boolean readStatus;
    private LocalDateTime sentAt; // To store the timestamp of when the notification was sent

    // --- Constructors ---
    public Notification() {
        // Default constructor needed by JPA
    }

    public Notification(String title, String message, Integer senderId, String senderUsername, String senderRole, Integer recipientId, String recipientRole, boolean readStatus, LocalDateTime sentAt) {
        this.title = title;
        this.message = message;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.senderRole = senderRole;
        this.recipientId = recipientId;
        this.recipientRole = recipientRole;
        this.readStatus = readStatus;
        this.sentAt = sentAt;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getSenderRole() {
        return senderRole;
    }

    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }

    public Integer getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Integer recipientId) {
        this.recipientId = recipientId;
    }

    public String getRecipientRole() {
        return recipientRole;
    }

    public void setRecipientRole(String recipientRole) {
        this.recipientRole = recipientRole;
    }

    public boolean isReadStatus() {
        return readStatus;
    }

    public void setReadStatus(boolean readStatus) {
        this.readStatus = readStatus;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
