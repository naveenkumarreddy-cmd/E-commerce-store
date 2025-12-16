package com.kodnest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeController {
	
	@RequestMapping("/")
	public String register() {
		
		return "register";
	}
	
	@RequestMapping("/success")
    public String success(@RequestParam("name") String name,
    		              @RequestParam("email") String email,
    		              @RequestParam ("dept") String dept,
    		              @RequestParam("address") String address,
    		              @RequestParam("salary")   String salary,Model model){
		
		
		model.addAttribute("myname",name);
		model.addAttribute("myemail",email );
		model.addAttribute("mydept",dept );
		model.addAttribute("myaddress",address );
		model.addAttribute("mysalary",salary);
		
		
		return "success";
	}
	
	

}
