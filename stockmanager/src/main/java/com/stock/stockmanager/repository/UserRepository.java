package com.stock.stockmanager.repository;

import com.stock.stockmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Trouver un utilisateur par username et password (utile pour le login)
    Optional<User> findByUsernameAndPassword(String username, String password);

    // Trouver un utilisateur par email
    Optional<User> findByEmail(String email);

    // Vérifier si un username existe déjà
    boolean existsByUsername(String username);

    // Vérifier si un email existe déjà
    boolean existsByEmail(String email);
}
