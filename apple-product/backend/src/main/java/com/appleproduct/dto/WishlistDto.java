package com.appleproduct.dto;

import java.util.ArrayList;
import java.util.List;

public class WishlistDto {
    private List<WishlistItemDto> items = new ArrayList<>();
    private Integer totalCount = 0;

    public WishlistDto() {}

    public WishlistDto(List<WishlistItemDto> items, Integer totalCount) {
        this.items = items;
        this.totalCount = totalCount;
    }

    public List<WishlistItemDto> getItems() { return items; }
    public void setItems(List<WishlistItemDto> items) { this.items = items; }

    public Integer getTotalCount() { return totalCount; }
    public void setTotalCount(Integer totalCount) { this.totalCount = totalCount; }
}
