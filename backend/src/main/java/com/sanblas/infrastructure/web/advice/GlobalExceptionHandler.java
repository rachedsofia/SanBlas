package com.sanblas.infrastructure.web.advice;

import com.sanblas.domain.exception.*;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    record ApiError(int status, String error, String message, LocalDateTime timestamp) {}
    record ValidationError(int status, String error, Map<String, String> fields, LocalDateTime timestamp) {}

    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<ApiError> notFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(new ApiError(404, "NOT_FOUND", ex.getMessage(), LocalDateTime.now()));
    }

    @ExceptionHandler(BusinessException.class)
    ResponseEntity<ApiError> business(BusinessException ex) {
        return ResponseEntity.status(422).body(new ApiError(422, "BUSINESS_ERROR", ex.getMessage(), LocalDateTime.now()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<ApiError> forbidden(AccessDeniedException ex) {
        return ResponseEntity.status(403).body(new ApiError(403, "FORBIDDEN", "No tenés permiso para esta acción", LocalDateTime.now()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ValidationError> validation(MethodArgumentNotValidException ex) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getBindingResult().getAllErrors().forEach(e -> {
            String field = e instanceof FieldError f ? f.getField() : e.getObjectName();
            fields.put(field, e.getDefaultMessage());
        });
        return ResponseEntity.status(400).body(new ValidationError(400, "VALIDATION_ERROR", fields, LocalDateTime.now()));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiError> generic(Exception ex) {
        return ResponseEntity.status(500).body(new ApiError(500, "INTERNAL_ERROR", "Error interno del servidor", LocalDateTime.now()));
    }
}
