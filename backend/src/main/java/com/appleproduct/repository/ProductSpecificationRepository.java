package com.appleproduct.repository;

import com.appleproduct.entity.ProductSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, Long> {
    Optional<ProductSpecification> findByProductId(Long productId);
}
