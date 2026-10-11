package com.appleproduct.controller;

import com.appleproduct.dto.*;
import com.appleproduct.service.AuthService;
import com.appleproduct.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration, authentication, session tokens, and account profile")
public class AuthController {

    private final AuthService authService;
    private final CartService cartService;
    private final String cookieName;
    private final long expirationMs;

    public AuthController(
            AuthService authService,
            CartService cartService,
            @Value("${app.jwt.cookie-name:apple_product_token}") String cookieName,
            @Value("${app.jwt.expiration-ms:86400000}") long expirationMs) {
        this.authService = authService;
        this.cartService = cartService;
        this.cookieName = cookieName;
        this.expirationMs = expirationMs;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            HttpServletResponse response) {

        AuthResponse authResponse = authService.register(request);

        // Merge any guest cart
        if (sessionToken != null && !sessionToken.isBlank()) {
            cartService.mergeGuestCart(sessionToken);
        }

        // Set HttpOnly cookie
        ResponseCookie cookie = ResponseCookie.from(cookieName, authResponse.getToken())
                .httpOnly(true)
                .secure(false) // localhost dev
                .sameSite("Lax")
                .path("/")
                .maxAge(expirationMs / 1000)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(ApiResponse.success("Account registered successfully", authResponse));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody AuthRequest request,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            HttpServletResponse response) {

        AuthResponse authResponse = authService.login(request);

        // Merge guest cart if available
        if (sessionToken != null && !sessionToken.isBlank()) {
            cartService.mergeGuestCart(sessionToken);
        }

        ResponseCookie cookie = ResponseCookie.from(cookieName, authResponse.getToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(expirationMs / 1000)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(ApiResponse.success("Signed in successfully", authResponse));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user and invalidate session cookie")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(ApiResponse.success("Signed out successfully", null));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        UserDto user = authService.getCurrentUserDto();
        if (user == null) {
            return ResponseEntity.ok(ApiResponse.success("No active session", null));
        }
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}
