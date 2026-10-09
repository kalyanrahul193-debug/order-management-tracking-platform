package com.orderplatform.config;

import com.orderplatform.entity.Role;
import com.orderplatform.entity.User;
import com.orderplatform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@orderplatform.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("customer")) {
            User customer = new User();
            customer.setUsername("customer");
            customer.setEmail("customer@orderplatform.com");
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setRole(Role.ROLE_CUSTOMER);
            customer.setCreatedAt(LocalDateTime.now());
            userRepository.save(customer);
        }
    }
}
