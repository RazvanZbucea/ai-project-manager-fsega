package com.fsega.ai_project_manager.service;

import com.fsega.ai_project_manager.controller.dto.AdminUserCreateDTO;
import com.fsega.ai_project_manager.controller.dto.UserCreateDTO;
import com.fsega.ai_project_manager.controller.dto.UserDTO;
import com.fsega.ai_project_manager.controller.dto.UserUpdateDTO;
import com.fsega.ai_project_manager.model.Role;
import com.fsega.ai_project_manager.model.User;
import com.fsega.ai_project_manager.model.enums.Name;
import com.fsega.ai_project_manager.repository.RoleRepository;
import com.fsega.ai_project_manager.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findByIsDeletedFalse().stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public UserDTO createUser(UserCreateDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.username());
        user.setEmail(userDTO.email());
        user.setPassword(passwordEncoder.encode(userDTO.password()));
        user.setFirstName(userDTO.firstName());
        user.setLastName(userDTO.lastName());

        Role defaultRole = roleRepository.findByName(Name.DEVELOPER)
                .orElseThrow(() -> new IllegalStateException("Rolul de bază nu există în sistem. Contactează administratorul."));
        user.getRoles().add(defaultRole);

        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserUpdateDTO userDTO) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        user.setEmail(userDTO.email());
        user.setFirstName(userDTO.firstName());
        user.setLastName(userDTO.lastName());

        return convertToDTO(user);
    }

    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public UserDTO adminCreateUser(AdminUserCreateDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.username());
        user.setEmail(userDTO.email());
        user.setPassword(passwordEncoder.encode(userDTO.password()));
        user.setFirstName(userDTO.firstName());
        user.setLastName(userDTO.lastName());

        Role defaultRole = roleRepository.findByName(Name.valueOf(userDTO.role()))
                .orElseThrow(() -> new IllegalStateException("Rolul de bază nu există în sistem. Contactează administratorul."));

        user.getRoles().add(defaultRole);

        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    public boolean isCurrentUser(Long id, String username) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        return user.getUsername().equals(username);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getCreatedAt().toString(),
                user.getUpdatedAt().toString());
    }
}
