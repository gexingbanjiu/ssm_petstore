package com.example.mypetstore_back_management.service.impl;

import com.example.mypetstore_back_management.domain.Item;
import com.example.mypetstore_back_management.domain.Product;
import com.example.mypetstore_back_management.domain.ProductVO;
import com.example.mypetstore_back_management.persistence.ItemMapper;
import com.example.mypetstore_back_management.persistence.ProductMapper;
import com.example.mypetstore_back_management.service.ProductItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductItemServiceImpl implements ProductItemService {

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private ItemMapper itemMapper;

    @Override
    public List<ProductVO> getItemsByCategoryId(String categoryId) {
        List<Product> products = productMapper.getProductListByCategory(categoryId);
        List<Item> items=new ArrayList<>();

        for (Product product:products) {
            items.addAll(itemMapper.getItemListByProduct(product.getProductId()));
        }

        List<ProductVO> resultList = new ArrayList<>();
        for (Item item:items) {
            ProductVO productVO=new ProductVO();
            productVO.setCategoryId(item.getProduct().getCategoryId());
            productVO.setProductId(item.getProduct().getProductId());
            productVO.setProductName(item.getProduct().getName());
            productVO.setItemId(item.getItemId());
            productVO.setPrice(item.getListPrice());
            productVO.setStock(item.getQuantity());
            productVO.setStatus(item.getStatus());
            System.out.println(productVO.getStock()+"## "+item.getQuantity());
            resultList.add(productVO);
        }
        return resultList;
    }

    @Override
    public void insertOneItem(Item item) {
        itemMapper.insertItem(item);
        itemMapper.insertItemQTY(item);
    }

    @Override
    public Item getOneItem(String itemId) {
        return itemMapper.getItem(itemId);

    }

    @Override
    public void updateOneItem(ProductVO productVO) {
        Item item = itemMapper.getItem(productVO.getItemId());
        item.setListPrice(productVO.getPrice());
        itemMapper.updateItem(item);
        itemMapper.updateInventoryQuantity(productVO.getItemId(), productVO.getStock());
    }

    @Override
    public void deleteOneItem(String itemId) {
        itemMapper.deleteItem(itemId);
        itemMapper.deleteItemQTY(itemId);
    }

    @Override
    public Product getOneProduct(String productId) {
        return productMapper.getProduct(productId);
    }

    @Override
    public String getOneProductImage(String productId) {
        return productMapper.getProductImage(productId);
    }

    @Override
    public void updateItemStatus(Item item) {
        itemMapper.updateItem(item);
    }

}
