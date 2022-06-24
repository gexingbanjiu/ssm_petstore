package com.example.mypetstore_back_management.persistence;

import com.example.mypetstore_back_management.domain.Account;
import com.example.mypetstore_back_management.domain.Order;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.function.LongUnaryOperator;
@Repository
public interface OrderMapper {
    List<Order> getAllOrder();

     void insertOrder(@Param("account")Account account ,@Param("order") Order order);

     void deleteLineItem(@Param("order")Order order);

     void deleteOrder(@Param("order") Order order);


     void  updateOrder(@Param("order") Order order);

     Order getOrderByOrderId(Order order);

     List<Order> getOrderByUserId(String userid);

     void updatedelivery(@Param("orderid") String orderid);
}
