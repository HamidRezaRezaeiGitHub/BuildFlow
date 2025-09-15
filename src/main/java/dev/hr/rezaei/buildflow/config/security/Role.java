package dev.hr.rezaei.buildflow.config.security;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum Role {
    VIEWER(Set.of()),
    USER(getUserAuthorities()),
    PREMIUM_USER(getPremiumUserAuthorities()),
    ADMIN(getAdminAuthorities())
    ;

    private final Set<String> authorities;

    Role(Set<String> authorities) {
        this.authorities = authorities;
    }

    public static Set<String> getUserAuthorities() {
        return Set.of(
                "CREATE_PROJECT",
                "VIEW_PROJECT",
                "UPDATE_PROJECT",
                "DELETE_PROJECT"
        );
    }

    public static Set<String> getPremiumOnlyAuthorities() {
        return Set.of(
        );
    }

    public static Set<String> getPremiumUserAuthorities() {
        return Stream.concat(
                getUserAuthorities().stream(),
                getPremiumOnlyAuthorities().stream()
        ).collect(Collectors.toSet());
    }

    public static Set<String> getAdminOnlyAuthorities() {
        return Set.of(
                "CREATE_ADMIN",
                "ADMIN_USERS"
        );
    }

    public static Set<String> getAdminAuthorities() {
        return Stream.concat(
                getPremiumUserAuthorities().stream(),
                getAdminOnlyAuthorities().stream()
        ).collect(Collectors.toSet());
    }

    public Set<String> getAllAuthorities() {
        return authorities;
    }
}
