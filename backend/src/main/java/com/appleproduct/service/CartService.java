package com.appleproduct.service;

import com.appleproduct.dto.AddToCartRequest;
import com.appleproduct.dto.CartDto;
import com.appleproduct.dto.CartItemDto;
import com.appleproduct.entity.*;
import com.appleproduct.exception.BadRequestException;
import com.appleproduct.exception.ResourceNotFoundException;
import com.appleproduct.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductImageRepository imageRepository;
    private final AuthService authService;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            ProductVariantRepository variantRepository,
            ProductImageRepository imageRepository,
            AuthService authService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.imageRepository = imageRepository;
        this.authService = authService;
    }

    @Transactional
    public Cart getOrCreateCart(String sessionToken) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser != null) {
            return cartRepository.findByUserId(currentUser.getId())
                    .orElseGet(() -> {
                        Cart cart = new Cart();
                        cart.setUser(currentUser);
                        return cartRepository.save(cart);
                    });
        }

        if (sessionToken != null && !sessionToken.isBlank()) {
            return cartRepository.findBySessionToken(sessionToken)
                    .orElseGet(() -> {
                        Cart cart = new Cart();
                        cart.setSessionToken(sessionToken);
                        return cartRepository.save(cart);
                    });
        }

        Cart cart = new Cart();
        cart.setSessionToken(java.util.UUID.randomUUID().toString());
        return cartRepository.save(cart);
    }

    @Transactional
    public CartDto getCartDto(String sessionToken) {
        Cart cart = getOrCreateCart(sessionToken);
        return mapToCartDto(cart);
    }

    @Transactional
    public CartDto addItem(AddToCartRequest request, String sessionToken) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than zero.");
        }

        Cart cart = getOrCreateCart(sessionToken);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));

        if (!variant.getProduct().getId().equals(product.getId())) {
            throw new BadRequestException("Variant does not belong to the specified product.");
        }

        // Validate stock
        if (variant.getInventory() != null && variant.getInventory().getStockQuantity() <= 0) {
            throw new BadRequestException("This product variant is currently out of stock.");
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndVariantId(cart.getId(), variant.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            // Always refresh unit price from database
            item.setUnitPriceInr(variant.getPriceInr());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(
                    cart,
                    product,
                    variant,
                    request.getQuantity(),
                    variant.getPriceInr()
            );
            cartItemRepository.save(newItem);
        }

        return mapToCartDto(cart);
    }

    @Transactional
    public CartDto updateItemQuantity(Long itemId, Integer quantity, String sessionToken) {
        if (quantity <= 0) {
            return removeItem(itemId, sessionToken);
        }

        Cart cart = getOrCreateCart(sessionToken);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart.");
        }

        item.setQuantity(quantity);
        // Refresh unit price from authoritative database variant price
        item.setUnitPriceInr(item.getVariant().getPriceInr());
        cartItemRepository.save(item);

        return mapToCartDto(cart);
    }

    @Transactional
    public CartDto removeItem(Long itemId, String sessionToken) {
        Cart cart = getOrCreateCart(sessionToken);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart.");
        }

        cartItemRepository.delete(item);
        return mapToCartDto(cart);
    }

    @Transactional
    public void clearCart(Cart cart) {
        cartItemRepository.deleteByCartId(cart.getId());
    }

    @Transactional
    public void mergeGuestCart(String sessionToken) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null || sessionToken == null || sessionToken.isBlank()) {
            return;
        }

        Optional<Cart> guestCartOpt = cartRepository.findBySessionToken(sessionToken);
        if (guestCartOpt.isEmpty()) {
            return;
        }

        Cart guestCart = guestCartOpt.get();
        Cart userCart = cartRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setUser(currentUser);
                    return cartRepository.save(c);
                });

        List<CartItem> guestItems = cartItemRepository.findByCartId(guestCart.getId());
        for (CartItem gItem : guestItems) {
            Optional<CartItem> userItemOpt = cartItemRepository.findByCartIdAndVariantId(userCart.getId(), gItem.getVariant().getId());
            if (userItemOpt.isPresent()) {
                CartItem uItem = userItemOpt.get();
                uItem.setQuantity(uItem.getQuantity() + gItem.getQuantity());
                uItem.setUnitPriceInr(gItem.getVariant().getPriceInr());
                cartItemRepository.save(uItem);
            } else {
                gItem.setCart(userCart);
                cartItemRepository.save(gItem);
            }
        }

        // Delete guest cart container
        cartRepository.delete(guestCart);
    }

    public CartDto mapToCartDto(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        List<CartItemDto> itemDtos = new ArrayList<>();

        BigDecimal subtotal = BigDecimal.ZERO;
        int totalQty = 0;

        for (CartItem item : items) {
            CartItemDto dto = new CartItemDto();
            dto.setId(item.getId());
            dto.setProductId(item.getProduct().getId());
            dto.setProductSlug(item.getProduct().getSlug());
            dto.setProductName(item.getProduct().getName());
            dto.setVariantId(item.getVariant().getId());
            dto.setVariantSku(item.getVariant().getSku());
            dto.setColourName(item.getVariant().getColourName());
            dto.setColourHex(item.getVariant().getColourHex());
            dto.setStorage(item.getVariant().getStorage());
            dto.setQuantity(item.getQuantity());

            // Always calculate authoritative price from variant
            BigDecimal unitPrice = item.getVariant().getPriceInr();
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

            dto.setUnitPriceInr(unitPrice);
            dto.setTotalPriceInr(itemTotal);

            // Fetch primary or first image
            List<ProductImage> images = imageRepository.findByProductIdOrderByDisplayOrderAsc(item.getProduct().getId());
            String imgUrl = images.isEmpty() ? null : images.get(0).getImageUrl();
            dto.setImageUrl(imgUrl);

            itemDtos.add(dto);

            subtotal = subtotal.add(itemTotal);
            totalQty += item.getQuantity();
        }

        CartDto cartDto = new CartDto();
        cartDto.setId(cart.getId());
        cartDto.setItems(itemDtos);
        cartDto.setTotalQuantity(totalQty);
        cartDto.setSubtotalInr(subtotal);
        cartDto.setTaxInr(BigDecimal.ZERO); // Included in prices
        cartDto.setShippingInr(BigDecimal.ZERO); // Free premium shipping
        cartDto.setTotalInr(subtotal);

        return cartDto;
    }
}
