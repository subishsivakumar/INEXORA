-- ==========================================================
-- Apple Product Migration V4
-- Fix broken category and product image URLs with local assets
-- ==========================================================

-- 1. Update all 10 Category image URLs to reliable, high-resolution local SVG assets
UPDATE categories SET image_url = '/images/categories/iphone.svg' WHERE slug = 'iphone';
UPDATE categories SET image_url = '/images/categories/mac.svg' WHERE slug = 'mac';
UPDATE categories SET image_url = '/images/categories/ipad.svg' WHERE slug = 'ipad';
UPDATE categories SET image_url = '/images/categories/watch.svg' WHERE slug = 'watch';
UPDATE categories SET image_url = '/images/categories/airpods.svg' WHERE slug = 'airpods';
UPDATE categories SET image_url = '/images/categories/vision.svg' WHERE slug = 'vision';
UPDATE categories SET image_url = '/images/categories/tv-home.svg' WHERE slug = 'tv-home';
UPDATE categories SET image_url = '/images/categories/airtag.svg' WHERE slug = 'airtag';
UPDATE categories SET image_url = '/images/categories/accessories.svg' WHERE slug = 'accessories';
UPDATE categories SET image_url = '/images/categories/displays.svg' WHERE slug = 'displays';

-- 2. Update product images that previously returned 404 from external CDN
UPDATE product_images SET image_url = '/images/products/macbook-air-13.svg' WHERE product_id = 7 AND is_primary = TRUE;
UPDATE product_images SET image_url = '/images/products/macbook-air-15.svg' WHERE product_id = 8 AND is_primary = TRUE;
UPDATE product_images SET image_url = '/images/products/imac-24.svg' WHERE product_id = 10 AND is_primary = TRUE;
UPDATE product_images SET image_url = '/images/products/ipad-air-11.svg' WHERE product_id = 13 AND is_primary = TRUE;
UPDATE product_images SET image_url = '/images/products/ipad-10th-gen.svg' WHERE product_id = 14 AND is_primary = TRUE;
UPDATE product_images SET image_url = '/images/products/ipad-mini.svg' WHERE product_id = 15 AND is_primary = TRUE;
UPDATE product_images SET image_url = '/images/products/watch-se.svg' WHERE product_id = 18 AND is_primary = TRUE;
UPDATE product_images SET image_url = '/images/products/airpods-max.svg' WHERE product_id = 21 AND is_primary = TRUE;
UPDATE product_images SET image_url = '/images/products/vision-pro.svg' WHERE product_id = 22 AND is_primary = TRUE;
UPDATE product_images SET image_url = '/images/products/pro-display-xdr.svg' WHERE product_id = 32 AND is_primary = TRUE;
