package com.nkr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.nkr.dto.LoginRequestDTO;
import com.nkr.dto.LoginResponseDTO;
import com.nkr.entity.User;
import com.nkr.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin // allows frontend calls
public class UserController {

    @Autowired
    private UserService userService;

    // Register user
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

//    // Login user
//    @PostMapping("/login")
//    public User login(@RequestParam String email,
//                      @RequestParam String password) {
//        return userService.login(email, password);
//    

    
   
   

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO dto) {

        User user = userService.login(dto.getEmail(), dto.getPassword());

        LoginResponseDTO res = new LoginResponseDTO();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setRole(user.getRole());
        res.setMessage("Login Success");

        return res;
    }

}
