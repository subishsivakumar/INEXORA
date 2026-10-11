package com.appleproduct.controller;

import com.appleproduct.dto.ApiResponse;
import com.appleproduct.dto.CheckoutRequest;
import com.appleproduct.dto.OrderDto;
import com.appleproduct.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders & Checkout", description = "Transactional demo checkout, order persistence in MySQL, and order history tracking")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Place demonstration order from current cart")
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @Valid @RequestBody CheckoutRequest request,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        OrderDto order = orderService.createOrder(request, sessionToken);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping
    @Operation(summary = "Get current authenticated user order history")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getUserOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getUserOrders()));
    }

    @GetMapping("/{orderNumber}")
    @Operation(summary = "Get order details and status by order number")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderByNumber(orderNumber)));
    }
}
