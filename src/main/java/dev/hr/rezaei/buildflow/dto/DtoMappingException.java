package dev.hr.rezaei.buildflow.dto;

public class DtoMappingException extends RuntimeException {
    public DtoMappingException(String message) {
        super(message);
    }
    public DtoMappingException(String message, Throwable cause) {
        super(message, cause);
    }
    public DtoMappingException(Throwable cause) {
        super(cause);
    }
}
