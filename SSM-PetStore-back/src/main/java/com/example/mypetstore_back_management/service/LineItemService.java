package com.example.mypetstore_back_management.service;

import com.example.mypetstore_back_management.domain.LineItem;
import com.example.mypetstore_back_management.domain.Order;

import java.util.List;

public interface LineItemService {

    public List<LineItem> getLineItems(Order order);
}
