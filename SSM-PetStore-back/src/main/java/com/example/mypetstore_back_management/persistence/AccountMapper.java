package com.example.mypetstore_back_management.persistence;

import com.example.mypetstore_back_management.domain.Account;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.lang.reflect.AnnotatedArrayType;
import java.util.List;

@Repository
public interface AccountMapper {

    Account getAccountByUsernameAndPassword(Account account);

    void insertAccount(Account account);

    void insertSignOn(Account account);

    void deleteAccount(Account account);

    void deleteSignOn(Account account);

    void updateAccount(Account account);//修改按钮，暂时不用，先确定业务逻辑再实现

    void updateStatus(@Param("userid") String userid, @Param("status") String status);

    void reSetPassword(Account account);

    List<Account> getAllAccount();

    List<Account> searchAccount(String userid);

    //模糊查询时，查询password
    String searchPassword(String userid);

}
