package com.appleproduct.service;

import com.appleproduct.dto.*;
import com.appleproduct.entity.Role;
import com.appleproduct.entity.User;
import com.appleproduct.exception.BadRequestException;
import com.appleproduct.repository.RoleRepository;
import com.appleproduct.repository.UserRepository;
import com.appleproduct.security.CustomUserDetails;
import com.appleproduct.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    // In-memory login rate-limiter (per IP/email)
    private final Map<String, Integer> loginAttempts = new ConcurrentHashMap<>();
    private final Map<String, Long> lockoutTimestamps = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCKOUT_DURATION_MS = 60_000; // 1 minute lockout

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match.");
        }

        if (request.getPassword().length() < 8) {
            throw new BadRequestException("Password must be at least 8 characters long.");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setFullName(request.getFullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));
        user.getRoles().add(userRole);

        user = userRepository.save(user);

        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String token = tokenProvider.generateTokenForUser(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                roleNames
        );

        UserDto userDto = new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                new HashSet<>(roleNames)
        );

        return new AuthResponse(token, userDto);
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        // Check rate limiting
        Long lockoutUntil = lockoutTimestamps.get(email);
        if (lockoutUntil != null && System.currentTimeMillis() < lockoutUntil) {
            long remainingSec = (lockoutUntil - System.currentTimeMillis()) / 1000;
            throw new BadRequestException("Too many failed attempts. Please try again in " + remainingSec + " seconds.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );

            // Reset login attempts on success
            loginAttempts.remove(email);
            lockoutTimestamps.remove(email);

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String token = tokenProvider.generateToken(authentication);

            Set<String> roles = userDetails.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .collect(Collectors.toSet());

            UserDto userDto = new UserDto(
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getFullName(),
                    roles
            );

            return new AuthResponse(token, userDto);
        } catch (BadCredentialsException ex) {
            int attempts = loginAttempts.getOrDefault(email, 0) + 1;
            loginAttempts.put(email, attempts);
            if (attempts >= MAX_ATTEMPTS) {
                lockoutTimestamps.put(email, System.currentTimeMillis() + LOCKOUT_DURATION_MS);
            }
            throw new BadCredentialsException("Invalid email address or password.");
        }
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUserDto() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }

        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return null;
        }

        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserDto(user.getId(), user.getEmail(), user.getFullName(), roles);
    }

    public User getCurrentAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }
}
