package com.example.mypetstore_back_management.controller;

import com.example.mypetstore_back_management.domain.Account;
import com.example.mypetstore_back_management.domain.Admin;
import com.example.mypetstore_back_management.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@SessionAttributes("message")
public class AdminController {
    @Autowired
    AdminService adminService;

    @RequestMapping("/login")
    public String login(Admin admin , Model model, HttpSession session, HttpServletRequest request){
        System.out.println(admin.getTelephone());
        Admin admin1 = adminService.login(admin);
        String message;
        String code = (String) session.getAttribute("checkcode");
        String code1= request.getParameter("checkcode");
        if (admin1 !=null)
            if (code.equals(code1))
                return "/admin/main";
            else {
                message = "验证码错误！";return "/index";
            }

        else {
            message= "账号或者密码错误，请重新输入！";
            model.addAttribute("message",message);
            return "/index";
        }
    }

    @GetMapping("/register")
    public String register(Account account)
    {
        return "";
    }
}
