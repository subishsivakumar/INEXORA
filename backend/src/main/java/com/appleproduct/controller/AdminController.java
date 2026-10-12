package com.appleproduct.controller;

import com.appleproduct.dto.AnalyticsDto;
import com.appleproduct.dto.ApiResponse;
import com.appleproduct.dto.OrderDto;
import com.appleproduct.dto.ProductDetailDto;
import com.appleproduct.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administrator Portal", description = "Admin dashboard, sales analytics, stock and price management, order processing")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get high-level sales and operational analytics")
    public ResponseEntity<ApiResponse<AnalyticsDto>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAnalytics()));
    }

    @GetMapping("/orders")
    @Operation(summary = "List all customer orders")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllOrders()));
    }

    @PatchMapping("/orders/{id}/status")
    @Operation(summary = "Update status of an order")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(ApiResponse.success("Status updated", adminService.updateOrderStatus(id, status)));
    }

    @PatchMapping("/variants/{id}")
    @Operation(summary = "Update product variant price and inventory stock quantity")
    public ResponseEntity<ApiResponse<ProductDetailDto>> updateVariant(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        BigDecimal newPrice = body.containsKey("priceInr") ? new BigDecimal(body.get("priceInr").toString()) : null;
        Integer newStock = body.containsKey("stockQuantity") ? Integer.valueOf(body.get("stockQuantity").toString()) : null;

        return ResponseEntity.ok(ApiResponse.success("Variant updated", adminService.updateVariantPriceAndStock(id, newPrice, newStock)));
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "Delete or archive a product")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product removed", null));
    }
}
