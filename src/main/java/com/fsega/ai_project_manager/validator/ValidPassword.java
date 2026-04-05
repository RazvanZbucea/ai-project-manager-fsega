package com.fsega.ai_project_manager.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = PasswordConstraintValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {
    String message() default "Parola trebuie să aibă minim 8 caractere, să conțină cel puțin o literă și o cifră.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

