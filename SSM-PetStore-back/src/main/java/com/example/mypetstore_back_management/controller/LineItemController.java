package com.example.mypetstore_back_management.controller;

import com.example.mypetstore_back_management.domain.LineItem;
import com.example.mypetstore_back_management.domain.Order;
import com.example.mypetstore_back_management.service.LineItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.math.BigDecimal;
import java.util.List;

@Controller
@ResponseBody
public class LineItemController {

    @Autowired
    LineItemService lineItemService;
   @GetMapping("/showLineItems")
    public List<LineItem> showLineItems(String orderid)
   {
       System.out.println(orderid);
       Order order = new Order();
       order.setOrderid(orderid);
       List<LineItem> lineItems = lineItemService.getLineItems(order);
               for(int i=0;i<lineItems.size();i++)
               {
                   BigDecimal quantity = new BigDecimal(lineItems.get(i).getQuantity());
                   quantity = lineItems.get(i).getUnitprice().multiply(quantity);
                   System.out.println(quantity);
                   lineItems.get(i).setTotalprice(quantity);
               }
       return lineItems;
   }
}
