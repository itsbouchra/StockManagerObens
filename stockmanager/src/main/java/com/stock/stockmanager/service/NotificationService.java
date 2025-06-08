package com.stock.stockmanager.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stock.stockmanager.model.Notification;
import com.stock.stockmanager.model.User;
import com.stock.stockmanager.repository.NotificationRepository;
import com.stock.stockmanager.repository.UserRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Notification createNotification(String senderIdString, String senderRole, String recipientUsername, String title, String message, String senderUsername) {
        try {
            if (senderIdString == null || senderIdString.equals("undefined")) {
                throw new IllegalArgumentException("Invalid sender ID: cannot be null or undefined");
            }
            
            Integer senderId = Integer.valueOf(senderIdString.trim());

            User recipientUser;
            String finalRecipientRole;

            if ("SUPPLIER".equalsIgnoreCase(senderRole) || "FOURNISSEUR".equalsIgnoreCase(senderRole)) {
                // If sender is a supplier, find an ADMIN to send the message to
                recipientUser = userRepository.findFirstByRole("ADMIN")
                    .orElseThrow(() -> new IllegalArgumentException("No ADMIN user found to receive message"));
                finalRecipientRole = recipientUser.getRole().toUpperCase();
            } else {
                // For other roles (e.g., ADMIN), recipientUsername is expected
                if (recipientUsername == null || recipientUsername.trim().isEmpty()) {
                    throw new IllegalArgumentException("Recipient username is required for non-supplier senders.");
                }
                recipientUser = userRepository.findByUsername(recipientUsername);
                if (recipientUser == null) {
                    throw new IllegalArgumentException("Recipient user not found: " + recipientUsername);
                }
                
                // Validate recipient role for admin sender
                String recipientRoleFromUser = recipientUser.getRole().toUpperCase();
                if (!recipientRoleFromUser.equals("SUPPLIER") && !recipientRoleFromUser.equals("CLIENT")) {
                    throw new IllegalArgumentException("Recipient must be either a SUPPLIER or a CLIENT");
                }
                finalRecipientRole = recipientRoleFromUser;
            }

            Notification notification = new Notification();
            notification.setSenderId(senderId);
            notification.setSenderRole(senderRole.toUpperCase());
            notification.setRecipientId(recipientUser.getId_user());
            notification.setRecipientRole(finalRecipientRole); // Use the determined final recipient role
            notification.setTitle(title != null ? title : "");
            notification.setMessage(message);
            notification.setSenderUsername(senderUsername != null ? senderUsername : "");
            notification.setSentAt(LocalDateTime.now());
            notification.setReadStatus(false);
            return notificationRepository.save(notification);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid sender ID format: " + senderIdString);
        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while creating notification: " + e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while creating notification: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<Notification> getNotificationsForUser(String role, String userIdString) {
        try {
            if (userIdString == null || userIdString.equals("undefined")) {
                throw new IllegalArgumentException("Invalid user ID: cannot be null or undefined");
            }
            
            Integer userId = Integer.valueOf(userIdString.trim());
            String upperRole = role.toUpperCase();
            System.out.println("Fetching notifications for role: " + upperRole + ", userId: " + userId);
            
            // Get notifications where user is recipient
            List<Notification> receivedNotifications = notificationRepository
                .findByRecipientRoleAndSenderIdOrderBySentAtDesc(upperRole, userId);
            
            // Get notifications where user is sender
            List<Notification> sentNotifications = notificationRepository
                .findBySenderRoleAndSenderIdOrderBySentAtDesc(upperRole, userId);
            
            // Combine and sort by sentAt
            List<Notification> allNotifications = new ArrayList<>();
            allNotifications.addAll(receivedNotifications);
            allNotifications.addAll(sentNotifications);
            allNotifications.sort((n1, n2) -> n2.getSentAt().compareTo(n1.getSentAt()));
            
            System.out.println("Found " + allNotifications.size() + " notifications");
            return allNotifications;
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid user ID format: " + userIdString);
        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while fetching notifications: " + e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while fetching notifications: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotificationsForRole(String role) {
        try {
            return notificationRepository.findByReadStatusAndRecipientRoleOrderBySentAtDesc(false, role.toUpperCase());
        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while fetching unread notifications: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while fetching unread notifications: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void markNotificationAsRead(Long notificationId) {
        try {
            notificationRepository.findById(notificationId).ifPresent(notification -> {
                notification.setReadStatus(true);
                notificationRepository.save(notification);
            });
        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while marking notification as read: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while marking notification as read: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void markAllNotificationsAsRead(String role) {
        try {
            List<Notification> unreadNotifications = getUnreadNotificationsForRole(role);
            unreadNotifications.forEach(notification -> {
                notification.setReadStatus(true);
                notificationRepository.save(notification);
            });
        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while marking all notifications as read: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while marking all notifications as read: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        try {
            notificationRepository.deleteById(notificationId);
        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while deleting notification: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while deleting notification: " + e.getMessage(), e);
        }
    }
} 