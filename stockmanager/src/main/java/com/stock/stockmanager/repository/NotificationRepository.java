package com.stock.stockmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stock.stockmanager.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Find notifications where the user is the recipient
    List<Notification> findByRecipientRoleOrderBySentAtDesc(String recipientRole);
    
    // Find notifications where the user is the sender
    List<Notification> findBySenderRoleAndSenderIdOrderBySentAtDesc(String senderRole, Integer senderId);
    
    // Find notifications where the user is the recipient and matches the sender ID
    List<Notification> findByRecipientRoleAndSenderIdOrderBySentAtDesc(String recipientRole, Integer senderId);
    
    // Find unread notifications for a specific role
    List<Notification> findByReadStatusAndRecipientRoleOrderBySentAtDesc(boolean readStatus, String recipientRole);
    
    // Find all notifications for a user (both sent and received)
    @Query("SELECT n FROM Notification n WHERE " +
           "(n.recipientRole = :role AND n.senderId = :userId) OR " +
           "(n.senderRole = :role AND n.senderId = :userId) " +
           "ORDER BY n.sentAt DESC")
    List<Notification> findByRecipientRoleOrSenderRoleAndSenderIdOrderBySentAtDesc(
        @Param("role") String role,
        @Param("userId") Integer userId
    );
} 