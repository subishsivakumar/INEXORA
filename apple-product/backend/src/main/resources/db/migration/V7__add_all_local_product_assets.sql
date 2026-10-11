-- ==========================================================
-- Apple Product Migration V7
-- Ensure all products including all iPhone models have registered local vector assets
-- ==========================================================

-- 1. Insert verified local vector assets into product_images for all iPhone models
INSERT INTO product_images (product_id, variant_id, image_url, alt_text, is_primary, display_order)
VALUES
  (1, NULL, '/images/products/iphone-16-pro-max.svg', 'iPhone 16 Pro Max Vector Technical Profile', FALSE, 99),
  (2, NULL, '/images/products/iphone-16-pro.svg', 'iPhone 16 Pro Vector Technical Profile', FALSE, 99),
  (3, NULL, '/images/products/iphone-16.svg', 'iPhone 16 Vector Technical Profile', FALSE, 99),
  (4, NULL, '/images/products/iphone-16-plus.svg', 'iPhone 16 Plus Vector Technical Profile', FALSE, 99),
  (5, NULL, '/images/products/iphone-15.svg', 'iPhone 15 Vector Technical Profile', FALSE, 99),
  (33, NULL, '/images/products/iphone-16e.svg', 'iPhone 16e Vector Technical Profile', FALSE, 99)
ON DUPLICATE KEY UPDATE alt_text = VALUES(alt_text);

-- 2. Insert verified local vector assets for all other hardware models
INSERT INTO product_images (product_id, variant_id, image_url, alt_text, is_primary, display_order)
VALUES
  (6, NULL, '/images/products/macbook-pro-14-m4.svg', 'MacBook Pro 14 M4 Vector Profile', FALSE, 99),
  (7, NULL, '/images/products/macbook-air-13-m3.svg', 'MacBook Air 13 M3 Vector Profile', FALSE, 99),
  (8, NULL, '/images/products/macbook-air-15-m3.svg', 'MacBook Air 15 M3 Vector Profile', FALSE, 99),
  (9, NULL, '/images/products/mac-mini-m4.svg', 'Mac mini M4 Vector Profile', FALSE, 99),
  (10, NULL, '/images/products/imac-24-m4.svg', 'iMac 24 M4 Vector Profile', FALSE, 99),
  (11, NULL, '/images/products/mac-studio-m2-max.svg', 'Mac Studio Vector Profile', FALSE, 99),
  (12, NULL, '/images/products/ipad-pro-13-m4.svg', 'iPad Pro 13 M4 Vector Profile', FALSE, 99),
  (13, NULL, '/images/products/ipad-air-11-m2.svg', 'iPad Air 11 M2 Vector Profile', FALSE, 99),
  (14, NULL, '/images/products/ipad-10th-gen.svg', 'iPad 10th Gen Vector Profile', FALSE, 99),
  (15, NULL, '/images/products/ipad-mini-a17-pro.svg', 'iPad mini A17 Pro Vector Profile', FALSE, 99),
  (16, NULL, '/images/products/apple-watch-series-10.svg', 'Apple Watch Series 10 Vector Profile', FALSE, 99),
  (17, NULL, '/images/products/apple-watch-ultra-2.svg', 'Apple Watch Ultra 2 Vector Profile', FALSE, 99),
  (18, NULL, '/images/products/apple-watch-se.svg', 'Apple Watch SE Vector Profile', FALSE, 99),
  (19, NULL, '/images/products/airpods-pro-2-usb-c.svg', 'AirPods Pro 2 Vector Profile', FALSE, 99),
  (20, NULL, '/images/products/airpods-4-anc.svg', 'AirPods 4 ANC Vector Profile', FALSE, 99),
  (21, NULL, '/images/products/airpods-max-usb-c.svg', 'AirPods Max Vector Profile', FALSE, 99),
  (22, NULL, '/images/products/apple-vision-pro.svg', 'Apple Vision Pro Vector Profile', FALSE, 99),
  (23, NULL, '/images/products/apple-tv-4k.svg', 'Apple TV 4K Vector Profile', FALSE, 99),
  (24, NULL, '/images/products/homepod-2nd-gen.svg', 'HomePod Vector Profile', FALSE, 99),
  (25, NULL, '/images/products/homepod-mini.svg', 'HomePod mini Vector Profile', FALSE, 99),
  (26, NULL, '/images/products/airtag-1-pack.svg', 'AirTag 1-Pack Vector Profile', FALSE, 99),
  (27, NULL, '/images/products/airtag-4-pack.svg', 'AirTag 4-Pack Vector Profile', FALSE, 99),
  (28, NULL, '/images/products/apple-pencil-pro.svg', 'Apple Pencil Pro Vector Profile', FALSE, 99),
  (29, NULL, '/images/products/magic-keyboard-touch-id.svg', 'Magic Keyboard Vector Profile', FALSE, 99),
  (30, NULL, '/images/products/magic-mouse-usbc.svg', 'Magic Mouse Vector Profile', FALSE, 99),
  (31, NULL, '/images/products/studio-display-27.svg', 'Studio Display Vector Profile', FALSE, 99),
  (32, NULL, '/images/products/pro-display-xdr.svg', 'Pro Display XDR Vector Profile', FALSE, 99)
ON DUPLICATE KEY UPDATE alt_text = VALUES(alt_text);
