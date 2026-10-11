-- ==========================================================
-- Apple Product Seed Data Migration (V2)
-- Independent Apple Products Shopping Experience
-- ==========================================================

-- 1. Roles
INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_USER'),
(2, 'ROLE_ADMIN')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Demo Users (BCrypt hash for 'Password@123' is $2a$10$7EqJtq98hPqEX7fNZaFWoOhi5VpmsL5iQj1zUvh67/s/b8lT2Cq8W)
INSERT INTO users (id, email, password_hash, full_name) VALUES
(1, 'admin@appleproduct.store', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5VpmsL5iQj1zUvh67/s/b8lT2Cq8W', 'Apple Product Administrator'),
(2, 'alex@appleproduct.store', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5VpmsL5iQj1zUvh67/s/b8lT2Cq8W', 'Alex Rivera')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(1, 2),
(2, 1)
ON DUPLICATE KEY UPDATE role_id=VALUES(role_id);

-- 3. Categories (All 10 required categories)
INSERT INTO categories (id, slug, name, description, display_order, image_url) VALUES
(1, 'iphone', 'iPhone', 'Titanium design, Camera Control, and Apple Intelligence.', 1, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-card-40-iphone16pro-202409?wid=680&hei=528&fmt=p-jpg&qlt=95'),
(2, 'mac', 'Mac', 'Incredible power and extraordinary battery life with Apple silicon.', 2, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-card-40-macbookpro-14-16-202410?wid=680&hei=528&fmt=p-jpg&qlt=95'),
(3, 'ipad', 'iPad', 'Versatile, powerful, and ready for whatever you create.', 3, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-card-40-pro-202405?wid=680&hei=528&fmt=p-jpg&qlt=95'),
(4, 'watch', 'Apple Watch', 'The ultimate device for a healthy life and adventure.', 4, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-card-40-s10-202409?wid=680&hei=528&fmt=p-jpg&qlt=95'),
(5, 'airpods', 'AirPods & Headphones', 'Personalized Spatial Audio and pro-level active noise cancellation.', 5, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-card-40-pro-202409?wid=680&hei=528&fmt=p-jpg&qlt=95'),
(6, 'vision', 'Apple Vision', 'Welcome to the era of spatial computing.', 6, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/vision-pro-card-50-202401?wid=680&hei=528&fmt=p-jpg&qlt=95'),
(7, 'tv-home', 'Apple TV & Home', 'Cinematic home entertainment and immersive room-filling sound.', 7, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/homepod-card-40-homepod-202301?wid=680&hei=528&fmt=p-jpg&qlt=95'),
(8, 'airtag', 'AirTag', 'Keep track of keys, wallet, luggage, and everyday essentials.', 8, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airtag-card-40-202104?wid=680&hei=528&fmt=p-jpg&qlt=95'),
(9, 'accessories', 'Accessories', 'Designed specifically for Apple products with seamless MagSafe integration.', 9, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/accessories-card-40-all-202409?wid=680&hei=528&fmt=p-jpg&qlt=95'),
(10, 'displays', 'Displays', 'True-to-life color, Retina resolution, and studio-grade audio.', 10, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/studio-display-card-40-202203?wid=680&hei=528&fmt=p-jpg&qlt=95')
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), image_url=VALUES(image_url);

-- 4. Products
INSERT INTO products (id, slug, name, category_id, model_and_generation, short_description, full_description, base_price_inr, availability_status, featured, is_new_arrival, has_3d_model, model_3d_path, price_verification_date, source_url) VALUES
-- iPhones
(1, 'iphone-16-pro-max', 'iPhone 16 Pro Max', 1, '16th Generation Pro Max', 'Forged in titanium with A18 Pro chip, 48MP Fusion camera, and Camera Control.', 'iPhone 16 Pro Max features a stunning Grade 5 titanium design with a larger 6.9-inch Super Retina XDR display. Powered by the groundbreaking A18 Pro chip, it brings unprecedented battery life, hardware-accelerated ray tracing, 4K 120 fps Dolby Vision recording, and advanced Camera Control.', 144900.00, 'IN_STOCK', TRUE, TRUE, TRUE, '/models/iphone16pro.glb', '2026-09-20', 'https://www.apple.com/in/iphone-16-pro/'),
(2, 'iphone-16-pro', 'iPhone 16 Pro', 1, '16th Generation Pro', 'Grade 5 titanium design, A18 Pro chip, Camera Control, and 5x Telephoto.', 'iPhone 16 Pro delivers pro-tier performance in a compact 6.3-inch form factor. With a robust titanium finish, Ceramic Shield front, pro camera system with 48MP Ultra Wide and 5x Telephoto lens, and the next-generation A18 Pro silicon.', 119900.00, 'IN_STOCK', TRUE, TRUE, TRUE, '/models/iphone16pro.glb', '2026-09-20', 'https://www.apple.com/in/iphone-16-pro/'),
(3, 'iphone-16', 'iPhone 16', 1, '16th Generation', 'Aerospace-grade aluminium with Camera Control, 48MP Fusion, and A18 chip.', 'iPhone 16 features color-infused back glass with five vibrant colors. Powered by the A18 chip for Apple Intelligence, it introduces Camera Control, Action Button, and an ultra-versatile 48MP Fusion dual-camera system.', 79900.00, 'IN_STOCK', TRUE, TRUE, FALSE, NULL, '2026-09-20', 'https://www.apple.com/in/iphone-16/'),
(4, 'iphone-16-plus', 'iPhone 16 Plus', 1, '16th Generation Plus', 'Bigger 6.7-inch Super Retina XDR display, incredible battery life, and A18 chip.', 'iPhone 16 Plus offers an expansive screen, exceptional multi-day battery endurance, A18 processor with 16-core Neural Engine, Camera Control button, and Macro photography.', 89900.00, 'IN_STOCK', FALSE, TRUE, FALSE, NULL, '2026-09-20', 'https://www.apple.com/in/iphone-16/'),
(5, 'iphone-15', 'iPhone 15', 1, '15th Generation', 'Dynamic Island, 48MP Main camera, USB-C, and A16 Bionic.', 'iPhone 15 brings Dynamic Island, high-resolution 48MP photos with 2x optical zoom, all-day battery life, and USB-C connectivity wrapped in durable color-infused glass.', 69900.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-09-20', 'https://www.apple.com/in/iphone-15/'),

-- Macs
(6, 'macbook-pro-14-m4', 'MacBook Pro 14-inch', 2, 'MacBook Pro Late 2024 (M4 Pro / M4 Max)', 'Pro performance with M4 chip family, Liquid Retina XDR display, up to 24 hours battery.', 'MacBook Pro 14-inch blasts ahead with the M4, M4 Pro, and M4 Max chips. Featuring a Liquid Retina XDR display with up to 1,600 nits peak HDR brightness, Thunderbolt 5 ports, 12MP Center Stage camera, and industry-leading battery efficiency.', 169900.00, 'IN_STOCK', TRUE, TRUE, TRUE, '/models/macbookpro.glb', '2026-11-01', 'https://www.apple.com/in/macbook-pro/'),
(7, 'macbook-air-13-m3', 'MacBook Air 13-inch', 2, 'MacBook Air (M3, 2024)', 'Impossibly thin and fast with M3 chip, up to 18 hours battery life, Liquid Retina display.', 'The world’s most popular laptop is supercharged with M3. It delivers up to 60 percent faster performance than the M1 model, dual external display support, Wi-Fi 6E, and a striking 11.3mm fanless design.', 114900.00, 'IN_STOCK', TRUE, FALSE, FALSE, NULL, '2026-03-08', 'https://www.apple.com/in/macbook-air/'),
(8, 'macbook-air-15-m3', 'MacBook Air 15-inch', 2, 'MacBook Air 15 (M3, 2024)', 'Expansive 15.3-inch Liquid Retina display, six-speaker sound, and M3 power.', 'MacBook Air 15-inch gives you more room to multitask on a spacious screen while retaining an ultra-thin 11.5mm silhouette. Powered by M3 with MagSafe charging and silent fanless cooling.', 134900.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-03-08', 'https://www.apple.com/in/macbook-air/'),
(9, 'mac-mini-m4', 'Mac mini', 2, 'Mac mini (M4, 2024)', 'More muscle, tiny size. All-new 5x5 inch compact design powered by M4 and M4 Pro.', 'Mac mini has been completely redesigned around Apple silicon in an ultra-compact 5-inch by 5-inch enclosure. Built for Apple Intelligence with front and back ports, Thunderbolt 5, and carbon neutral manufacturing.', 59900.00, 'IN_STOCK', TRUE, TRUE, FALSE, NULL, '2026-11-01', 'https://www.apple.com/in/mac-mini/'),
(10, 'imac-24-m4', 'iMac 24-inch', 2, 'iMac (M4, 2024)', 'Brilliant 4.5K Retina display, M4 chip, 12MP Center Stage camera in seven vibrant colors.', 'The world’s best all-in-one desktop is elevated with the M4 chip. Includes nano-texture glass option, color-matched accessories with USB-C, 1080p Desk View, and studio-quality mics.', 134900.00, 'IN_STOCK', FALSE, TRUE, FALSE, NULL, '2026-11-01', 'https://www.apple.com/in/imac/'),
(11, 'mac-studio-m2-max', 'Mac Studio', 2, 'Mac Studio (M2 Max / Ultra)', 'Extensive connectivity and outrageous performance for creative professionals.', 'Mac Studio fits transformational power into a compact desktop footprint. Run demanding simulations, render massive 3D environments, and edit 8K ProRes streams effortlessly.', 209900.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-06-13', 'https://www.apple.com/in/mac-studio/'),

-- iPads
(12, 'ipad-pro-13-m4', 'iPad Pro 13-inch', 3, 'iPad Pro 7th Generation (M4)', 'Thinpossible design with Ultra Retina XDR OLED, M4 chip, and Apple Pencil Pro support.', 'iPad Pro 13-inch is the thinnest Apple product ever at just 5.1mm. It introduces the groundbreaking tandem OLED Ultra Retina XDR display, M4 processor, landscape 12MP front camera, and Apple Pencil Pro barrel roll and haptic feedback.', 129900.00, 'IN_STOCK', TRUE, TRUE, FALSE, NULL, '2026-05-15', 'https://www.apple.com/in/ipad-pro/'),
(13, 'ipad-air-11-m2', 'iPad Air 11-inch', 3, 'iPad Air 6th Generation (M2)', 'Fresh design with M2 chip, Liquid Retina display, and landscape stereo speakers.', 'iPad Air brings powerhouse performance with the M2 chip, advanced AI capabilities, landscape front camera with Center Stage, and compatibility with Apple Pencil Pro and Magic Keyboard.', 59900.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-05-15', 'https://www.apple.com/in/ipad-air/'),
(14, 'ipad-10th-gen', 'iPad (10th Generation)', 3, 'iPad 10th Gen', 'All-screen 10.9-inch Liquid Retina display, A14 Bionic, USB-C, in four vivid colors.', 'The classic iPad redesigned with an all-screen layout, touch ID in top button, landscape 12MP Ultra Wide camera, USB-C port, and fast Wi-Fi 6 connectivity.', 34900.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-03-01', 'https://www.apple.com/in/ipad-10.9/'),
(15, 'ipad-mini-a17-pro', 'iPad mini', 3, 'iPad mini 7th Generation (A17 Pro)', 'Mega power in a mini size. A17 Pro chip, Apple Intelligence, and Apple Pencil Pro.', 'Ultra-portable 8.3-inch Liquid Retina display packed with the blazing-fast A17 Pro chip. Supports Apple Pencil Pro, Wi-Fi 6E, and 2x faster USB-C transfer speeds.', 49900.00, 'IN_STOCK', FALSE, TRUE, FALSE, NULL, '2026-10-23', 'https://www.apple.com/in/ipad-mini/'),

-- Apple Watch
(16, 'apple-watch-series-10', 'Apple Watch Series 10', 4, 'Series 10', 'Thinnest Apple Watch ever with our biggest display and sleep apnea notifications.', 'Series 10 features Apple’s thinnest profile ever, a wide-angle OLED display with up to 40% more brightness at an angle, depth and water temperature sensors, fast charging to 80% in 30 minutes, and S10 SiP.', 46900.00, 'IN_STOCK', TRUE, TRUE, FALSE, NULL, '2026-09-20', 'https://www.apple.com/in/apple-watch-series-10/'),
(17, 'apple-watch-ultra-2', 'Apple Watch Ultra 2', 4, 'Ultra 2 (Titanium / Black Titanium)', 'The ultimate sports and adventure watch now in a stunning satin Black Titanium finish.', 'Rugged 49mm titanium case with 3,000-nit display, precision dual-frequency GPS, up to 72 hours of battery life in Low Power Mode, water resistance to 100 meters, and customizable Action Button.', 89900.00, 'IN_STOCK', TRUE, FALSE, FALSE, NULL, '2026-09-20', 'https://www.apple.com/in/apple-watch-ultra-2/'),
(18, 'apple-watch-se', 'Apple Watch SE', 4, '2nd Generation', 'Essential features for fitness, connectivity, health, and safety at a great value.', 'All the essentials you need to stay motivated, active, and safe with Crash Detection, Fall Detection, Emergency SOS, and Heart Rate tracking.', 24900.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-09-20', 'https://www.apple.com/in/apple-watch-se/'),

-- AirPods & Audio
(19, 'airpods-pro-2-usb-c', 'AirPods Pro 2', 5, '2nd Generation (USB-C MagSafe Case)', 'Pro-level Active Noise Cancellation, Hearing Aid capability, and Adaptive Audio.', 'AirPods Pro 2 feature the H2 chip, up to 2x more Active Noise Cancellation, Transparency mode, Personalized Spatial Audio, Conversation Awareness, and USB-C MagSafe case with Precision Finding.', 24900.00, 'IN_STOCK', TRUE, FALSE, FALSE, NULL, '2026-09-20', 'https://www.apple.com/in/airpods-pro/'),
(20, 'airpods-4-anc', 'AirPods 4 with ANC', 5, '4th Generation with Active Noise Cancellation', 'Open-ear design with Active Noise Cancellation, Transparency mode, and Wireless Charging Case.', 'The first open-ear AirPods to feature Active Noise Cancellation, powered by the H2 chip. Features stem capacitive touch sensor, smaller wireless charging case with speaker, and USB-C.', 17900.00, 'IN_STOCK', TRUE, TRUE, FALSE, NULL, '2026-09-20', 'https://www.apple.com/in/airpods-4/'),
(21, 'airpods-max-usb-c', 'AirPods Max', 5, 'AirPods Max (USB-C)', 'High-fidelity audio with active noise cancellation and USB-C charging in fresh colors.', 'Over-ear headphones combining acoustic precision with custom 40mm dynamic drivers, dual H1 headphone chips, digital crown volume control, memory foam cushions, and lossless audio over USB-C.', 59900.00, 'IN_STOCK', FALSE, TRUE, FALSE, NULL, '2026-09-20', 'https://www.apple.com/in/airpods-max/'),

-- Apple Vision
(22, 'apple-vision-pro', 'Apple Vision Pro', 6, '1st Generation Spatial Computer', 'Revolutionary spatial computer that seamlessly blends digital content with your physical space.', 'Apple Vision Pro transforms how you work, watch, relive memories, and connect. Features dual 4K micro-OLED displays with 23 million pixels, eye and hand tracking, spatial audio, and M2 + R1 dual chip architecture.', 349900.00, 'IN_STOCK', TRUE, FALSE, TRUE, '/models/visionpro.glb', '2026-02-02', 'https://www.apple.com/in/apple-vision-pro/'),

-- TV & Home
(23, 'apple-tv-4k', 'Apple TV 4K', 7, '3rd Generation (128GB Wi-Fi + Ethernet)', 'The ultimate cinematic experience with A15 Bionic, 4K Dolby Vision, and HDR10+.', 'Apple TV 4K unites Apple TV+, Apple Music, Apple Fitness+, and Apple Arcade with your favourite streaming apps in our best-ever picture and sound quality. Includes Siri Remote with USB-C.', 16900.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-10-18', 'https://www.apple.com/in/apple-tv-4k/'),
(24, 'homepod-2nd-gen', 'HomePod', 7, '2nd Generation', 'Immersive, high-fidelity audio with smart home automation and Room Sensing.', 'HomePod delivers profound bass, crystal-clear highs, and advanced computational audio that automatically adapts to its surroundings in real time. Built-in temperature and humidity sensor.', 32900.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-01-18', 'https://www.apple.com/in/homepod-2nd-generation/'),
(25, 'homepod-mini', 'HomePod mini', 7, '1st Generation', 'Room-filling 360-degree sound in an elegant compact spherical design.', 'Standing just 8.4 cm tall, HomePod mini produces unexpectedly big sound. Use intercom, pair two for stereo sound, or place multiple around the house for multiroom audio.', 10900.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-10-18', 'https://www.apple.com/in/homepod-mini/'),

-- AirTag
(26, 'airtag-1-pack', 'AirTag', 8, '1-Pack', 'Precision Finding with Ultra Wideband to locate your lost belongings instantly.', 'AirTag is a super-easy way to keep track of your stuff. Attach one to your keys, slip another in your backpack. And just like that, they’re on your radar in the Find My app.', 3490.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-04-20', 'https://www.apple.com/in/airtag/'),
(27, 'airtag-4-pack', 'AirTag (4-Pack)', 8, '4-Pack Bundle', 'Complete protection bundle for keys, backpacks, wallet, and luggage.', 'Four AirTags to attach to keys, wallet, backpack, and travel luggage. Battery lasts over a year and is user-replaceable with standard CR2032 coins.', 11900.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-04-20', 'https://www.apple.com/in/airtag/'),

-- Accessories
(28, 'apple-pencil-pro', 'Apple Pencil Pro', 9, 'Pencil Pro (2024)', 'Engineered for limitless creativity with barrel roll, squeeze, and haptic feedback.', 'Apple Pencil Pro adds magical new capabilities to help bring your ideas to life. Squeeze to summon palette, roll barrel for precise orientation, and feel tactile haptic pulses.', 11900.00, 'IN_STOCK', TRUE, TRUE, FALSE, NULL, '2026-05-15', 'https://www.apple.com/in/apple-pencil-pro/'),
(29, 'magic-keyboard-touch-id', 'Magic Keyboard with Touch ID', 9, 'USB-C Edition', 'Wireless, rechargeable keyboard with numeric keypad and Touch ID sensor.', 'Magic Keyboard with Touch ID and Numeric Keypad provides a remarkably comfortable and precise typing experience with fast, easy authentication for logins and purchases.', 19500.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-10-28', 'https://www.apple.com/in/shop/product/MXCL3ZM/A/'),
(30, 'magic-mouse-usbc', 'Magic Mouse', 9, 'USB-C Edition (Black)', 'Smooth multi-touch surface for swiping and scrolling with USB-C braided cable.', 'Magic Mouse is wireless and rechargeable, with an optimized foot design that lets it glide smoothly across your desk. The Multi-Touch surface allows intuitive gestures.', 9500.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-10-28', 'https://www.apple.com/in/shop/product/MXK53ZM/A/'),

-- Displays
(31, 'studio-display-27', 'Studio Display', 10, '27-inch 5K Retina', '5K Retina display with 12MP Ultra Wide camera, studio mics, and six speakers.', 'Studio Display features a 27-inch 5K Retina screen with 600 nits brightness, P3 wide color, True Tone, 12MP camera with Center Stage, and high-fidelity six-speaker sound.', 159900.00, 'IN_STOCK', TRUE, FALSE, FALSE, NULL, '2026-03-08', 'https://www.apple.com/in/studio-display/'),
(32, 'pro-display-xdr', 'Pro Display XDR', 10, '32-inch 6K Retina', 'The world’s best pro display with 1,600 nits peak brightness and 1,000,000:1 contrast.', 'Pro Display XDR features a 32-inch Retina 6K panel, Extreme Dynamic Range, 10-bit color depth, superwide viewing angle, and customizable Pro Stand / VESA mount.', 449900.00, 'IN_STOCK', FALSE, FALSE, FALSE, NULL, '2026-06-05', 'https://www.apple.com/in/pro-display-xdr/')
ON DUPLICATE KEY UPDATE name=VALUES(name), base_price_inr=VALUES(base_price_inr), short_description=VALUES(short_description);

-- 5. Product Variants (Accurate storage, colours, and official Indian INR pricing)
INSERT INTO product_variants (id, product_id, sku, colour_name, colour_hex, storage, ram, price_inr) VALUES
-- iPhone 16 Pro Max
(1, 1, 'IP16PM-256-DESERT', 'Desert Titanium', '#C5A992', '256GB', '8GB', 144900.00),
(2, 1, 'IP16PM-512-DESERT', 'Desert Titanium', '#C5A992', '512GB', '8GB', 164900.00),
(3, 1, 'IP16PM-1TB-DESERT', 'Desert Titanium', '#C5A992', '1TB', '8GB', 184900.00),
(4, 1, 'IP16PM-256-NATURAL', 'Natural Titanium', '#9E978E', '256GB', '8GB', 144900.00),
(5, 1, 'IP16PM-256-BLACK', 'Black Titanium', '#2D2D2E', '256GB', '8GB', 144900.00),
(6, 1, 'IP16PM-256-WHITE', 'White Titanium', '#F4F2EE', '256GB', '8GB', 144900.00),

-- iPhone 16 Pro
(7, 2, 'IP16P-128-NATURAL', 'Natural Titanium', '#9E978E', '128GB', '8GB', 119900.00),
(8, 2, 'IP16P-256-NATURAL', 'Natural Titanium', '#9E978E', '256GB', '8GB', 129900.00),
(9, 2, 'IP16P-512-NATURAL', 'Natural Titanium', '#9E978E', '512GB', '8GB', 149900.00),
(10, 2, 'IP16P-128-DESERT', 'Desert Titanium', '#C5A992', '128GB', '8GB', 119900.00),
(11, 2, 'IP16P-128-BLACK', 'Black Titanium', '#2D2D2E', '128GB', '8GB', 119900.00),

-- iPhone 16
(12, 3, 'IP16-128-ULTRAMARINE', 'Ultramarine', '#5B78A5', '128GB', '8GB', 79900.00),
(13, 3, 'IP16-256-ULTRAMARINE', 'Ultramarine', '#5B78A5', '256GB', '8GB', 89900.00),
(14, 3, 'IP16-512-ULTRAMARINE', 'Ultramarine', '#5B78A5', '512GB', '8GB', 109900.00),
(15, 3, 'IP16-128-TEAL', 'Teal', '#749896', '128GB', '8GB', 79900.00),
(16, 3, 'IP16-128-BLACK', 'Black', '#1C1D1F', '128GB', '8GB', 79900.00),
(17, 3, 'IP16-128-WHITE', 'White', '#F5F5F7', '128GB', '8GB', 79900.00),

-- MacBook Pro 14
(18, 6, 'MBP14-512-SPACEBLACK', 'Space Black', '#1C1B1F', '512GB', '16GB', 169900.00),
(19, 6, 'MBP14-1TB-SPACEBLACK', 'Space Black', '#1C1B1F', '1TB', '24GB', 199900.00),
(20, 6, 'MBP14-512-SILVER', 'Silver', '#E3E4E5', '512GB', '16GB', 169900.00),

-- MacBook Air 13 M3
(21, 7, 'MBA13-256-MIDNIGHT', 'Midnight', '#2E3642', '256GB', '16GB', 114900.00),
(22, 7, 'MBA13-512-MIDNIGHT', 'Midnight', '#2E3642', '512GB', '16GB', 134900.00),
(23, 7, 'MBA13-256-STARLIGHT', 'Starlight', '#EFE9DD', '256GB', '16GB', 114900.00),
(24, 7, 'MBA13-256-SPACEGREY', 'Space Grey', '#7D7E80', '256GB', '16GB', 114900.00),

-- Mac mini M4
(25, 9, 'MM4-256-SILVER', 'Silver', '#E3E4E5', '256GB', '16GB', 59900.00),
(26, 9, 'MM4-512-SILVER', 'Silver', '#E3E4E5', '512GB', '24GB', 79900.00),

-- iPad Pro 13 M4
(27, 12, 'IPADPRO13-256-SPACEBLACK', 'Space Black', '#1C1B1F', '256GB', '8GB', 129900.00),
(28, 12, 'IPADPRO13-512-SPACEBLACK', 'Space Black', '#1C1B1F', '512GB', '8GB', 149900.00),
(29, 12, 'IPADPRO13-256-SILVER', 'Silver', '#E3E4E5', '256GB', '8GB', 129900.00),

-- Apple Watch Series 10
(30, 16, 'AWS10-42MM-JETBLACK', 'Jet Black', '#0A0A0B', '42mm Aluminium', '64GB', 46900.00),
(31, 16, 'AWS10-46MM-JETBLACK', 'Jet Black', '#0A0A0B', '46mm Aluminium', '64GB', 49900.00),
(32, 16, 'AWS10-42MM-ROSEGOLD', 'Rose Gold', '#E3B7A8', '42mm Aluminium', '64GB', 46900.00),

-- Apple Watch Ultra 2
(33, 17, 'AWU2-49MM-NATURAL', 'Natural Titanium', '#9E978E', '49mm Titanium', '64GB', 89900.00),
(34, 17, 'AWU2-49MM-BLACK', 'Black Titanium', '#1C1B1F', '49mm Titanium', '64GB', 89900.00),

-- AirPods Pro 2
(35, 19, 'APP2-USBC-WHITE', 'White', '#F5F5F7', 'Standard', 'H2 Chip', 24900.00),

-- AirPods 4 ANC
(36, 20, 'AP4-ANC-WHITE', 'White', '#F5F5F7', 'Standard', 'H2 Chip', 17900.00),

-- Apple Vision Pro
(37, 22, 'AVP-256GB-SOLO', 'Light Seal / Solo Band', '#E3E4E5', '256GB', '16GB', 349900.00),
(38, 22, 'AVP-512GB-SOLO', 'Light Seal / Solo Band', '#E3E4E5', '512GB', '16GB', 369900.00),

-- Apple TV 4K
(39, 23, 'ATV4K-128GB-ETHERNET', 'Black', '#0B0B0D', '128GB', '4GB', 16900.00),

-- AirTag 4-Pack
(40, 27, 'AIRTAG-4PK', 'White / Silver', '#F5F5F7', '4-Pack', 'U1 Chip', 11900.00),

-- Apple Pencil Pro
(41, 28, 'PENCIL-PRO-WHITE', 'White', '#F5F5F7', 'One Size', 'Bluetooth 5.3', 11900.00),

-- Studio Display 27
(42, 31, 'STUDIO-DISP-STD-STAND', 'Silver', '#E3E4E5', 'Standard Glass', 'A13 Bionic', 159900.00)
ON DUPLICATE KEY UPDATE price_inr=VALUES(price_inr);

-- 6. Product Images (Crisp high-resolution official Apple visual assets)
INSERT INTO product_images (product_id, variant_id, image_url, alt_text, is_primary, display_order) VALUES
-- iPhone 16 Pro Max
(1, 1, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-1-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 16 Pro Max Desert Titanium front and back', TRUE, 1),
(1, 1, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 16 Pro Max camera detail', FALSE, 2),
(1, 1, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-3-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 16 Pro Max titanium profile', FALSE, 3),

-- iPhone 16 Pro
(2, 7, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 16 Pro Natural Titanium', TRUE, 1),
(2, 7, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 16 Pro Black Titanium', FALSE, 2),

-- iPhone 16
(3, 12, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 16 Ultramarine finish', TRUE, 1),
(3, 12, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPhone 16 dual camera and glass', FALSE, 2),

-- MacBook Pro 14
(6, 18, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-select-202410?wid=904&hei=840&fmt=jpeg&qlt=95', 'MacBook Pro 14 Space Black open display', TRUE, 1),
(6, 18, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-gallery1-202410?wid=4000&hei=3074&fmt=jpeg&qlt=95', 'MacBook Pro 14 keyboard and Liquid Retina XDR', FALSE, 2),

-- MacBook Air 13 M3
(7, 21, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-air-midnight-select-20240210?wid=904&hei=840&fmt=jpeg&qlt=95', 'MacBook Air 13 Midnight perspective', TRUE, 1),
(7, 21, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-air-midnight-gallery1-202402?wid=4000&hei=3074&fmt=jpeg&qlt=95', 'MacBook Air 13 profile edge view', FALSE, 2),

-- Mac mini M4
(9, 25, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-mini-select-202410?wid=904&hei=840&fmt=jpeg&qlt=95', 'Mac mini M4 front view with audio jack and USB-C', TRUE, 1),

-- iPad Pro 13 M4
(12, 27, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-model-select-gallery-1-202405?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPad Pro 13-inch Space Black with Ultra Retina XDR', TRUE, 1),
(12, 27, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-model-select-gallery-2-202405?wid=5120&hei=2880&fmt=p-jpg&qlt=95', 'iPad Pro ultra thin 5.1mm profile', FALSE, 2),

-- Apple Watch Series 10
(16, 30, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/s10-case-unselect-gallery-1-202409?wid=5120&hei=3280&fmt=p-jpg&qlt=95', 'Apple Watch Series 10 Jet Black with Sport Band', TRUE, 1),

-- Apple Watch Ultra 2
(17, 33, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ultra-case-unselect-gallery-1-202409?wid=5120&hei=3280&fmt=p-jpg&qlt=95', 'Apple Watch Ultra 2 Black Titanium with Ocean Band', TRUE, 1),

-- AirPods Pro 2
(19, 35, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=95', 'AirPods Pro 2 with USB-C MagSafe case and eartips', TRUE, 1),

-- AirPods 4
(20, 36, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-anc-select-202409?wid=1000&hei=1000&fmt=jpeg&qlt=95', 'AirPods 4 ANC wireless case open', TRUE, 1),

-- Apple Vision Pro
(22, 37, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/apple-vision-pro-select-202401?wid=1000&hei=1000&fmt=jpeg&qlt=95', 'Apple Vision Pro front headset and Light Seal', TRUE, 1),

-- Apple TV 4K
(23, 39, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/apple-tv-4k-hero-select-202210?wid=1000&hei=1000&fmt=jpeg&qlt=95', 'Apple TV 4K unit with Siri Remote', TRUE, 1),

-- AirTag 4-Pack
(27, 40, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airtag-4pack-select-202104?wid=1000&hei=1000&fmt=jpeg&qlt=95', 'AirTag 4-Pack bundle', TRUE, 1),

-- Apple Pencil Pro
(28, 41, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MX2D3?wid=1000&hei=1000&fmt=jpeg&qlt=95', 'Apple Pencil Pro white finish', TRUE, 1),

-- Studio Display
(31, 42, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/studio-display-gallery-1-202203?wid=4000&hei=3074&fmt=jpeg&qlt=95', 'Studio Display with tilt-adjustable stand', TRUE, 1)
ON DUPLICATE KEY UPDATE alt_text=VALUES(alt_text);

-- 7. Product Specifications (Verified Apple India Technical Specifications for Comparison & Details)
INSERT INTO product_specifications (product_id, display_spec, chipset_spec, camera_spec, battery_spec, storage_options, memory_options, colours_spec, connectivity_spec, dimensions_spec, weight_spec, special_features) VALUES
(1, '6.9-inch Super Retina XDR OLED, 2868x1320 at 460 ppi, ProMotion 120Hz, Always-On, 2000 nits', 'A18 Pro chip, 6-core CPU (2 perf + 4 eff), 6-core GPU, 16-core Neural Engine', '48MP Fusion, 48MP Ultra Wide, 12MP 5x Telephoto, 4K 120 fps Dolby Vision, Camera Control', 'Up to 33 hours video playback, MagSafe wireless charging up to 25W with 30W adapter', '256GB, 512GB, 1TB', '8GB Unified Memory', 'Desert Titanium, Natural Titanium, White Titanium, Black Titanium', '5G Sub-6, Wi-Fi 7 (802.11be), Bluetooth 5.3, Second-gen Ultra Wideband, USB-C (USB 3 up to 10Gb/s)', '163.0 x 77.6 x 8.25 mm', '227 grams', 'Camera Control button, Action button, Apple Intelligence, Grade 5 Titanium, Crash Detection, Emergency SOS'),
(2, '6.3-inch Super Retina XDR OLED, 2622x1206 at 460 ppi, ProMotion 120Hz, Always-On, 2000 nits', 'A18 Pro chip, 6-core CPU (2 perf + 4 eff), 6-core GPU, 16-core Neural Engine', '48MP Fusion, 48MP Ultra Wide, 12MP 5x Telephoto, 4K 120 fps Dolby Vision, Camera Control', 'Up to 27 hours video playback, MagSafe wireless charging up to 25W', '128GB, 256GB, 512GB, 1TB', '8GB Unified Memory', 'Desert Titanium, Natural Titanium, White Titanium, Black Titanium', '5G Sub-6, Wi-Fi 7 (802.11be), Bluetooth 5.3, Second-gen Ultra Wideband, USB-C (USB 3)', '149.6 x 71.5 x 8.25 mm', '199 grams', 'Camera Control, Action button, 5x Optical Zoom, ProMotion, Apple Intelligence, Titanium enclosure'),
(3, '6.1-inch Super Retina XDR OLED, 2556x1179 at 460 ppi, Dynamic Island, 2000 nits peak', 'A18 chip, 6-core CPU (2 perf + 4 eff), 5-core GPU, 16-core Neural Engine', '48MP Fusion with 2x Telephoto, 12MP Ultra Wide with Macro photography', 'Up to 22 hours video playback, MagSafe wireless charging up to 25W', '128GB, 256GB, 512GB', '8GB Unified Memory', 'Ultramarine, Teal, Pink, White, Black', '5G Sub-6, Wi-Fi 7 (802.11be), Bluetooth 5.3, Second-gen Ultra Wideband, USB-C (USB 2)', '147.6 x 71.6 x 7.80 mm', '170 grams', 'Camera Control, Action button, Apple Intelligence, Spatial Audio capture, Ceramic Shield front'),
(4, '6.7-inch Super Retina XDR OLED, 2796x1290 at 460 ppi, Dynamic Island, 2000 nits peak', 'A18 chip, 6-core CPU, 5-core GPU, 16-core Neural Engine', '48MP Fusion with 2x Telephoto, 12MP Ultra Wide', 'Up to 27 hours video playback, MagSafe wireless charging up to 25W', '128GB, 256GB, 512GB', '8GB Unified Memory', 'Ultramarine, Teal, Pink, White, Black', '5G Sub-6, Wi-Fi 7 (802.11be), Bluetooth 5.3, USB-C (USB 2)', '160.9 x 77.8 x 7.80 mm', '199 grams', 'Camera Control, Action button, Macro capability, Longest standard iPhone battery life'),
(5, '6.1-inch Super Retina XDR OLED, 2556x1179 at 460 ppi, Dynamic Island, 2000 nits peak', 'A16 Bionic chip, 6-core CPU, 5-core GPU, 16-core Neural Engine', '48MP Main with 2x Telephoto, 12MP Ultra Wide', 'Up to 20 hours video playback, MagSafe wireless charging up to 15W', '128GB, 256GB', '6GB RAM', 'Blue, Pink, Yellow, Green, Black', '5G Sub-6, Wi-Fi 6 (802.11ax), Bluetooth 5.3, USB-C (USB 2)', '147.6 x 71.6 x 7.80 mm', '171 grams', 'Dynamic Island, 48MP high-resolution camera, USB-C port, Color-infused back glass'),
(6, '14.2-inch Liquid Retina XDR, 3024x1964, 1,000 nits sustained, 1,600 nits peak HDR, ProMotion 120Hz', 'Apple M4 / M4 Pro / M4 Max chip, up to 16-core CPU and 40-core GPU, 16-core Neural Engine', '12MP Center Stage camera with Desk View, 1080p HD video', 'Up to 24 hours battery life, 72.4-watt-hour lithium-polymer battery, 70W/96W USB-C adapter', '512GB, 1TB, 2TB, 4TB', '16GB, 24GB, 36GB, 48GB Unified Memory', 'Space Black, Silver', 'Three Thunderbolt 5 (USB-C), HDMI port, SDXC card slot, Headphone jack, MagSafe 3', '312.6 x 221.2 x 15.5 mm', '1.60 kg', 'Liquid Retina XDR with nano-texture option, Thunderbolt 5, High-fidelity six-speaker system with force-cancelling woofers'),
(7, '13.6-inch Liquid Retina display with True Tone, 2560x1664 at 224 ppi, 500 nits brightness', 'Apple M3 chip, 8-core CPU (4 perf + 4 eff), 8-core/10-core GPU, 16-core Neural Engine', '1080p FaceTime HD camera with advanced image signal processor', 'Up to 18 hours battery life, 52.6-watt-hour battery, MagSafe 3 charging port', '256GB, 512GB, 1TB, 2TB', '16GB, 24GB Unified Memory', 'Midnight, Starlight, Space Grey, Silver', 'MagSafe 3, 3.5mm headphone jack, Two Thunderbolt / USB 4 ports, Wi-Fi 6E, Bluetooth 5.3', '304.1 x 215.0 x 11.3 mm', '1.24 kg', 'Silent fanless design, Support for up to two external displays with laptop lid closed, Four-speaker sound system'),
(12, '13.0-inch Ultra Retina XDR Tandem OLED, 2752x2064 at 264 ppi, 1,000 nits full screen, 1,600 nits peak HDR', 'Apple M4 chip, up to 10-core CPU, 10-core GPU with hardware ray tracing, 16-core Neural Engine', '12MP Wide rear camera with LiDAR Scanner, Landscape 12MP Center Stage front camera', 'Up to 10 hours surfing the web on Wi-Fi, 38.99-watt-hour battery', '256GB, 512GB, 1TB, 2TB', '8GB or 16GB Unified Memory', 'Space Black, Silver', 'Thunderbolt / USB 4, Smart Connector, Wi-Fi 6E, Bluetooth 5.3, Apple Pencil Pro hover', '281.6 x 215.5 x 5.1 mm', '579 grams', 'World’s thinnest Apple product at 5.1mm, Tandem OLED technology, Apple Pencil Pro support with haptics and barrel roll'),
(16, 'Always-On Retina LTPO3 OLED display, Wide-angle OLED with 40% brighter off-axis, up to 2000 nits', 'S10 SiP with 64-bit dual-core processor, 4-core Neural Engine', 'Front camera: None. Electrical heart sensor, third-gen optical heart sensor, depth gauge, water temp', 'Up to 18 hours normal use, up to 36 hours Low Power Mode, fast charge 0-80% in 30 mins', '64GB internal storage', 'Embedded 1GB', 'Jet Black, Rose Gold, Silver (Polished Titanium: Slate, Gold, Natural)', 'Wi-Fi 4 (802.11n), Bluetooth 5.3, Second-gen Ultra Wideband, LTE optional', '46 x 39 x 9.7 mm (46mm model)', '36.4 grams (Aluminium)', 'Thinnest Apple Watch at 9.7mm, Sleep apnea notifications, Depth gauge to 6m, Water temperature sensor, Media playback via speaker'),
(19, 'Custom high-excursion Apple driver, Custom high dynamic range amplifier, Adaptive EQ', 'Apple H2 headphone chip in earbuds, Apple U1 chip in MagSafe Charging Case', 'Dual beamforming microphones, Inward-facing microphone, Skin-detect sensor', 'Up to 6 hours listening time with ANC enabled, Up to 30 hours total with case', 'N/A', 'N/A', 'White', 'Bluetooth 5.3, USB-C connector on case, MagSafe and Qi wireless charging', 'Earbud: 30.9 x 21.8 x 24.0 mm, Case: 45.2 x 60.6 x 21.7 mm', 'Earbud: 5.3 g, Case: 50.8 g', 'Up to 2x more Active Noise Cancellation, Adaptive Audio, Conversation Awareness, Personalized Spatial Audio with dynamic head tracking, Hearing Test & Hearing Aid capabilities (FDA approved)'),
(22, 'Dual micro-OLED displays, 23 million pixels total, 92% DCI-P3, 90Hz/96Hz/100Hz refresh rates', 'Apple M2 chip (8-core CPU, 10-core GPU) + Apple R1 chip (12-millisecond latency)', 'Stereoscopic 3D camera system with 6.5 stereo megapixels, 2 high-res main cameras, 6 world-facing cameras, 4 eye-tracking cameras', 'Up to 2 hours general use, 2.5 hours video playback with external battery pack', '256GB, 512GB, 1TB', '16GB Unified Memory', 'Custom Aluminium alloy frame with Light Seal and Solo Knit Band', 'Wi-Fi 6 (802.11ax), Bluetooth 5.3, Ultra-low latency audio with AirPods Pro 2', 'Custom ergonomic curved glass and aluminium', '600–650 grams (varies by Light Seal and headband)', 'EyeSight exterior display, Precise iris biometrics via Optic ID, Spatial Audio with dynamic head tracking, Full 3D windowing environment with visionOS')
ON DUPLICATE KEY UPDATE display_spec=VALUES(display_spec), chipset_spec=VALUES(chipset_spec);

-- 8. Inventory (Stock levels for all variants)
INSERT INTO inventory (variant_id, stock_quantity, low_stock_threshold) VALUES
(1, 45, 5), (2, 30, 5), (3, 18, 5), (4, 40, 5), (5, 50, 5), (6, 35, 5),
(7, 60, 5), (8, 55, 5), (9, 25, 5), (10, 40, 5), (11, 45, 5),
(12, 80, 10), (13, 70, 10), (14, 30, 5), (15, 65, 5), (16, 90, 10), (17, 75, 10),
(18, 35, 5), (19, 20, 5), (20, 25, 5),
(21, 50, 5), (22, 40, 5), (23, 35, 5), (24, 30, 5),
(25, 60, 5), (26, 40, 5),
(27, 25, 5), (28, 20, 5), (29, 25, 5),
(30, 45, 5), (31, 50, 5), (32, 35, 5),
(33, 20, 3), (34, 25, 3),
(35, 120, 15), (36, 100, 15),
(37, 10, 2), (38, 8, 2),
(39, 40, 5), (40, 85, 10),
(41, 75, 10), (42, 15, 2)
ON DUPLICATE KEY UPDATE stock_quantity=VALUES(stock_quantity);
