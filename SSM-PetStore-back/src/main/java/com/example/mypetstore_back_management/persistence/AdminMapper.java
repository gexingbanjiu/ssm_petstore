package com.example.mypetstore_back_management.persistence;

import com.example.mypetstore_back_management.domain.Admin;
import org.springframework.stereotype.Repository;

@Repository
public interface  AdminMapper {

    Admin getAdminByidAndPassword(Admin admin);

    void insertAdmin(Admin admin);
}
