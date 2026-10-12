package com.appleproduct.service;

import com.appleproduct.dto.CheckoutRequest;
import com.appleproduct.dto.OrderDto;
import com.appleproduct.dto.OrderItemDto;
import com.appleproduct.entity.*;
import com.appleproduct.exception.BadRequestException;
import com.appleproduct.exception.ResourceNotFoundException;
import com.appleproduct.exception.UnauthorizedException;
import com.appleproduct.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final InventoryRepository inventoryRepository;
    private final AddressRepository addressRepository;
    private final AuthService authService;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            InventoryRepository inventoryRepository,
            AddressRepository addressRepository,
            AuthService authService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.inventoryRepository = inventoryRepository;
        this.addressRepository = addressRepository;
        this.authService = authService;
    }

    @Transactional
    public OrderDto createOrder(CheckoutRequest request, String sessionToken) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            throw new UnauthorizedException("You must be logged in to place an order.");
        }

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Your cart is empty."));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your shopping cart contains no items.");
        }

        // Validate stock availability and calculate totals server-side
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItemsToSave = new ArrayList<>();

        for (CartItem ci : cartItems) {
            ProductVariant variant = ci.getVariant();
            Inventory inventory = variant.getInventory();

            if (inventory != null && inventory.getStockQuantity() < ci.getQuantity()) {
                throw new BadRequestException("Insufficient inventory for " + ci.getProduct().getName() +
                        " (" + variant.getColourName() + "). Available: " + inventory.getStockQuantity());
            }

            BigDecimal unitPrice = variant.getPriceInr();
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(ci.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            // Deduct inventory
            if (inventory != null) {
                inventory.setStockQuantity(inventory.getStockQuantity() - ci.getQuantity());
                inventoryRepository.save(inventory);
            }
        }

        // Generate Order Number
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String orderNumber = "AP-" + datePrefix + "-" + randomSuffix;

        // Build Order
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setStatus("PROCESSING");
        order.setSubtotalInr(subtotal);
        order.setTaxInr(BigDecimal.ZERO);
        order.setShippingInr(BigDecimal.ZERO);
        order.setTotalInr(subtotal);

        order.setShippingName(request.getShippingName().trim());
        order.setShippingPhone(request.getShippingPhone().trim());
        order.setShippingAddress(request.getShippingAddress().trim() + 
                (request.getAddressLine2() != null && !request.getAddressLine2().isBlank() ? ", " + request.getAddressLine2().trim() : ""));
        order.setShippingCity(request.getShippingCity().trim());
        order.setShippingState(request.getShippingState().trim());
        order.setShippingPostalCode(request.getShippingPostalCode().trim());

        Order savedOrder = orderRepository.save(order);

        // Snapshot order items with purchased price at time of order
        for (CartItem ci : cartItems) {
            OrderItem oi = new OrderItem();
            oi.setOrder(savedOrder);
            oi.setProduct(ci.getProduct());
            oi.setVariant(ci.getVariant());
            oi.setProductName(ci.getProduct().getName());
            oi.setVariantSku(ci.getVariant().getSku());
            oi.setColourName(ci.getVariant().getColourName());
            oi.setStorage(ci.getVariant().getStorage());
            oi.setUnitPriceInr(ci.getVariant().getPriceInr());
            oi.setQuantity(ci.getQuantity());
            oi.setTotalPriceInr(ci.getVariant().getPriceInr().multiply(BigDecimal.valueOf(ci.getQuantity())));
            orderItemRepository.save(oi);
            savedOrder.getItems().add(oi);
        }

        // Save delivery address to user addresses if not present
        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getShippingName().trim());
        address.setPhone(request.getShippingPhone().trim());
        address.setAddressLine1(request.getShippingAddress().trim());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getShippingCity().trim());
        address.setState(request.getShippingState().trim());
        address.setPostalCode(request.getShippingPostalCode().trim());
        address.setIsDefault(true);
        addressRepository.save(address);

        // Clear cart after checkout
        cartItemRepository.deleteByCartId(cart.getId());

        return mapToOrderDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            throw new UnauthorizedException("You must be logged in to view your orders.");
        }

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderByNumber(String orderNumber) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            throw new UnauthorizedException("You must be logged in to view your order.");
        }

        Order order = orderRepository.findByOrderNumberAndUserId(orderNumber, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        return mapToOrderDto(order);
    }

    public OrderDto mapToOrderDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setStatus(order.getStatus());
        dto.setSubtotalInr(order.getSubtotalInr());
        dto.setTaxInr(order.getTaxInr());
        dto.setShippingInr(order.getShippingInr());
        dto.setTotalInr(order.getTotalInr());
        dto.setShippingName(order.getShippingName());
        dto.setShippingPhone(order.getShippingPhone());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setShippingCity(order.getShippingCity());
        dto.setShippingState(order.getShippingState());
        dto.setShippingPostalCode(order.getShippingPostalCode());
        dto.setCreatedAt(order.getCreatedAt());

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        List<OrderItemDto> itemDtos = items.stream().map(i -> {
            OrderItemDto idto = new OrderItemDto();
            idto.setId(i.getId());
            idto.setProductId(i.getProduct().getId());
            idto.setProductName(i.getProductName());
            idto.setVariantSku(i.getVariantSku());
            idto.setColourName(i.getColourName());
            idto.setStorage(i.getStorage());
            idto.setUnitPriceInr(i.getUnitPriceInr());
            idto.setQuantity(i.getQuantity());
            idto.setTotalPriceInr(i.getTotalPriceInr());
            return idto;
        }).collect(Collectors.toList());
        dto.setItems(itemDtos);

        return dto;
    }
}
