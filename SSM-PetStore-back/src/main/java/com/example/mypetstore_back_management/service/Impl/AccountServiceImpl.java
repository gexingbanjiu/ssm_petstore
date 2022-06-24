package com.example.mypetstore_back_management.service.Impl;

import com.example.mypetstore_back_management.domain.Account;
import com.example.mypetstore_back_management.persistence.AccountMapper;
import com.example.mypetstore_back_management.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    AccountMapper accountMapper;
    @Override
    public Account getAccount(Account account) {
        return accountMapper.getAccountByUsernameAndPassword(account);
    }

    @Override
    public List<Account> getAllAccount() {
        return accountMapper.getAllAccount();
    }

    @Override
    public void insertAccount(Account account) {
        accountMapper.insertAccount(account);
        accountMapper.insertSignOn(account);
    }

    @Override
    public void deleteAccount(Account account) {
       accountMapper.deleteAccount(account);
       accountMapper.deleteSignOn(account);
    }

    @Override
    public void updateAccount(Account account) {
       accountMapper.updateAccount(account);
    }

    @Override
    public void updateStatus(String userid, String status) {
        accountMapper.updateStatus(userid,status);
    }

    @Override
    public void resetPassword(Account account) {
        accountMapper.reSetPassword(account);
    }

    @Override
    public List<Account> searchUser(String userid) {
        List<Account> list = accountMapper.searchAccount(userid);
        String password;
        for (int i=0;i<list.size();i++)
        {
            password = accountMapper.searchPassword(list.get(i).getUserid());
            list.get(i).setPassword(password);
        }
        return list;
    }
}
