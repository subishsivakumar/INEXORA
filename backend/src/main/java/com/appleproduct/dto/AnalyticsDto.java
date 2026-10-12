package com.appleproduct.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class AnalyticsDto {
    private Long totalOrders = 0L;
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private Long totalProducts = 0L;
    private Long totalCustomers = 0L;
    private List<OrderDto> recentOrders = new ArrayList<>();

    public AnalyticsDto() {}

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }

    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }

    public List<OrderDto> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderDto> recentOrders) { this.recentOrders = recentOrders; }
}
