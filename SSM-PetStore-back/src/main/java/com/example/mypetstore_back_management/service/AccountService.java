package com.example.mypetstore_back_management.service;

import com.example.mypetstore_back_management.domain.Account;

import java.util.List;

public interface AccountService {
    Account getAccount(Account account);

    List<Account> getAllAccount();

    void insertAccount(Account account);

    void deleteAccount(Account account);

    void updateAccount(Account account);

    void updateStatus(String userid,String status);

    void resetPassword(Account account);

    List<Account> searchUser(String userid);

}
