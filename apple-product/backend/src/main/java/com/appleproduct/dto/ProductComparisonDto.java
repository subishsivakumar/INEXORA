package com.appleproduct.dto;

import java.util.ArrayList;
import java.util.List;

public class ProductComparisonDto {
    private List<ProductDetailDto> products = new ArrayList<>();

    public ProductComparisonDto() {}

    public ProductComparisonDto(List<ProductDetailDto> products) {
        this.products = products;
    }

    public List<ProductDetailDto> getProducts() { return products; }
    public void setProducts(List<ProductDetailDto> products) { this.products = products; }
}
