package com.example.mypetstore_back_management.domain;

import java.math.BigDecimal;
import java.util.Date;

public class Order {
    private String orderid;

    private  String userid;

    private BigDecimal totalprice;

    private Date orderdate;

    private String address;

    private String itemid;

    private int quantity;

    private String shipaddr1;

    private String shipaddr2;

    private String shipcity;

    private String delivery;

    public String getDelivery() {
        return delivery;
    }

    public void setDelivery(String delivery) {
        this.delivery = delivery;
    }

    public String getShipaddr1() {
        return shipaddr1;
    }

    public void setShipaddr1(String shipaddr1) {
        this.shipaddr1 = shipaddr1;
    }

    public String getShipaddr2() {
        return shipaddr2;
    }

    public void setShipaddr2(String shipaddr2) {
        this.shipaddr2 = shipaddr2;
    }

    public String getShipcity() {
        return shipcity;
    }

    public void setShipcity(String shipcity) {
        this.shipcity = shipcity;
    }

    public String getItemid() {
        return itemid;
    }

    public void setItemid(String itemid) {
        this.itemid = itemid;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getOrderid() {
        return orderid;
    }

    public void setOrderid(String orderid) {
        this.orderid = orderid;
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public BigDecimal getTotalprice() {
        return totalprice;
    }

    public void setTotalprice(BigDecimal totalprice) {
        this.totalprice = totalprice;
    }

    public Date getOrderdate() {
        return orderdate;
    }

    public void setOrderdate(Date orderdate) {
        this.orderdate = orderdate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setAddress(){
        address = shipaddr1+" "+shipaddr2+" "+shipcity;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderid='" + orderid + '\'' +
                ", userid='" + userid + '\'' +
                ", totalprice=" + totalprice +
                ", orderdate=" + orderdate +
                ", address='" + address + '\'' +
                ", itemid='" + itemid + '\'' +
                ", quantity=" + quantity +
                ", shipaddr1='" + shipaddr1 + '\'' +
                ", shipaddr2='" + shipaddr2 + '\'' +
                ", shipcity='" + shipcity + '\'' +
                '}';
    }
}
