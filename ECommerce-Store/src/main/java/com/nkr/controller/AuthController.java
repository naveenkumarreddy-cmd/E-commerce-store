package com.nkr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.nkr.dto.LoginRequestDTO;
import com.nkr.dto.LoginResponseDTO;
import com.nkr.entity.User;
import com.nkr.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    

        @PostMapping("/login")
        public LoginResponseDTO login(@RequestBody LoginRequestDTO dto) {

            User user = authService.login(dto.getEmail(), dto.getPassword());

            LoginResponseDTO res = new LoginResponseDTO();
            res.setId(user.getId());
            res.setName(user.getName());
            res.setEmail(user.getEmail());
            res.setRole(user.getRole());
            res.setMessage("Login Success");

            return res;
        }
    }



