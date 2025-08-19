package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Custom UserDetails implementation that wraps our User entity
 * for Spring Security authentication without polluting the domain model.
 */
@Getter
@AllArgsConstructor
@SuperBuilder
public class UserPrincipal implements UserDetails {

    private final String username;
    private final String email;
    private final String password;
    private final boolean enabled;

    public static UserPrincipal create(User user, String encodedPassword) {
        return builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .password(encodedPassword)
                .enabled(user.isRegistered())
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // For now, all users have USER role. You can extend this later for authorization
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}