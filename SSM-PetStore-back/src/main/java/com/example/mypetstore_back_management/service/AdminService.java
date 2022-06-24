package com.example.mypetstore_back_management.service;

import com.example.mypetstore_back_management.domain.Admin;

public interface AdminService {

    Admin login(Admin admin);

    void register(Admin admin);

}
