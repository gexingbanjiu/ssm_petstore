package com.example.mypetstore_back_management.service.Impl;

import com.example.mypetstore_back_management.domain.LineItem;
import com.example.mypetstore_back_management.domain.Order;
import com.example.mypetstore_back_management.persistence.LineItemMapper;
import com.example.mypetstore_back_management.service.LineItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LineItemServiceImpl implements LineItemService {

    @Autowired
    LineItemMapper lineItemMapper;
    @Override
    public List<LineItem> getLineItems(Order order) {
        return lineItemMapper.getLineItem(order);
    }
}
