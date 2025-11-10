package dev.hr.rezaei.buildflow.project;

public class ParticipantNotFoundException extends RuntimeException {
    public ParticipantNotFoundException(String message) {
        super(message);
    }

    public ParticipantNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public ParticipantNotFoundException(Throwable cause) {
        super(cause);
    }
}
