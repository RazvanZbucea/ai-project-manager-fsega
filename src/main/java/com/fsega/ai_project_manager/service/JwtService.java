package com.fsega.ai_project_manager.service;

import com.fsega.ai_project_manager.model.CustomUserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private String generateToken(CustomUserDetails user) {
        return Jwts.builder().subject(user.getUsername()).issuedAt(new Date(System.currentTimeMillis())).expiration(new Date(System.currentTimeMillis() + jwtExpiration)).signWith(getSignInKey()).compact();
    }

    private String extractUsername(String token) {
        return Jwts.parser().verifyWith(getSignInKey()).build.parseSignedClaims(token).getPayload();
    }

    private boolean isTokenValid(String token, CustomUserDetails user) {
        return user.getUsername().equals(extractUsername(token));
    }

    private boolean isTokenExpired(String token){

    }

}
