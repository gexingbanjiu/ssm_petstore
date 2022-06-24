package com.example.mypetstore_back_management.service.Impl;

import com.example.mypetstore_back_management.domain.Account;
import com.example.mypetstore_back_management.domain.Order;
import com.example.mypetstore_back_management.persistence.OrderMapper;
import com.example.mypetstore_back_management.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    OrderMapper orderMapper;

    @Override
    public List<Order> getAllOrder() {
        List<Order> orders = orderMapper.getAllOrder();
        String address;
        for(int i=0;i<orders.size();i++)
        {
            orders.get(i).setAddress();
        }
        return orders;
    }

    @Override
    public void addOrder(Account account, Order order) {
        orderMapper.insertOrder(account,order);
    }

    @Override
    public void deleteOrder(Order order) {
       orderMapper.deleteOrder(order);
       orderMapper.deleteLineItem(order);
    }


    @Override
    public void updateOrder(Order order) {
        orderMapper.updateOrder(order);
    }

    @Override
    public Order searchOrderByOrderid(Order order) {
        return orderMapper.getOrderByOrderId(order);
    }

    @Override
    public List<Order> searchOrderByUserId(String userid) {
        return orderMapper.getOrderByUserId(userid);
    }

    @Override
    public void updateDelivery(String orderid) {
        orderMapper.updatedelivery(orderid);
    }
}
