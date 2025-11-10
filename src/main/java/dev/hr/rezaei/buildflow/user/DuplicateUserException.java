package dev.hr.rezaei.buildflow.user;

public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String message) {
        super(message);
    }
    public DuplicateUserException(String message, Throwable cause) {
        super(message, cause);
    }
    public DuplicateUserException(Throwable cause) {
        super(cause);
    }
}
