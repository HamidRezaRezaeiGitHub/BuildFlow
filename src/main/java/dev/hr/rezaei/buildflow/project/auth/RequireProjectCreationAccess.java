package dev.hr.rezaei.buildflow.project.auth;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)  // Can only be applied to methods
@Retention(RetentionPolicy.RUNTIME)  // Available at runtime for reflection
public @interface RequireProjectCreationAccess {
    // Empty annotation - acts as a marker
}
