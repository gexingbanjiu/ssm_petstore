package com.example.mypetstore_back_management.service.Impl;

import com.example.mypetstore_back_management.domain.Admin;
import com.example.mypetstore_back_management.persistence.AdminMapper;
import com.example.mypetstore_back_management.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    AdminMapper adminMapper;

    @Override
    public Admin login(Admin admin) {
       return adminMapper.getAdminByidAndPassword(admin);
    }

    @Override
    public void register(Admin admin) {
       adminMapper.insertAdmin(admin);
    }
}
