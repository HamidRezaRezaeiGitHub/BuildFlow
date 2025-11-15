package dev.hr.rezaei.buildflow.user;

import lombok.Getter;

@Getter
public class DuplicateUserException extends RuntimeException {

    private final String duplicateField;
    private final String duplicateValue;

    public DuplicateUserException(String duplicateField, String duplicateValue) {
        super("Account with " + duplicateField + " '" + duplicateValue + "' already exists!");
        this.duplicateField = duplicateField;
        this.duplicateValue = duplicateValue;
    }
}
