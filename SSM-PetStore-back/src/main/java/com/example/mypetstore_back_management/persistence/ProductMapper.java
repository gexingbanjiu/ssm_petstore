package com.example.mypetstore_back_management.persistence;

import com.example.mypetstore_back_management.domain.Product;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductMapper {

    List<Product> getProductListByCategory(String categoryId);

    Product getProduct(String productId);

    List<Product> searchProductList(String keywords);

    void insertProduct(Product product);

    void updateProduct(Product product);

    void deleteProduct(String productId);

    String getProductImage(String productId);
}
