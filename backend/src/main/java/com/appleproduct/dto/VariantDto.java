package com.appleproduct.dto;

import java.math.BigDecimal;

public class VariantDto {
    private Long id;
    private String sku;
    private String colourName;
    private String colourHex;
    private String storage;
    private String ram;
    private BigDecimal priceInr;
    private boolean inStock;
    private Integer stockQuantity;

    public VariantDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getColourName() { return colourName; }
    public void setColourName(String colourName) { this.colourName = colourName; }

    public String getColourHex() { return colourHex; }
    public void setColourHex(String colourHex) { this.colourHex = colourHex; }

    public String getStorage() { return storage; }
    public void setStorage(String storage) { this.storage = storage; }

    public String getRam() { return ram; }
    public void setRam(String ram) { this.ram = ram; }

    public BigDecimal getPriceInr() { return priceInr; }
    public void setPriceInr(BigDecimal priceInr) { this.priceInr = priceInr; }

    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
}
