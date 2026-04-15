package com.paf.project.security;

import java.util.Base64;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.paf.project.model.auth.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secretKey;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long expiration;

    // ── builds a cryptographic key from your Base64 config value ──────────
    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
        // Keys.hmacShaKeyFor enforces minimum 256-bit length for HS256
        // throws WeakKeyException at startup if secret is too short — fail fast
    }

    // ── TOKEN GENERATION ──────────────────────────────────────────────────
    /**
     * Called by OAuth2SuccessHandler after Google login succeeds.
     * We store email as subject (standard), role + userId as custom claims.
     * Role in the token = no DB hit needed on every request for auth checks.
     * This keeps the API stateless — REST Constraint #2.
     */
    public String generateToken(String email, User.Role role, Long userId) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role.name())  // .name() converts enum → String for JWT storage
                .claim("userId", userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    // ── TOKEN PARSING ─────────────────────────────────────────────────────
    /**
     * Parses and verifies the token signature + expiry in one call.
     * If anything is wrong (tampered, expired, wrong signature) jjwt
     * throws a JwtException which our JwtAuthFilter catches and ignores
     * (request continues as unauthenticated — SecurityConfig decides fate).
     */
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())  // verifies signature
                .build()
                .parseSignedClaims(token)
                .getPayload();               // returns the claims map
    }

    // ── CONVENIENCE EXTRACTORS ────────────────────────────────────────────
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public Long extractUserId(String token) {
        return extractAllClaims(token).get("userId", Long.class);
    }

    // ── VALIDATION ────────────────────────────────────────────────────────
    /**
     * Two checks:
     *  1. email in token matches the email we looked up from DB
     *  2. token is not expired (jjwt's expiration check)
     * Called inside JwtAuthFilter after extracting claims.
     */
    public boolean isTokenValid(String token, String email) {
        try {
            return extractEmail(token).equals(email) && !isTokenExpired(token);
        } catch (JwtException e) {
            return false; // covers: MalformedJwtException, SignatureException, etc.
        }
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }
}
