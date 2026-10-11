package com.appleproduct.dto;

import java.math.BigDecimal;

public class WishlistItemDto {
    private Long id;
    private Long productId;
    private String productSlug;
    private String productName;
    private BigDecimal basePriceInr;
    private String imageUrl;
    private String availabilityStatus;

    public WishlistItemDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductSlug() { return productSlug; }
    public void setProductSlug(String productSlug) { this.productSlug = productSlug; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getBasePriceInr() { return basePriceInr; }
    public void setBasePriceInr(BigDecimal basePriceInr) { this.basePriceInr = basePriceInr; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(String availabilityStatus) { this.availabilityStatus = availabilityStatus; }
}
