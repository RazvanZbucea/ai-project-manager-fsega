package com.fsega.ai_project_manager.service;

import com.fsega.ai_project_manager.controller.dto.UserCreateDTO;
import com.fsega.ai_project_manager.controller.dto.UserDTO;
import com.fsega.ai_project_manager.controller.dto.UserUpdateDTO;
import com.fsega.ai_project_manager.model.User;
import com.fsega.ai_project_manager.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
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
        user.setPassword(userDTO.password());
        user.setFirstName(userDTO.firstName());
        user.setLastName(userDTO.lastName());
        user.setCreatedAt(java.time.LocalDateTime.now());

        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    @Transactional

    public UserDTO updateUser(Long id, UserUpdateDTO userDTO) {

        User foundUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        foundUser.setEmail(userDTO.email());
        foundUser.setFirstName(userDTO.firstName());
        foundUser.setLastName(userDTO.lastName());

        User savedUser = userRepository.save(foundUser);

        return convertToDTO(savedUser);
    }

    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getCreatedAt().toString());
    }
}
