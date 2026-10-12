package com.appleproduct.dto;

public class ProductImageDto {
    private Long id;
    private Long variantId;
    private String imageUrl;
    private String altText;
    private Boolean isPrimary;
    private Integer displayOrder;

    public ProductImageDto() {}

    public ProductImageDto(Long id, Long variantId, String imageUrl, String altText, Boolean isPrimary, Integer displayOrder) {
        this.id = id;
        this.variantId = variantId;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.isPrimary = isPrimary;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
