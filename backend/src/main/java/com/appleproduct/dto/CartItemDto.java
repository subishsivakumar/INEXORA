package com.appleproduct.dto;

import java.math.BigDecimal;

public class CartItemDto {
    private Long id;
    private Long productId;
    private String productSlug;
    private String productName;
    private Long variantId;
    private String variantSku;
    private String colourName;
    private String colourHex;
    private String storage;
    private BigDecimal unitPriceInr;
    private Integer quantity;
    private BigDecimal totalPriceInr;
    private String imageUrl;

    public CartItemDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductSlug() { return productSlug; }
    public void setProductSlug(String productSlug) { this.productSlug = productSlug; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }

    public String getVariantSku() { return variantSku; }
    public void setVariantSku(String variantSku) { this.variantSku = variantSku; }

    public String getColourName() { return colourName; }
    public void setColourName(String colourName) { this.colourName = colourName; }

    public String getColourHex() { return colourHex; }
    public void setColourHex(String colourHex) { this.colourHex = colourHex; }

    public String getStorage() { return storage; }
    public void setStorage(String storage) { this.storage = storage; }

    public BigDecimal getUnitPriceInr() { return unitPriceInr; }
    public void setUnitPriceInr(BigDecimal unitPriceInr) { this.unitPriceInr = unitPriceInr; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getTotalPriceInr() { return totalPriceInr; }
    public void setTotalPriceInr(BigDecimal totalPriceInr) { this.totalPriceInr = totalPriceInr; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
