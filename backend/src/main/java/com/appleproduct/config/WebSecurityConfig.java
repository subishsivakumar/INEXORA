package com.appleproduct.config;

import com.appleproduct.security.JwtAuthenticationFilter;
import com.appleproduct.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;
    private final CorsConfig corsConfig;

    public WebSecurityConfig(
            JwtAuthenticationFilter jwtAuthFilter,
            UserDetailsServiceImpl userDetailsService,
            CorsConfig corsConfig) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
        this.corsConfig = corsConfig;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                // Public frontend static assets and SPA routes
                .requestMatchers("/", "/index.html", "/assets/**", "/images/**", "/models/**", "/draco/**", "/favicon.svg", "/icons.svg").permitAll()
                .requestMatchers("/cart", "/checkout", "/compare", "/account", "/admin", "/products", "/products/**", "/product/**").permitAll()
                
                // Public health check and root ping
                .requestMatchers("/health", "/api/health").permitAll()
                
                // Public authentication endpoints
                .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/logout").permitAll()
                
                // Public catalog and category browsing
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                
                // Cart operations are accessible to both guests and authenticated users
                .requestMatchers("/api/cart/**").permitAll()
                
                // Swagger / OpenAPI documentation
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                
                // Admin dashboard and endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Protected endpoints (account, orders, wishlist)
                .requestMatchers("/api/auth/me").authenticated()
                .requestMatchers("/api/wishlist/**").authenticated()
                .requestMatchers("/api/orders/**").authenticated()
                .requestMatchers("/api/addresses/**").authenticated()
                
                // Any other request
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
