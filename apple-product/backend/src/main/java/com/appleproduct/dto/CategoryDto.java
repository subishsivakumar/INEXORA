package com.appleproduct.dto;

public class CategoryDto {
    private Long id;
    private String slug;
    private String name;
    private String description;
    private Integer displayOrder;
    private String imageUrl;

    public CategoryDto() {}

    public CategoryDto(Long id, String slug, String name, String description, Integer displayOrder, String imageUrl) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.description = description;
        this.displayOrder = displayOrder;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
