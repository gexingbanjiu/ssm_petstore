package com.example.mypetstore_back_management;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.mypetstore_back_management.persistence")
public class MyPetStoreBackManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyPetStoreBackManagementApplication.class, args);
    }

}
