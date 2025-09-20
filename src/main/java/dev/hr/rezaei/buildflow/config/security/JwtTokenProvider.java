package dev.hr.rezaei.buildflow.config.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT utility class for generating and validating JWT tokens.
 */
@Slf4j
@NoArgsConstructor
@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    @Value("${app.jwt.expiration:86400000}") // 24 hours in milliseconds
    private int jwtExpirationInMs;

    // All-args constructor (useful for testing or manual instantiation)
    public JwtTokenProvider(String jwtSecret, int jwtExpirationInMs) {
        this.jwtSecret = jwtSecret;
        this.jwtExpirationInMs = jwtExpirationInMs;
        validateConfiguration();
    }

    @PostConstruct
    private void validateConfiguration() {
        if (jwtSecret == null || jwtSecret.trim().isEmpty()) {
            throw new IllegalStateException(
                    "JWT secret must be configured. Set app.jwt.secret property with a strong secret key (minimum 256 bits)"
            );
        }
        if (jwtSecret.length() < 32) {
            log.warn("JWT secret is shorter than recommended 256 bits (32 characters). Consider using a stronger secret.");
        }
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generates a JWT token for the authenticated user. The token includes the username as the subject and has an
     * expiration time.
     *
     * @param authentication the authentication object containing user details
     * @return a signed JWT token as a String
     */
    public Token generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationInMs);

        String tokenValue = Jwts.builder()
                .subject(userPrincipal.getUsername())
                .issuedAt(new Date())
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();

        return new Token(tokenValue, expiryDate);
    }

    @Data
    @AllArgsConstructor
    public static class Token {
        private String value;
        private Date expiryDate;
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public Date getExpirationDateFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getExpiration();
    }

    @SuppressWarnings("deprecation")
    public boolean isValid(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (MalformedJwtException ex) {
            log.debug("Invalid JWT token - {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            log.debug("Expired JWT token - {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.debug("Unsupported JWT token - {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.debug("JWT claims string is empty - {}", ex.getMessage());
        } catch (SignatureException ex) {
            log.debug("JWT claims string is not valid - {}", ex.getMessage());
        }
        catch (Exception ex) {
            log.error("Error validating JWT token: {}", ex.getMessage());
        }
        return false;
    }
}
