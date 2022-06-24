package com.example.mypetstore_back_management.persistence;

import com.example.mypetstore_back_management.domain.LineItem;
import com.example.mypetstore_back_management.domain.Order;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface LineItemMapper {

    List<LineItem> getLineItem(Order order);
}
