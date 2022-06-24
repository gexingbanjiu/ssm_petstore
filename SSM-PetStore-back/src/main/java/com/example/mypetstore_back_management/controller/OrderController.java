package com.example.mypetstore_back_management.controller;

import com.example.mypetstore_back_management.domain.LineItem;
import com.example.mypetstore_back_management.domain.Order;
import com.example.mypetstore_back_management.service.LineItemService;
import com.example.mypetstore_back_management.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/order")
@ResponseBody
public class OrderController {

    @Autowired
    OrderService orderService;

    @Autowired
    LineItemService lineItemService;

    @GetMapping("/showAllOrder")
    public List<Order> showAllOrder()
    {
        List<Order> orders = orderService.getAllOrder();
        for(int i=0 ; i<orders.size();i++) {
            System.out.println(orders.get(i).toString());
            if (orders.get(i).getDelivery().equals("1"))
                orders.get(i).setDelivery("是");
            else
                orders.get(i).setDelivery("否");
        }
        return orders;
    }

    @GetMapping("/deleteOrder")
    public void deleteorder(String orderid)
    {
        Order order = new Order();
        order.setOrderid(orderid);
        orderService.deleteOrder(order);
    }

    @GetMapping("/updateOrder")
    public void updateOrder(String address)
    {
        System.out.println(address);
        String []order = address.split(",");
        Order order1 = new Order();
        order1.setOrderid(order[0]);
        order1.setShipaddr1(order[1]);
        order1.setShipaddr2(order[2]);
        order1.setShipcity(order[3]);
        orderService.updateOrder(order1);
    }

    @GetMapping("/showOrderItem")
    public List<LineItem> showOrderItem(String orderid)
    {
        Order order = new Order();
        order.setOrderid(orderid);
        return lineItemService.getLineItems(order);
    }
    @GetMapping("/updateDelivery")
    public void updateDelivery(String orderid)
    {
        orderService.updateDelivery(orderid);
    }
    @GetMapping("/searchOrderid")
    public List<Order> searchOrderId(String orderid)
    {
        Order order = new Order();
        order.setOrderid(orderid);
        Order order1 = orderService.searchOrderByOrderid(order);
        if (order1.getDelivery().equals("1"))
            order1.setDelivery("是");
        else order1.setDelivery("否");
        List<Order> list = new ArrayList<>();
        list.add(order1);
        return list;
    }
}
