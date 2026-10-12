package com.appleproduct.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ProductDetailDto {
    private Long id;
    private String slug;
    private String name;
    private Long categoryId;
    private String categorySlug;
    private String categoryName;
    private String modelAndGeneration;
    private String shortDescription;
    private String fullDescription;
    private BigDecimal basePriceInr;
    private String availabilityStatus;
    private Boolean featured;
    private Boolean isNewArrival;
    private Boolean has3dModel;
    private String model3dPath;
    private LocalDate priceVerificationDate;
    private String sourceUrl;
    private List<VariantDto> variants = new ArrayList<>();
    private List<ProductImageDto> images = new ArrayList<>();
    private SpecificationDto specification;
    private List<ProductSummaryDto> relatedProducts = new ArrayList<>();

    public ProductDetailDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategorySlug() { return categorySlug; }
    public void setCategorySlug(String categorySlug) { this.categorySlug = categorySlug; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getModelAndGeneration() { return modelAndGeneration; }
    public void setModelAndGeneration(String modelAndGeneration) { this.modelAndGeneration = modelAndGeneration; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getFullDescription() { return fullDescription; }
    public void setFullDescription(String fullDescription) { this.fullDescription = fullDescription; }

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

    public String getModel3dPath() { return model3dPath; }
    public void setModel3dPath(String model3dPath) { this.model3dPath = model3dPath; }

    public LocalDate getPriceVerificationDate() { return priceVerificationDate; }
    public void setPriceVerificationDate(LocalDate priceVerificationDate) { this.priceVerificationDate = priceVerificationDate; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public List<VariantDto> getVariants() { return variants; }
    public void setVariants(List<VariantDto> variants) { this.variants = variants; }

    public List<ProductImageDto> getImages() { return images; }
    public void setImages(List<ProductImageDto> images) { this.images = images; }

    public SpecificationDto getSpecification() { return specification; }
    public void setSpecification(SpecificationDto specification) { this.specification = specification; }

    public List<ProductSummaryDto> getRelatedProducts() { return relatedProducts; }
    public void setRelatedProducts(List<ProductSummaryDto> relatedProducts) { this.relatedProducts = relatedProducts; }
}
