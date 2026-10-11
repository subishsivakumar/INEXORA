package com.appleproduct.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_specifications")
public class ProductSpecification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(name = "display_spec")
    private String displaySpec;

    @Column(name = "chipset_spec")
    private String chipsetSpec;

    @Column(name = "camera_spec")
    private String cameraSpec;

    @Column(name = "battery_spec")
    private String batterySpec;

    @Column(name = "storage_options")
    private String storageOptions;

    @Column(name = "memory_options")
    private String memoryOptions;

    @Column(name = "colours_spec")
    private String coloursSpec;

    @Column(name = "connectivity_spec")
    private String connectivitySpec;

    @Column(name = "dimensions_spec")
    private String dimensionsSpec;

    @Column(name = "weight_spec")
    private String weightSpec;

    @Column(name = "special_features", columnDefinition = "TEXT")
    private String specialFeatures;

    public ProductSpecification() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getDisplaySpec() { return displaySpec; }
    public void setDisplaySpec(String displaySpec) { this.displaySpec = displaySpec; }

    public String getChipsetSpec() { return chipsetSpec; }
    public void setChipsetSpec(String chipsetSpec) { this.chipsetSpec = chipsetSpec; }

    public String getCameraSpec() { return cameraSpec; }
    public void setCameraSpec(String cameraSpec) { this.cameraSpec = cameraSpec; }

    public String getBatterySpec() { return batterySpec; }
    public void setBatterySpec(String batterySpec) { this.batterySpec = batterySpec; }

    public String getStorageOptions() { return storageOptions; }
    public void setStorageOptions(String storageOptions) { this.storageOptions = storageOptions; }

    public String getMemoryOptions() { return memoryOptions; }
    public void setMemoryOptions(String memoryOptions) { this.memoryOptions = memoryOptions; }

    public String getColoursSpec() { return coloursSpec; }
    public void setColoursSpec(String coloursSpec) { this.coloursSpec = coloursSpec; }

    public String getConnectivitySpec() { return connectivitySpec; }
    public void setConnectivitySpec(String connectivitySpec) { this.connectivitySpec = connectivitySpec; }

    public String getDimensionsSpec() { return dimensionsSpec; }
    public void setDimensionsSpec(String dimensionsSpec) { this.dimensionsSpec = dimensionsSpec; }

    public String getWeightSpec() { return weightSpec; }
    public void setWeightSpec(String weightSpec) { this.weightSpec = weightSpec; }

    public String getSpecialFeatures() { return specialFeatures; }
    public void setSpecialFeatures(String specialFeatures) { this.specialFeatures = specialFeatures; }
}
