package com.appleproduct.service;

import com.appleproduct.dto.AddToCartRequest;
import com.appleproduct.dto.WishlistDto;
import com.appleproduct.dto.WishlistItemDto;
import com.appleproduct.entity.*;
import com.appleproduct.exception.BadRequestException;
import com.appleproduct.exception.ResourceNotFoundException;
import com.appleproduct.exception.UnauthorizedException;
import com.appleproduct.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository imageRepository;
    private final AuthService authService;
    private final CartService cartService;

    public WishlistService(
            WishlistRepository wishlistRepository,
            WishlistItemRepository wishlistItemRepository,
            ProductRepository productRepository,
            ProductImageRepository imageRepository,
            AuthService authService,
            CartService cartService) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.imageRepository = imageRepository;
        this.authService = authService;
        this.cartService = cartService;
    }

    @Transactional
    public Wishlist getOrCreateUserWishlist() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new UnauthorizedException("You must be signed in to access your Wishlist.");
        }

        return wishlistRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> wishlistRepository.save(new Wishlist(currentUser)));
    }

    @Transactional
    public WishlistDto getWishlist() {
        Wishlist wishlist = getOrCreateUserWishlist();
        List<WishlistItem> items = wishlistItemRepository.findByWishlistId(wishlist.getId());
        List<WishlistItemDto> itemDtos = new ArrayList<>();

        for (WishlistItem item : items) {
            WishlistItemDto dto = new WishlistItemDto();
            dto.setId(item.getId());
            dto.setProductId(item.getProduct().getId());
            dto.setProductSlug(item.getProduct().getSlug());
            dto.setProductName(item.getProduct().getName());
            dto.setBasePriceInr(item.getProduct().getBasePriceInr());
            dto.setAvailabilityStatus(item.getProduct().getAvailabilityStatus());

            List<ProductImage> images = imageRepository.findByProductIdOrderByDisplayOrderAsc(item.getProduct().getId());
            dto.setImageUrl(images.isEmpty() ? null : images.get(0).getImageUrl());

            itemDtos.add(dto);
        }

        return new WishlistDto(itemDtos, itemDtos.size());
    }

    @Transactional
    public WishlistDto addToWishlist(Long productId) {
        Wishlist wishlist = getOrCreateUserWishlist();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Optional<WishlistItem> existing = wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId);
        if (existing.isEmpty()) {
            WishlistItem item = new WishlistItem(wishlist, product);
            wishlistItemRepository.save(item);
        }

        return getWishlist();
    }

    @Transactional
    public WishlistDto removeFromWishlist(Long productId) {
        Wishlist wishlist = getOrCreateUserWishlist();
        wishlistItemRepository.deleteByWishlistIdAndProductId(wishlist.getId(), productId);
        return getWishlist();
    }

    @Transactional
    public WishlistDto moveToCart(Long productId, Long variantId) {
        Wishlist wishlist = getOrCreateUserWishlist();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // If no variantId provided, pick first available variant of product
        if (variantId == null) {
            if (product.getVariants() == null || product.getVariants().isEmpty()) {
                throw new BadRequestException("No variants available for this product.");
            }
            variantId = product.getVariants().get(0).getId();
        }

        cartService.addItem(new AddToCartRequest(productId, variantId, 1), null);
        wishlistItemRepository.deleteByWishlistIdAndProductId(wishlist.getId(), productId);

        return getWishlist();
    }
}
