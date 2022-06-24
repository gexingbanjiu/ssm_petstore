package com.example.mypetstore_back_management.controller;

import com.example.mypetstore_back_management.domain.Account;
import com.example.mypetstore_back_management.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import java.util.List;

@Controller
@RequestMapping("/account")
@ResponseBody
public class AccountController{

    @Autowired
    AccountService accountService;

    @GetMapping("/findAllUserInfo")
    public List<Account> findAllUserInfo(){
        return accountService.getAllAccount();
    }


    @GetMapping("/addUser")
    public void addUser(Account account)
    {
        accountService.insertAccount(account);
    }

    @GetMapping("/deleteUser")
    public void deleteUser(Account account)
    {
        accountService.deleteAccount(account);
    }

    @GetMapping("/deleteInBatches")
    public void deleteInBatches(String userIds)
    {
        System.out.println(userIds);
        String [] orders = userIds.split("/");
        Account account = new Account();
        System.out.println(orders.length);
        for (int i=0;i<orders.length;i++)
        {
            account.setUserid(orders[i]);
            accountService.deleteAccount(account);
        }
    }
    @GetMapping("/update")
    public void updateUser(Account account)
    {
        accountService.updateAccount(account);
    }
    @GetMapping("/updateStatus")
    public void updateStatus(String userid,String status)
    {
        if(status.equals("正常"))
            status="1";
        else status="0";
       accountService.updateStatus(userid,status);
    }
    @GetMapping("/resetPassword")
    public void resetPassword(Account account)
    {
        accountService.resetPassword(account);
    }
    @GetMapping("/search")
    public List<Account> searchAccount(String userId)
    {
         userId = "%"+userId+"%";
         return accountService.searchUser(userId);
    }



}
