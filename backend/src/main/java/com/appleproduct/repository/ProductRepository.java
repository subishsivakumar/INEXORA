package com.appleproduct.repository;

import com.appleproduct.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    List<Product> findByFeaturedTrue();

    List<Product> findByIsNewArrivalTrue();

    List<Product> findByCategorySlug(String categorySlug);

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.modelAndGeneration) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchByNameOrDescription(@Param("query") String query);

    @Query("SELECT p FROM Product p WHERE " +
           "(:categorySlug IS NULL OR p.category.slug = :categorySlug) AND " +
           "(:minPrice IS NULL OR p.basePriceInr >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.basePriceInr <= :maxPrice) AND " +
           "(:status IS NULL OR p.availabilityStatus = :status)")
    Page<Product> filterProducts(
        @Param("categorySlug") String categorySlug,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("status") String status,
        Pageable pageable
    );
}
