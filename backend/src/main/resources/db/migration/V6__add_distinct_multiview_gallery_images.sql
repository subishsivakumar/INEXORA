-- ==========================================================
-- Apple Product Migration V6
-- Add Distinct Multi-View Gallery Example Photos Across Catalogue
-- Eliminates duplicate rows and ensures distinct angles/perspectives
-- ==========================================================

-- 1. Clear out duplicate and repetitive gallery entries
DELETE FROM product_images;

-- 2. Insert distinct, authentic, multi-perspective product visual assets
INSERT INTO product_images (product_id, variant_id, image_url, alt_text, is_primary, display_order) VALUES
-- -------------------------------------------------------------
-- iPhone 16 Pro Max (product_id = 1)
-- -------------------------------------------------------------
(1, 1, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Angled Pro Camera Island & OLED Display', TRUE, 1),
(1, 1, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-1-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Super Retina XDR Display in Hand', FALSE, 2),
(1, 1, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Desert Titanium 6.9-inch Dual Front & Back View', FALSE, 3),
(1, 4, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Natural Titanium 6.9-inch Dual Front & Back View', FALSE, 4),
(1, 5, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Black Titanium 6.9-inch Dual Front & Back View', FALSE, 5),
(1, 6, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-whitetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'White Titanium 6.9-inch Dual Front & Back View', FALSE, 6),

-- -------------------------------------------------------------
-- iPhone 16 Pro (product_id = 2)
-- -------------------------------------------------------------
(2, 7, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Angled Pro Camera Island & OLED Display', TRUE, 1),
(2, 7, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-1-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Super Retina XDR Display in Hand', FALSE, 2),
(2, 7, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Natural Titanium 6.3-inch Dual Front & Back View', FALSE, 3),
(2, 11, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Black Titanium 6.3-inch Dual Front & Back View', FALSE, 4),
(2, 10, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Desert Titanium 6.3-inch Dual Front & Back View', FALSE, 5),
(2, 7, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-whitetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'White Titanium 6.3-inch Dual Front & Back View', FALSE, 6),

-- -------------------------------------------------------------
-- iPhone 16 (product_id = 3)
-- -------------------------------------------------------------
(3, 12, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Ultramarine 6.1-inch Dual Front & Back View', TRUE, 1),
(3, 12, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Dual Fusion Camera System & Contoured Edge', FALSE, 2),
(3, 15, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-teal?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Teal 6.1-inch Dual Front & Back View', FALSE, 3),
(3, 16, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-pink?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Pink 6.1-inch Dual Front & Back View', FALSE, 4),
(3, 17, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Black 6.1-inch Dual Front & Back View', FALSE, 5),
(3, 12, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-white?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'White 6.1-inch Dual Front & Back View', FALSE, 6),

-- -------------------------------------------------------------
-- iPhone 16 Plus (product_id = 4)
-- -------------------------------------------------------------
(4, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-7inch-ultramarine?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Ultramarine 6.7-inch Dual Front & Back View', TRUE, 1),
(4, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Dual Camera Architecture & Contoured Profile', FALSE, 2),
(4, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-7inch-teal?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Teal 6.7-inch Dual Front & Back View', FALSE, 3),
(4, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-7inch-pink?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Pink 6.7-inch Dual Front & Back View', FALSE, 4),
(4, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-7inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Black 6.7-inch Dual Front & Back View', FALSE, 5),

-- -------------------------------------------------------------
-- iPhone 15 (product_id = 5)
-- -------------------------------------------------------------
(5, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-15-model-unselect-gallery-1-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 15 Display with Dynamic Island', TRUE, 1),
(5, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 15 Color-Infused Glass Back in Blue', FALSE, 2),

-- -------------------------------------------------------------
-- MacBook Pro 14 (product_id = 6)
-- -------------------------------------------------------------
(6, 18, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-select-202410?wid=904&hei=840&fmt=jpeg&qlt=95', 'MacBook Pro 14 Space Black Liquid Retina XDR Open Display', TRUE, 1),
(6, 18, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-gallery1-202410?wid=4000&hei=3074&fmt=jpeg&qlt=95', 'Magic Keyboard, Force Touch Trackpad & Display Angle', FALSE, 2),
(6, 18, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-gallery2-202410?wid=4000&hei=3074&fmt=jpeg&qlt=95', 'Thunderbolt 5, HDMI & MagSafe 3 Side Ports', FALSE, 3),
(6, 18, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-gallery3-202410?wid=4000&hei=3074&fmt=jpeg&qlt=95', 'Anodized Space Black Aluminum Lid Closed', FALSE, 4),
(6, 18, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-silver-select-202410?wid=904&hei=840&fmt=jpeg&qlt=95', 'MacBook Pro 14 Silver Finish Open Display', FALSE, 5),

-- -------------------------------------------------------------
-- MacBook Air 13 M3 (product_id = 7)
-- -------------------------------------------------------------
(7, 21, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-midnight-select-202402?wid=1000', 'MacBook Air 13 Midnight Open Display View', TRUE, 1),
(7, 21, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-starlight-select-202402?wid=1000', 'MacBook Air 13 Starlight Finish View', FALSE, 2),
(7, 21, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-spacegray-select-202402?wid=1000', 'MacBook Air 13 Space Grey Finish View', FALSE, 3),
(7, 21, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-silver-select-202402?wid=1000', 'MacBook Air 13 Silver Finish View', FALSE, 4),

-- -------------------------------------------------------------
-- MacBook Air 15 M3 (product_id = 8)
-- -------------------------------------------------------------
(8, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba15-midnight-select-202306?wid=1000', 'MacBook Air 15 Midnight Open Display View', TRUE, 1),
(8, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba15-starlight-select-202306?wid=1000', 'MacBook Air 15 Starlight Finish View', FALSE, 2),
(8, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba15-silver-select-202306?wid=1000', 'MacBook Air 15 Silver Finish View', FALSE, 3),

-- -------------------------------------------------------------
-- Mac mini M4 (product_id = 9)
-- -------------------------------------------------------------
(9, 25, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-mini-select-202410?wid=904&hei=840&fmt=jpeg&qlt=95', 'Mac mini M4 Front View with Audio Jack & Dual USB-C', TRUE, 1),

-- -------------------------------------------------------------
-- iMac 24-inch M4 (product_id = 10)
-- -------------------------------------------------------------
(10, NULL, '/images/products/imac-24.svg', 'iMac 24-inch 4.5K Retina Display All-in-One in Blue', TRUE, 1),

-- -------------------------------------------------------------
-- Mac Studio (product_id = 11)
-- -------------------------------------------------------------
(11, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-studio-select-202306?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Mac Studio Front and Rear High-Speed Ports', TRUE, 1),

-- -------------------------------------------------------------
-- iPad Pro 13-inch M4 (product_id = 12)
-- -------------------------------------------------------------
(12, 27, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-model-select-gallery-1-202405?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Ultra Retina XDR Tandem OLED Front Display View', TRUE, 1),
(12, 27, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-model-select-gallery-2-202405?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Ultra-Thin 5.1mm Profile Edge View', FALSE, 2),
(12, 27, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-spaceblack?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Space Black Matte Aluminum Back with LiDAR Scanner', FALSE, 3),
(12, 27, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-silver?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Silver Edition Aluminum Back View', FALSE, 4),

-- -------------------------------------------------------------
-- iPad Air 11-inch M2 (product_id = 13)
-- -------------------------------------------------------------
(13, NULL, '/images/products/ipad-air-11.svg', 'iPad Air 11-inch M2 Liquid Retina Display in Space Gray', TRUE, 1),

-- -------------------------------------------------------------
-- iPad 10th Gen (product_id = 14)
-- -------------------------------------------------------------
(14, NULL, '/images/products/ipad-10th-gen.svg', 'iPad 10th Generation All-Screen Liquid Retina in Blue', TRUE, 1),

-- -------------------------------------------------------------
-- iPad mini A17 Pro (product_id = 15)
-- -------------------------------------------------------------
(15, NULL, '/images/products/ipad-mini.svg', 'iPad mini A17 Pro Compact Ultra-Portable in Space Gray', TRUE, 1),

-- -------------------------------------------------------------
-- Apple Watch Series 10 (product_id = 16)
-- -------------------------------------------------------------
(16, 30, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/s10-case-unselect-gallery-1-202409?wid=5120&hei=3280&fmt=p-jpg&qlt=95', 'Jet Black Front Watch Face with Sport Band', TRUE, 1),
(16, 30, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/s10-case-unselect-gallery-2-202409?wid=5120&hei=3280&fmt=p-jpg&qlt=95', 'Angled 9.7mm Slim Case & Digital Crown Profile', FALSE, 2),
(16, 30, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/s10-case-unselect-gallery-3-202409?wid=5120&hei=3280&fmt=p-jpg&qlt=95', 'Rear Electrical Heart Sensor & Sapphire Crystal Back', FALSE, 3),

-- -------------------------------------------------------------
-- Apple Watch Ultra 2 (product_id = 17)
-- -------------------------------------------------------------
(17, 33, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ultra-case-unselect-gallery-1-202409?wid=5120&hei=3280&fmt=p-jpg&qlt=95', 'Black Titanium Front Display with Wayfinder Watch Face', TRUE, 1),
(17, 33, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ultra-case-unselect-gallery-2-202409?wid=5120&hei=3280&fmt=p-jpg&qlt=95', 'Orange Action Button, Dual Speakers & Siren Profile', FALSE, 2),
(17, 33, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ultra-case-unselect-gallery-3-202409?wid=5120&hei=3280&fmt=p-jpg&qlt=95', 'Digital Crown Guard & Titanium Housing Detail', FALSE, 3),

-- -------------------------------------------------------------
-- Apple Watch SE (product_id = 18)
-- -------------------------------------------------------------
(18, NULL, '/images/products/watch-se.svg', 'Apple Watch SE Midnight Aluminum Case with Sport Band', TRUE, 1),

-- -------------------------------------------------------------
-- AirPods Pro 2 (product_id = 19)
-- -------------------------------------------------------------
(19, 35, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=95', 'AirPods Pro 2 with Open MagSafe Charging Case', TRUE, 1),
(19, 35, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQD83_AV1?wid=1144&hei=1144&fmt=jpeg&qlt=95', 'Individual In-Ear Bud Acoustic Architecture', FALSE, 2),
(19, 35, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQD83_AV3?wid=1144&hei=1144&fmt=jpeg&qlt=95', 'Customizable Silicone Ear Tip Kit (XS, S, M, L)', FALSE, 3),
(19, 35, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQD83_AV4?wid=1144&hei=1144&fmt=jpeg&qlt=95', 'USB-C MagSafe Case with Lanyard Loop & Built-in Speaker', FALSE, 4),

-- -------------------------------------------------------------
-- AirPods 4 with ANC (product_id = 20)
-- -------------------------------------------------------------
(20, 36, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-anc-select-202409?wid=1000&hei=1000&fmt=jpeg&qlt=95', 'AirPods 4 ANC Wireless Case Open with Earbuds', TRUE, 1),
(20, 36, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-select-202409?wid=1000&hei=1000&fmt=jpeg&qlt=95', 'Contoured Ergonomic Earbud Architecture', FALSE, 2),

-- -------------------------------------------------------------
-- AirPods Max (product_id = 21)
-- -------------------------------------------------------------
(21, NULL, '/images/products/airpods-max.svg', 'AirPods Max USB-C Midnight Acoustic Cushions & Mesh Canopy', TRUE, 1),

-- -------------------------------------------------------------
-- Apple Vision Pro (product_id = 22)
-- -------------------------------------------------------------
(22, 37, '/images/products/vision-pro.svg', 'Apple Vision Pro Curved Front Glass, EyeSight & Light Seal', TRUE, 1),

-- -------------------------------------------------------------
-- Apple TV 4K (product_id = 23)
-- -------------------------------------------------------------
(23, 39, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/apple-tv-4k-hero-select-202210?wid=1000&hei=1000&fmt=jpeg&qlt=95', 'Apple TV 4K Unit with Touch-Enabled Siri Remote', TRUE, 1),

-- -------------------------------------------------------------
-- HomePod 2nd Gen (product_id = 24)
-- -------------------------------------------------------------
(24, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/homepod-select-midnight-202210?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'HomePod 2nd Gen High-Excursion Woofer & Seamless Mesh', TRUE, 1),

-- -------------------------------------------------------------
-- HomePod mini (product_id = 25)
-- -------------------------------------------------------------
(25, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/homepod-mini-select-spacegray-202110?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'HomePod mini Spherical Acoustic Waveguide in Space Gray', TRUE, 1),

-- -------------------------------------------------------------
-- AirTag (product_id = 26)
-- -------------------------------------------------------------
(26, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airtag-single-select-202104?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'AirTag Precision Finding Stainless Steel Back', TRUE, 1),

-- -------------------------------------------------------------
-- AirTag 4-Pack (product_id = 27)
-- -------------------------------------------------------------
(27, 40, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airtag-4pack-select-202104?wid=1000&hei=1000&fmt=jpeg&qlt=95', 'AirTag 4-Pack Bundle in Retail Package', TRUE, 1),

-- -------------------------------------------------------------
-- Apple Pencil Pro (product_id = 28)
-- -------------------------------------------------------------
(28, 41, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MX2D3?wid=1000&hei=1000&fmt=jpeg&qlt=95', 'Apple Pencil Pro White Finish with Precision Tip & Haptics', TRUE, 1),

-- -------------------------------------------------------------
-- Magic Keyboard with Touch ID (product_id = 29)
-- -------------------------------------------------------------
(29, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MXCL3?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Magic Keyboard with Touch ID and Numeric Keypad', TRUE, 1),

-- -------------------------------------------------------------
-- Magic Mouse USB-C (product_id = 30)
-- -------------------------------------------------------------
(30, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MXK53?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'Magic Mouse USB-C Multi-Touch Surface & Gliding Feet', TRUE, 1),

-- -------------------------------------------------------------
-- Studio Display (product_id = 31)
-- -------------------------------------------------------------
(31, 42, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/studio-display-gallery-1-202203?wid=4000&hei=3074&fmt=jpeg&qlt=95', 'Studio Display 27-inch 5K Retina Screen with Tilt Stand', TRUE, 1),

-- -------------------------------------------------------------
-- Pro Display XDR (product_id = 32)
-- -------------------------------------------------------------
(32, NULL, '/images/products/pro-display-xdr.svg', 'Pro Display XDR 32-inch 6K Retina Screen with Pro Stand', TRUE, 1),

-- -------------------------------------------------------------
-- iPhone 16e (product_id = 33)
-- -------------------------------------------------------------
(33, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 16e Front and Back in Matte Black', TRUE, 1),
(33, NULL, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 16e Side Profile and Camera', FALSE, 2);
