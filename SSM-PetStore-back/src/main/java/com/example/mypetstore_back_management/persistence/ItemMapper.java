package com.example.mypetstore_back_management.persistence;

import com.example.mypetstore_back_management.domain.Item;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ItemMapper {

    List<Item> getItemListByProduct(String productId);

    Item getItem(String itemId);

    int getInventoryQuantity(String itemId);

    void insertItem(Item item);

    void insertItemQTY(Item item);

    void updateItem(@Param("item") Item item);

    void updateInventoryQuantity(@Param("itemId") String itemId, @Param("newQTY") Integer newQTY);

    void deleteItem(String itemId);

    void deleteItemQTY(String itemId);
}
