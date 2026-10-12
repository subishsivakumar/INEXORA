package com.appleproduct.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderDto {
    private Long id;
    private String orderNumber;
    private String status;
    private BigDecimal subtotalInr;
    private BigDecimal taxInr;
    private BigDecimal shippingInr;
    private BigDecimal totalInr;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingPostalCode;
    private List<OrderItemDto> items = new ArrayList<>();
    private LocalDateTime createdAt;

    public OrderDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getSubtotalInr() { return subtotalInr; }
    public void setSubtotalInr(BigDecimal subtotalInr) { this.subtotalInr = subtotalInr; }

    public BigDecimal getTaxInr() { return taxInr; }
    public void setTaxInr(BigDecimal taxInr) { this.taxInr = taxInr; }

    public BigDecimal getShippingInr() { return shippingInr; }
    public void setShippingInr(BigDecimal shippingInr) { this.shippingInr = shippingInr; }

    public BigDecimal getTotalInr() { return totalInr; }
    public void setTotalInr(BigDecimal totalInr) { this.totalInr = totalInr; }

    public String getShippingName() { return shippingName; }
    public void setShippingName(String shippingName) { this.shippingName = shippingName; }

    public String getShippingPhone() { return shippingPhone; }
    public void setShippingPhone(String shippingPhone) { this.shippingPhone = shippingPhone; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getShippingCity() { return shippingCity; }
    public void setShippingCity(String shippingCity) { this.shippingCity = shippingCity; }

    public String getShippingState() { return shippingState; }
    public void setShippingState(String shippingState) { this.shippingState = shippingState; }

    public String getShippingPostalCode() { return shippingPostalCode; }
    public void setShippingPostalCode(String shippingPostalCode) { this.shippingPostalCode = shippingPostalCode; }

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
