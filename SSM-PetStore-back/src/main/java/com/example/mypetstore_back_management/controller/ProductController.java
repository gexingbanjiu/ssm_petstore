package com.example.mypetstore_back_management.controller;

import com.example.mypetstore_back_management.domain.Item;
import com.example.mypetstore_back_management.domain.Product;
import com.example.mypetstore_back_management.domain.ProductVO;
import com.example.mypetstore_back_management.service.ProductItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Controller
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductItemService productItemService;


    //用于查表
    @ResponseBody
    @GetMapping("/findAllProductInfo")
    public List<ProductVO> findAllProductInfo(@RequestParam("categoryId")String categoryId){
        System.out.println("进入了找信息函数");
        System.out.println(categoryId);
        return productItemService.getItemsByCategoryId(categoryId);
    }

    //增加一个商品item
    @ResponseBody
    @GetMapping("/insertProductInfo")
    public String insertOneProductItem(Item item) {
        System.out.println("接收到异步请求,增加一个商品");
        System.out.println(item.getItemId());
        System.out.println(item.getListPrice());
        System.out.println(item.getQuantity());
        productItemService.insertOneItem(item);
        return "insert successfully";
    }

    //编辑一个商品item,传入的参数是列表某一行的对象ProductVO
    @ResponseBody
    @GetMapping("/updateProductInfo")
    public String updateOneProductItem(ProductVO productVO) {
        System.out.println("接收到异步请求,编辑一个商品");
        productItemService.updateOneItem(productVO);
        return "update successfully";
    }

    //用于删除数据,传入的参数是列表某一行的对象ProductVO
    @GetMapping("/deleteProductInfo")
    @ResponseBody
    public String deleteOneProductItem(ProductVO productVO){//此处对象必须和定义类以及表头属性的保持一致
        System.out.println("接收到异步请求,删除选中行");
        productItemService.deleteOneItem(productVO.getItemId());
        return "delete successfully";
    }

    //得到一个具体的item
    @GetMapping("/getItemImage")
    @ResponseBody
    public String getItemImage(@RequestParam("itemId") String itemId) {
        Item item = productItemService.getOneItem(itemId);
        return productItemService.getOneProductImage(item.getProductId());
    }

    @GetMapping("/changeStatus")
    @ResponseBody
    public String changeStatus(@RequestParam("itemId") String itemId, @RequestParam("status") String status) {
        Item item = productItemService.getOneItem(itemId);
        item.setStatus(status);
        productItemService.updateItemStatus(item);
        return "change successfully";
    }

}
