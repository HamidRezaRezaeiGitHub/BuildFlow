package dev.hr.rezaei.buildflow.base;

public class EstimateNotFoundException extends RuntimeException {
    public EstimateNotFoundException(String message) {
        super(message);
    }

    public EstimateNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public EstimateNotFoundException(Throwable cause) {
        super(cause);
    }
}
