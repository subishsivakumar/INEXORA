package com.appleproduct.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Column(name = "product_name", nullable = false, length = 200)
    private String productName;

    @Column(name = "variant_sku", nullable = false, length = 100)
    private String variantSku;

    @Column(name = "colour_name", nullable = false, length = 100)
    private String colourName;

    @Column(length = 50)
    private String storage;

    @Column(name = "unit_price_inr", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPriceInr;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "total_price_inr", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPriceInr;

    public OrderItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public ProductVariant getVariant() { return variant; }
    public void setVariant(ProductVariant variant) { this.variant = variant; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getVariantSku() { return variantSku; }
    public void setVariantSku(String variantSku) { this.variantSku = variantSku; }

    public String getColourName() { return colourName; }
    public void setColourName(String colourName) { this.colourName = colourName; }

    public String getStorage() { return storage; }
    public void setStorage(String storage) { this.storage = storage; }

    public BigDecimal getUnitPriceInr() { return unitPriceInr; }
    public void setUnitPriceInr(BigDecimal unitPriceInr) { this.unitPriceInr = unitPriceInr; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getTotalPriceInr() { return totalPriceInr; }
    public void setTotalPriceInr(BigDecimal totalPriceInr) { this.totalPriceInr = totalPriceInr; }
}
