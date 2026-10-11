package com.appleproduct.controller;

import com.appleproduct.dto.ApiResponse;
import com.appleproduct.dto.WishlistDto;
import com.appleproduct.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@Tag(name = "Wishlist", description = "User saved products, wishlist persistence in MySQL, and move-to-cart")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    @Operation(summary = "Get current user wishlist")
    public ResponseEntity<ApiResponse<WishlistDto>> getWishlist() {
        return ResponseEntity.ok(ApiResponse.success(wishlistService.getWishlist()));
    }

    @PostMapping("/{productId}")
    @Operation(summary = "Add product to wishlist")
    public ResponseEntity<ApiResponse<WishlistDto>> addToWishlist(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success("Added to wishlist", wishlistService.addToWishlist(productId)));
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Remove product from wishlist")
    public ResponseEntity<ApiResponse<WishlistDto>> removeFromWishlist(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist", wishlistService.removeFromWishlist(productId)));
    }

    @PostMapping("/{productId}/move-to-cart")
    @Operation(summary = "Move product from wishlist to shopping cart")
    public ResponseEntity<ApiResponse<WishlistDto>> moveToCart(
            @PathVariable Long productId,
            @RequestParam(required = false) Long variantId) {
        return ResponseEntity.ok(ApiResponse.success("Moved to cart", wishlistService.moveToCart(productId, variantId)));
    }
}
