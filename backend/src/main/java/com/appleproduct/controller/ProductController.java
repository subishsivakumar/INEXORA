package com.appleproduct.controller;

import com.appleproduct.dto.*;
import com.appleproduct.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Products & Catalog", description = "Browse verified Apple products, categories, search, and technical specifications")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all official Apple product categories")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(productService.getAllCategories()));
    }

    @GetMapping("/products")
    @Operation(summary = "List and filter products by category, price range, availability, and sort order")
    public ResponseEntity<ApiResponse<Page<ProductSummaryDto>>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false, defaultValue = "featured") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size) {

        Page<ProductSummaryDto> result = productService.getProducts(category, minPrice, maxPrice, availability, sortBy, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/products/featured")
    @Operation(summary = "Get featured flagship Apple products")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.success(productService.getFeaturedProducts()));
    }

    @GetMapping("/products/new-arrivals")
    @Operation(summary = "Get latest Apple release arrivals")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getNewArrivals() {
        return ResponseEntity.ok(ApiResponse.success(productService.getNewArrivals()));
    }

    @GetMapping("/products/search")
    @Operation(summary = "Search products by name or description")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> searchProducts(
            @RequestParam String query) {
        return ResponseEntity.ok(ApiResponse.success(productService.searchProducts(query)));
    }

    @GetMapping("/products/{identifier}")
    @Operation(summary = "Get product details with variants, specifications, and gallery by ID or slug")
    public ResponseEntity<ApiResponse<ProductDetailDto>> getProductDetail(
            @PathVariable String identifier) {

        ProductDetailDto detail;
        if (identifier.matches("^\\d+$")) {
            detail = productService.getProductById(Long.parseLong(identifier));
        } else {
            detail = productService.getProductBySlug(identifier);
        }

        return ResponseEntity.ok(ApiResponse.success(detail));
    }
}
