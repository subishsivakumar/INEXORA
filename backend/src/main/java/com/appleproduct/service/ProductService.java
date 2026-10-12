package com.appleproduct.service;

import com.appleproduct.dto.*;
import com.appleproduct.entity.*;
import com.appleproduct.exception.ResourceNotFoundException;
import com.appleproduct.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductImageRepository imageRepository;
    private final ProductSpecificationRepository specificationRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            ProductVariantRepository variantRepository,
            ProductImageRepository imageRepository,
            ProductSpecificationRepository specificationRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.variantRepository = variantRepository;
        this.imageRepository = imageRepository;
        this.specificationRepository = specificationRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(cat -> new CategoryDto(
                        cat.getId(),
                        cat.getSlug(),
                        cat.getName(),
                        cat.getDescription(),
                        cat.getDisplayOrder(),
                        cat.getImageUrl()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryDto> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue().stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryDto> getNewArrivals() {
        return productRepository.findByIsNewArrivalTrue().stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ProductSummaryDto> getProducts(
            String categorySlug,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String availability,
            String sortBy,
            int page,
            int size) {

        Sort sort = Sort.by(Sort.Direction.ASC, "id");
        if ("price_asc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "basePriceInr");
        } else if ("price_desc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "basePriceInr");
        } else if ("newest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        } else if ("name_asc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "name");
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productPage = productRepository.filterProducts(
                (categorySlug != null && !categorySlug.isBlank()) ? categorySlug : null,
                minPrice,
                maxPrice,
                (availability != null && !availability.isBlank()) ? availability : null,
                pageable
        );

        return productPage.map(this::mapToSummaryDto);
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryDto> searchProducts(String query) {
        if (query == null || query.trim().isBlank()) {
            return Collections.emptyList();
        }
        return productRepository.searchByNameOrDescription(query.trim()).stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDetailDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return mapToDetailDto(product);
    }

    @Transactional(readOnly = true)
    public ProductDetailDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDetailDto(product);
    }

    @Transactional(readOnly = true)
    public ProductComparisonDto compareProducts(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return new ProductComparisonDto(Collections.emptyList());
        }

        // Limit to max 4 products as required
        List<Long> limitedIds = productIds.stream().distinct().limit(4).collect(Collectors.toList());
        List<Product> products = productRepository.findAllById(limitedIds);

        List<ProductDetailDto> details = products.stream()
                .map(this::mapToDetailDto)
                .collect(Collectors.toList());

        return new ProductComparisonDto(details);
    }

    public ProductSummaryDto mapToSummaryDto(Product product) {
        ProductSummaryDto dto = new ProductSummaryDto();
        dto.setId(product.getId());
        dto.setSlug(product.getSlug());
        dto.setName(product.getName());
        dto.setCategorySlug(product.getCategory().getSlug());
        dto.setCategoryName(product.getCategory().getName());
        dto.setModelAndGeneration(product.getModelAndGeneration());
        dto.setShortDescription(product.getShortDescription());
        dto.setBasePriceInr(product.getBasePriceInr());
        dto.setAvailabilityStatus(product.getAvailabilityStatus());
        dto.setFeatured(product.getFeatured());
        dto.setIsNewArrival(product.getIsNewArrival());
        dto.setHas3dModel(product.getHas3dModel());

        List<ProductImage> images = imageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId());
        String primaryImage = images.stream()
                .filter(ProductImage::getIsPrimary)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(images.isEmpty() ? null : images.get(0).getImageUrl());
        dto.setPrimaryImageUrl(primaryImage);

        return dto;
    }

    public ProductDetailDto mapToDetailDto(Product product) {
        ProductDetailDto dto = new ProductDetailDto();
        dto.setId(product.getId());
        dto.setSlug(product.getSlug());
        dto.setName(product.getName());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategorySlug(product.getCategory().getSlug());
        dto.setCategoryName(product.getCategory().getName());
        dto.setModelAndGeneration(product.getModelAndGeneration());
        dto.setShortDescription(product.getShortDescription());
        dto.setFullDescription(product.getFullDescription());
        dto.setBasePriceInr(product.getBasePriceInr());
        dto.setAvailabilityStatus(product.getAvailabilityStatus());
        dto.setFeatured(product.getFeatured());
        dto.setIsNewArrival(product.getIsNewArrival());
        dto.setHas3dModel(product.getHas3dModel());
        dto.setModel3dPath(product.getModel3dPath());
        dto.setPriceVerificationDate(product.getPriceVerificationDate());
        dto.setSourceUrl(product.getSourceUrl());

        // Map Variants
        List<ProductVariant> variants = variantRepository.findByProductId(product.getId());
        List<VariantDto> variantDtos = variants.stream().map(v -> {
            VariantDto vd = new VariantDto();
            vd.setId(v.getId());
            vd.setSku(v.getSku());
            vd.setColourName(v.getColourName());
            vd.setColourHex(v.getColourHex());
            vd.setStorage(v.getStorage());
            vd.setRam(v.getRam());
            vd.setPriceInr(v.getPriceInr());
            int stock = (v.getInventory() != null) ? v.getInventory().getStockQuantity() : 50;
            vd.setStockQuantity(stock);
            vd.setInStock(stock > 0);
            return vd;
        }).collect(Collectors.toList());
        dto.setVariants(variantDtos);

        // Map Images
        List<ProductImage> images = imageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId());
        List<ProductImageDto> imageDtos = images.stream().map(img ->
                new ProductImageDto(
                        img.getId(),
                        (img.getVariant() != null) ? img.getVariant().getId() : null,
                        img.getImageUrl(),
                        img.getAltText(),
                        img.getIsPrimary(),
                        img.getDisplayOrder()
                )).collect(Collectors.toList());
        dto.setImages(imageDtos);

        // Map Specification
        Optional<ProductSpecification> specOpt = specificationRepository.findByProductId(product.getId());
        if (specOpt.isPresent()) {
            ProductSpecification spec = specOpt.get();
            SpecificationDto specDto = new SpecificationDto();
            specDto.setDisplaySpec(spec.getDisplaySpec());
            specDto.setChipsetSpec(spec.getChipsetSpec());
            specDto.setCameraSpec(spec.getCameraSpec());
            specDto.setBatterySpec(spec.getBatterySpec());
            specDto.setStorageOptions(spec.getStorageOptions());
            specDto.setMemoryOptions(spec.getMemoryOptions());
            specDto.setColoursSpec(spec.getColoursSpec());
            specDto.setConnectivitySpec(spec.getConnectivitySpec());
            specDto.setDimensionsSpec(spec.getDimensionsSpec());
            specDto.setWeightSpec(spec.getWeightSpec());
            specDto.setSpecialFeatures(spec.getSpecialFeatures());
            dto.setSpecification(specDto);
        }

        // Related Products in same category
        List<Product> related = productRepository.findByCategorySlug(product.getCategory().getSlug()).stream()
                .filter(p -> !p.getId().equals(product.getId()))
                .limit(4)
                .collect(Collectors.toList());
        dto.setRelatedProducts(related.stream().map(this::mapToSummaryDto).collect(Collectors.toList()));

        return dto;
    }
}
