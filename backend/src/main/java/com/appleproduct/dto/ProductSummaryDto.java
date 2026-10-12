package com.appleproduct.dto;

import java.math.BigDecimal;

public class ProductSummaryDto {
    private Long id;
    private String slug;
    private String name;
    private String categorySlug;
    private String categoryName;
    private String modelAndGeneration;
    private String shortDescription;
    private BigDecimal basePriceInr;
    private String availabilityStatus;
    private Boolean featured;
    private Boolean isNewArrival;
    private Boolean has3dModel;
    private String primaryImageUrl;

    public ProductSummaryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategorySlug() { return categorySlug; }
    public void setCategorySlug(String categorySlug) { this.categorySlug = categorySlug; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getModelAndGeneration() { return modelAndGeneration; }
    public void setModelAndGeneration(String modelAndGeneration) { this.modelAndGeneration = modelAndGeneration; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public BigDecimal getBasePriceInr() { return basePriceInr; }
    public void setBasePriceInr(BigDecimal basePriceInr) { this.basePriceInr = basePriceInr; }

    public String getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(String availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public Boolean getIsNewArrival() { return isNewArrival; }
    public void setIsNewArrival(Boolean isNewArrival) { this.isNewArrival = isNewArrival; }

    public Boolean getHas3dModel() { return has3dModel; }
    public void setHas3dModel(Boolean has3dModel) { this.has3dModel = has3dModel; }

    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }
}
