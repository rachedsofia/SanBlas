package com.sanblas.infrastructure.web.controller;

import com.sanblas.application.dto.request.LoginRequest;
import com.sanblas.application.dto.response.AuthResponse;
import com.sanblas.application.usecase.AuthUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthUseCase authUseCase;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authUseCase.login(req));
    }
}
