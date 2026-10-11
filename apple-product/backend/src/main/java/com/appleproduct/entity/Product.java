package com.appleproduct.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String slug;

    @Column(nullable = false, length = 200)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "model_and_generation", length = 150)
    private String modelAndGeneration;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "full_description", columnDefinition = "TEXT")
    private String fullDescription;

    @Column(name = "base_price_inr", nullable = false, precision = 12, scale = 2)
    private BigDecimal basePriceInr;

    @Column(name = "availability_status", nullable = false, length = 50)
    private String availabilityStatus = "IN_STOCK";

    @Column(nullable = false)
    private Boolean featured = false;

    @Column(name = "is_new_arrival", nullable = false)
    private Boolean isNewArrival = false;

    @Column(name = "has_3d_model", nullable = false)
    private Boolean has3dModel = false;

    @Column(name = "model_3d_path")
    private String model3dPath;

    @Column(name = "price_verification_date")
    private LocalDate priceVerificationDate;

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductVariant> variants = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductImage> images = new ArrayList<>();

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private ProductSpecification specification;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Product() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

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

    public List<ProductVariant> getVariants() { return variants; }
    public void setVariants(List<ProductVariant> variants) { this.variants = variants; }

    public List<ProductImage> getImages() { return images; }
    public void setImages(List<ProductImage> images) { this.images = images; }

    public ProductSpecification getSpecification() { return specification; }
    public void setSpecification(ProductSpecification specification) { this.specification = specification; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
