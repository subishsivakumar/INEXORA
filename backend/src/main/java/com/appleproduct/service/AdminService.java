package com.appleproduct.service;

import com.appleproduct.dto.AnalyticsDto;
import com.appleproduct.dto.OrderDto;
import com.appleproduct.dto.ProductDetailDto;
import com.appleproduct.entity.*;
import com.appleproduct.exception.BadRequestException;
import com.appleproduct.exception.ResourceNotFoundException;
import com.appleproduct.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductService productService;
    private final OrderService orderService;

    public AdminService(
            ProductRepository productRepository,
            ProductVariantRepository variantRepository,
            InventoryRepository inventoryRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductService productService,
            OrderService orderService) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.inventoryRepository = inventoryRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productService = productService;
        this.orderService = orderService;
    }

    @Transactional(readOnly = true)
    public AnalyticsDto getAnalytics() {
        AnalyticsDto analytics = new AnalyticsDto();
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();

        analytics.setTotalOrders((long) orders.size());
        BigDecimal revenue = orders.stream()
                .map(Order::getTotalInr)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        analytics.setTotalRevenue(revenue);
        analytics.setTotalProducts(productRepository.count());
        analytics.setTotalCustomers(userRepository.count());

        List<OrderDto> recentOrders = orders.stream()
                .limit(10)
                .map(orderService::mapToOrderDto)
                .collect(Collectors.toList());
        analytics.setRecentOrders(recentOrders);

        return analytics;
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(orderService::mapToOrderDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setStatus(newStatus.toUpperCase());
        Order updated = orderRepository.save(order);
        return orderService.mapToOrderDto(updated);
    }

    @Transactional
    public ProductDetailDto updateVariantPriceAndStock(Long variantId, BigDecimal newPriceInr, Integer newStock) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found"));

        if (newPriceInr != null && newPriceInr.compareTo(BigDecimal.ZERO) > 0) {
            variant.setPriceInr(newPriceInr);
        }

        if (newStock != null && newStock >= 0) {
            Inventory inv = variant.getInventory();
            if (inv == null) {
                inv = new Inventory();
                inv.setVariant(variant);
            }
            inv.setStockQuantity(newStock);
            inventoryRepository.save(inv);
        }

        variantRepository.save(variant);
        return productService.getProductById(variant.getProduct().getId());
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        productRepository.delete(product);
    }
}
