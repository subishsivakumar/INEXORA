package com.appleproduct.controller;

import com.appleproduct.dto.AddToCartRequest;
import com.appleproduct.dto.ApiResponse;
import com.appleproduct.dto.CartDto;
import com.appleproduct.dto.UpdateCartItemRequest;
import com.appleproduct.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Shopping Cart", description = "Shopping bag operations, server-calculated totals, and variant management")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get current shopping cart")
    public ResponseEntity<ApiResponse<CartDto>> getCart(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCartDto(sessionToken)));
    }

    @PostMapping("/items")
    @Operation(summary = "Add product variant to cart")
    public ResponseEntity<ApiResponse<CartDto>> addItem(
            @Valid @RequestBody AddToCartRequest request,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cartService.addItem(request, sessionToken)));
    }

    @PatchMapping("/items/{id}")
    @Operation(summary = "Update quantity of a cart item")
    public ResponseEntity<ApiResponse<CartDto>> updateQuantity(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cartService.updateItemQuantity(id, request.getQuantity(), sessionToken)));
    }

    @DeleteMapping("/items/{id}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<ApiResponse<CartDto>> removeItem(
            @PathVariable Long id,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cartService.removeItem(id, sessionToken)));
    }

    @PostMapping("/merge")
    @Operation(summary = "Merge guest cart into user cart")
    public ResponseEntity<ApiResponse<CartDto>> mergeCart(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        cartService.mergeGuestCart(sessionToken);
        return ResponseEntity.ok(ApiResponse.success("Cart merged successfully", cartService.getCartDto(null)));
    }
}
