package com.example.mypetstore_back_management;

import com.example.mypetstore_back_management.domain.Account;
import com.example.mypetstore_back_management.domain.LineItem;
import com.example.mypetstore_back_management.domain.Order;
import com.example.mypetstore_back_management.service.AccountService;
import com.example.mypetstore_back_management.service.LineItemService;
import com.example.mypetstore_back_management.service.OrderService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
@MapperScan("com.example.mypetstore_back_management.persistence")
class MyPetStoreBackManagementApplicationTests {

    @Autowired
    AccountService accountService;
    @Autowired
    OrderService orderService;

    @Autowired
    LineItemService lineItemService;
    @Test
    void contextLoads() {
        Account account = new Account();
        List<Account> list = accountService.getAllAccount();
        System.out.println(list.get(0).getTelephone());
//        account.setUserid("xy");
//        account.setPassword("xy");
//        account.setTelephone("1");
//        account.setAddress("湖北安陆");
//        account.setEmail("1254895072@qq.com");
//        accountService.updateAccount(account);
//       List<Order> list = orderService.getAllOrder();
//       for (int i=0;i<list.size();i++)
//        System.out.println(list.get(i).getOrderdate());
//       orderService.deleteOrder(account,list.get(0));
       List<Account> list1 = accountService.searchUser("%j%");
        System.out.println(list1.get(0).getUserid());
    }

}
