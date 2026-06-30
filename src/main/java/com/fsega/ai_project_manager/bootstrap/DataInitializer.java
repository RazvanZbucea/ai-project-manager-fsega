package com.fsega.ai_project_manager.bootstrap;

import com.fsega.ai_project_manager.model.Role;
import com.fsega.ai_project_manager.model.User;
import com.fsega.ai_project_manager.model.enums.Name;
import com.fsega.ai_project_manager.repository.RoleRepository;
import com.fsega.ai_project_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Role adminRole = new Role();
            adminRole.setName(Name.ADMIN);
            roleRepository.save(adminRole);

            Role managerRole = new Role();
            managerRole.setName(Name.MANAGER);
            roleRepository.save(managerRole);

            Role devRole = new Role();
            devRole.setName(Name.DEVELOPER);
            roleRepository.save(devRole);
        }

        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName(Name.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Role ADMIN not found"));

            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@email.ro");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setFirstName("Super");
            adminUser.setLastName("Admin");

            adminUser.getRoles().add(adminRole);

            userRepository.save(adminUser);
        }
    }
}