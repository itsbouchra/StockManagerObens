package com.stock.stockmanager.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.dto.NotificationRequest;
import com.stock.stockmanager.model.Notification;
import com.stock.stockmanager.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://10.0.2.2:8080")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<?> sendNotification(@RequestBody NotificationRequest request) {
        try {
            Notification notification = notificationService.createNotification(
                request.getSenderId(),
                request.getSenderRole(),
                request.getRecipientUsername(),
                request.getTitle(),
                request.getMessage(),
                request.getSenderUsername()
            );
            return ResponseEntity.ok(notification);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending notification: " + e.getMessage());
        }
    }

    @GetMapping("/recipient/{role}/{recipientId}")
    public ResponseEntity<?> getRecipientNotifications(
            @PathVariable String role,
            @PathVariable String recipientId) {
        try {
            List<Notification> notifications = notificationService.getNotificationsByRecipient(role, recipientId);
            return ResponseEntity.ok(notifications);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching recipient notifications: " + e.getMessage());
        }
    }

    @GetMapping("/recipient/{role}/{recipientId}/unread/count")
    public ResponseEntity<?> getUnreadRecipientNotificationsCount(
            @PathVariable String role,
            @PathVariable String recipientId) {
        try {
            long unreadCount = notificationService.getUnreadNotificationsCountByRecipient(role, recipientId);
            return ResponseEntity.ok(unreadCount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching unread recipient notifications count: " + e.getMessage());
        }
    }

    @GetMapping("/user/{role}/{userId}")
    public ResponseEntity<?> getUserNotifications(
            @PathVariable String role,
            @PathVariable String userId) {
        try {
            List<Notification> notifications = notificationService.getNotificationsForUser(role, userId);
            return ResponseEntity.ok(notifications);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching notifications: " + e.getMessage());
        }
    }

    @GetMapping("/unread/{role}")
    public ResponseEntity<?> getUnreadNotifications(@PathVariable String role) {
        try {
            List<Notification> notifications = notificationService.getUnreadNotificationsForRole(role);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching unread notifications: " + e.getMessage());
        }
    }

    @PutMapping("/read/{notificationId}")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Long notificationId) {
        try {
            notificationService.markNotificationAsRead(notificationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error marking notification as read: " + e.getMessage());
        }
    }

    @PutMapping("/read-all/{role}")
    public ResponseEntity<?> markAllNotificationsAsRead(@PathVariable String role) {
        try {
            notificationService.markAllNotificationsAsRead(role);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error marking all notifications as read: " + e.getMessage());
        }
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId) {
        try {
            notificationService.deleteNotification(notificationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting notification: " + e.getMessage());
        }
    }
} 