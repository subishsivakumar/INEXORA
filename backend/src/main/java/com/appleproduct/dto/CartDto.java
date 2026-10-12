package com.appleproduct.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartDto {
    private Long id;
    private List<CartItemDto> items = new ArrayList<>();
    private Integer totalQuantity = 0;
    private BigDecimal subtotalInr = BigDecimal.ZERO;
    private BigDecimal taxInr = BigDecimal.ZERO;
    private BigDecimal shippingInr = BigDecimal.ZERO;
    private BigDecimal totalInr = BigDecimal.ZERO;

    public CartDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }

    public Integer getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }

    public BigDecimal getSubtotalInr() { return subtotalInr; }
    public void setSubtotalInr(BigDecimal subtotalInr) { this.subtotalInr = subtotalInr; }

    public BigDecimal getTaxInr() { return taxInr; }
    public void setTaxInr(BigDecimal taxInr) { this.taxInr = taxInr; }

    public BigDecimal getShippingInr() { return shippingInr; }
    public void setShippingInr(BigDecimal shippingInr) { this.shippingInr = shippingInr; }

    public BigDecimal getTotalInr() { return totalInr; }
    public void setTotalInr(BigDecimal totalInr) { this.totalInr = totalInr; }
}
