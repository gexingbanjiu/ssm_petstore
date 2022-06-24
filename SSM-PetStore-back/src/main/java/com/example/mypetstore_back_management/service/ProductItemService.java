package com.example.mypetstore_back_management.service;

import com.example.mypetstore_back_management.domain.Item;
import com.example.mypetstore_back_management.domain.Product;
import com.example.mypetstore_back_management.domain.ProductVO;

import java.util.List;

public interface ProductItemService {

    List<ProductVO> getItemsByCategoryId(String categoryId);

    void insertOneItem(Item item);

    Item getOneItem(String itemId);

    void updateOneItem(ProductVO productVO);

    void updateItemStatus(Item item);

    void deleteOneItem(String itemId);

    Product getOneProduct(String productId);

    String getOneProductImage(String productId);
}
