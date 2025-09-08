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
import java.util.stream.Collectors;

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
    private final Role role;

    public static UserPrincipal create(User user, UserAuthentication userAuth) {
        return create(user, userAuth, Role.USER);
    }

    public static UserPrincipal create(User user, UserAuthentication userAuth, Role role) {
        return builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .password(userAuth.getPasswordHash())
                .enabled(userAuth.isEnabled())
                .role(role)
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAllAuthorities().stream()
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());
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

    public boolean isAdmin() {
        return this.role == Role.ADMIN;
    }
}