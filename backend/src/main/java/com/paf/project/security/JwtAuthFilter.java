package com.paf.project.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.paf.project.core.util.Constants;
import com.paf.project.model.auth.User;
import com.paf.project.repository.auth.UserRepository;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    // OncePerRequestFilter = guaranteed to run exactly once per HTTP request
    // (Spring's filter chain can theoretically invoke filters multiple times — this prevents it)

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // ── STEP 1: Extract the Authorization header ──────────────────────
        // Every API request from React sends: Authorization: Bearer <token>
        final String authHeader = request.getHeader(Constants.JWT_HEADER); // "Authorization"

        if (authHeader == null || !authHeader.startsWith(Constants.JWT_PREFIX)) {
            // No token present — continue the chain, endpoint may be public
            // If it's protected, SecurityConfig will return 401 automatically
            filterChain.doFilter(request, response);
            return;
        }

        // ── STEP 2: Strip "Bearer " prefix to get the raw token ───────────
        final String token = authHeader.substring(Constants.JWT_PREFIX.length()); // 7 chars

        try {
            // ── STEP 3: Extract email from token (also verifies signature) ─
            final String email = jwtUtil.extractEmail(token);

            // ── STEP 4: Only authenticate if not already authenticated ──────
            // SecurityContextHolder may already hold auth from a previous filter
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // ── STEP 5: Load user from DB ─────────────────────────────
                // We verify the user still exists — accounts may be deleted/disabled
                User user = userRepository.findByEmail(email).orElse(null);

                if (user != null && jwtUtil.isTokenValid(token, email)) {
                    SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().name()); // .name() on enum
                    
                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            List.of(authority)
                        );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (JwtException e) {
            // Token is malformed, expired, or tampered — silently drop it
            // The request continues as unauthenticated; SecurityConfig handles 401
        }

        // ── STEP 8: Always continue the chain regardless ──────────────────
        filterChain.doFilter(request, response);
    }
}
