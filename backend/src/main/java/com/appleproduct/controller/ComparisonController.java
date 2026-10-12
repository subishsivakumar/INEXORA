package com.appleproduct.controller;

import com.appleproduct.dto.ApiResponse;
import com.appleproduct.dto.ProductComparisonDto;
import com.appleproduct.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/compare")
@Tag(name = "Product Comparison", description = "Side-by-side technical specification comparison for Apple devices")
public class ComparisonController {

    private final ProductService productService;

    public ComparisonController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Compare up to 4 products side by side by product IDs")
    public ResponseEntity<ApiResponse<ProductComparisonDto>> compareProducts(
            @RequestParam(name = "ids") List<Long> productIds) {
        return ResponseEntity.ok(ApiResponse.success(productService.compareProducts(productIds)));
    }
}
