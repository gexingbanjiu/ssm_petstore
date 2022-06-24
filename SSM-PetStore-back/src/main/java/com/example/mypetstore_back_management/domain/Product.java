package com.example.mypetstore_back_management.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
public class Product implements Serializable {

    private static final long serialVersionUID = -7492639752670189553L;
    private String productId;
    private String categoryId;
    private String name;
    private String description;
}
