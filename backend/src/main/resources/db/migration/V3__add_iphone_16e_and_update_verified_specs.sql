-- ==========================================================
-- Apple Product Migration V3
-- Add iPhone 16e and update official Apple India pricing & images
-- ==========================================================

-- Allow NULL for base_price_inr and price_inr when official Indian retail pricing is unannounced
ALTER TABLE products MODIFY COLUMN base_price_inr DECIMAL(12, 2) NULL;
ALTER TABLE product_variants MODIFY COLUMN price_inr DECIMAL(12, 2) NULL;

-- 1. Insert iPhone 16e
INSERT INTO products (
    id, slug, name, category_id, model_and_generation, 
    short_description, full_description, base_price_inr, 
    availability_status, featured, is_new_arrival, has_3d_model, 
    model_3d_path, price_verification_date, source_url
) VALUES (
    33, 'iphone-16e', 'iPhone 16e', 1, 'iPhone 16e (2025)',
    'Powered by the A18 chip and built for Apple Intelligence, with 48MP 2-in-1 camera in matte black and white.',
    'iPhone 16e delivers high performance and extended battery endurance in a durable aluminum and glass enclosure. Featuring the A18 chip, Apple custom C1 modem, an advanced 48MP Fusion 2-in-1 camera with optical-quality 2x Telephoto, 6.1-inch Super Retina XDR OLED display, and built-in Apple Intelligence.',
    59900.00, 'IN_STOCK', TRUE, TRUE, TRUE,
    '/models/iphone16pro.glb', '2025-02-19', 'https://www.apple.com/in/newsroom/2025/02/apple-introduces-iphone-16e/'
) ON DUPLICATE KEY UPDATE 
    name=VALUES(name),
    base_price_inr=VALUES(base_price_inr),
    short_description=VALUES(short_description),
    full_description=VALUES(full_description),
    featured=VALUES(featured),
    is_new_arrival=VALUES(is_new_arrival);

-- 2. Variants for iPhone 16e
INSERT INTO product_variants (id, product_id, sku, colour_name, colour_hex, storage, ram, price_inr) VALUES
(43, 33, 'IP16E-128-BLACK', 'Matte Black', '#1D1D1F', '128GB', '8GB', 59900.00),
(44, 33, 'IP16E-256-BLACK', 'Matte Black', '#1D1D1F', '256GB', '8GB', 69900.00),
(45, 33, 'IP16E-128-WHITE', 'Matte White', '#F2F2F2', '128GB', '8GB', 59900.00),
(46, 33, 'IP16E-256-WHITE', 'Matte White', '#F2F2F2', '256GB', '8GB', 69900.00)
ON DUPLICATE KEY UPDATE price_inr=VALUES(price_inr), colour_name=VALUES(colour_name);

-- 3. Specifications for iPhone 16e
INSERT INTO product_specifications (
    product_id, display_spec, chipset_spec, camera_spec, battery_spec, 
    storage_options, memory_options, colours_spec, connectivity_spec, 
    dimensions_spec, weight_spec, special_features
) VALUES (
    33,
    '6.1-inch Super Retina XDR OLED display, 2532x1170 at 460 ppi, HDR, True Tone, 800 nits max (typical), 1200 nits peak (HDR)',
    'A18 chip with 6-core CPU (2 performance + 4 efficiency), 4-core GPU, 16-core Neural Engine',
    '48MP Fusion 2-in-1 camera with 2x Telephoto, sensor-shift OIS, 12MP TrueDepth front camera with Autofocus',
    'Up to 26 hours video playback, fast-charge capable: up to 50% in 30 minutes with 20W adapter',
    '128GB, 256GB',
    '8GB Unified Memory for Apple Intelligence',
    'Matte Black, Matte White',
    '5G (sub-6 GHz) with Apple C1 modem, Wi-Fi 6E (802.11ax), Bluetooth 5.3, USB-C connector',
    '146.7 x 71.5 x 7.80 mm',
    '167 grams',
    'Built for Apple Intelligence, Ceramic Shield front, Aerospace-grade aluminum, IP68 water resistance, Face ID'
) ON DUPLICATE KEY UPDATE 
    display_spec=VALUES(display_spec),
    chipset_spec=VALUES(chipset_spec),
    camera_spec=VALUES(camera_spec);

-- 4. Product Images for iPhone 16e
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order) VALUES
(33, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 16e Front and Back in Matte Black', TRUE, 1),
(33, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 16e Side Profile and Camera', FALSE, 2)
ON DUPLICATE KEY UPDATE alt_text=VALUES(alt_text);

-- 5. Inventory for iPhone 16e
INSERT INTO inventory (variant_id, stock_quantity, low_stock_threshold) VALUES
(43, 60, 5),
(44, 45, 5),
(45, 55, 5),
(46, 40, 5)
ON DUPLICATE KEY UPDATE stock_quantity=VALUES(stock_quantity);

-- 6. Set Apple Vision Pro price to NULL as official Indian INR retail price has not been announced by Apple India
UPDATE products SET base_price_inr = NULL, price_verification_date = NULL WHERE id = 22;
UPDATE product_variants SET price_inr = NULL WHERE product_id = 22;

-- 7. Add authentic high-res Apple CDN primary images for products missing primary images
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order) VALUES
(4, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 16 Plus Display and Camera', TRUE, 1),
(5, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-15-model-unselect-gallery-1-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 15 Display with Dynamic Island', TRUE, 1),
(8, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-air-15-midnight-select-202403?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'MacBook Air 15-inch M3 in Midnight', TRUE, 1),
(10, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/imac-24-blue-selection-hero-202410?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iMac 24-inch M4 in Blue 4.5K Retina', TRUE, 1),
(11, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-studio-select-202306?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Mac Studio Front and Rear Ports', TRUE, 1),
(13, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-air-storage-select-202405-11inch-spacegray?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPad Air 11-inch M2 Space Gray', TRUE, 1),
(14, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-10th-gen-storage-select-202210-blue?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPad 10th Generation All-Screen Blue', TRUE, 1),
(15, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-mini-storage-select-202410-spacegray?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPad mini A17 Pro in Space Gray', TRUE, 1),
(18, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-se-case-unselect-gallery-1-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Apple Watch SE Midnight Aluminum Case', TRUE, 1),
(21, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-max-select-midnight-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'AirPods Max USB-C Midnight Acoustic Cushions', TRUE, 1),
(24, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/homepod-select-midnight-202210?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'HomePod 2nd Gen High-Excursion Woofer', TRUE, 1),
(25, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/homepod-mini-select-spacegray-202110?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'HomePod mini Spherical Acoustic Waveguide', TRUE, 1),
(26, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airtag-single-select-202104?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'AirTag Stainless Steel and Precision Finding', TRUE, 1),
(29, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MXCL3?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Magic Keyboard with Touch ID and Numeric Keypad', TRUE, 1),
(30, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MXK53?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Magic Mouse USB-C Multi-Touch Surface', TRUE, 1),
(32, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/pro-display-xdr-hero-select-201911?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Pro Display XDR 32-inch 6K Retina Screen', TRUE, 1)
ON DUPLICATE KEY UPDATE alt_text=VALUES(alt_text);
