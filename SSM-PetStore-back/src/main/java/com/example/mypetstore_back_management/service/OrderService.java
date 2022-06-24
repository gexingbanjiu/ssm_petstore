package com.example.mypetstore_back_management.service;

import com.example.mypetstore_back_management.domain.Account;
import com.example.mypetstore_back_management.domain.Order;

import java.util.List;

public interface OrderService {

    List<Order> getAllOrder();

    void addOrder(Account account , Order order);

    void deleteOrder(Order order);

    void updateOrder(Order order);

    Order searchOrderByOrderid(Order order);

    List<Order> searchOrderByUserId(String userid);

    void updateDelivery(String orderid);
}
