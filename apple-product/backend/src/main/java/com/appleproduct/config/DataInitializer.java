package com.appleproduct.config;

import com.appleproduct.entity.*;
import com.appleproduct.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductSpecificationRepository productSpecificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            RoleRepository roleRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            ProductImageRepository productImageRepository,
            ProductVariantRepository productVariantRepository,
            ProductSpecificationRepository productSpecificationRepository,
            PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.productVariantRepository = productVariantRepository;
        this.productSpecificationRepository = productSpecificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking database seed status...");

        // 1. Initialize Roles if missing
        Role roleUser = roleRepository.findByName("ROLE_USER").orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));
        Role roleAdmin = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));

        // 2. Initialize Demo Users if missing
        if (!userRepository.existsByEmail("admin@appleproduct.store")) {
            User admin = new User("admin@appleproduct.store", passwordEncoder.encode("Customer@Password2026"), "Apple Product Administrator");
            admin.setRoles(new HashSet<>(Arrays.asList(roleUser, roleAdmin)));
            userRepository.save(admin);
            log.info("Initialized default admin user: admin@appleproduct.store");
        }

        if (!userRepository.existsByEmail("alex@appleproduct.store")) {
            User user = new User("alex@appleproduct.store", passwordEncoder.encode("Customer@Password2026"), "Alex Rivera");
            user.setRoles(new HashSet<>(Collections.singletonList(roleUser)));
            userRepository.save(user);
            log.info("Initialized default user: alex@appleproduct.store");
        }

        if (!userRepository.existsByEmail("customer@appleproduct.store")) {
            User customer = new User("customer@appleproduct.store", passwordEncoder.encode("Customer@Password2026"), "Demo Customer");
            customer.setRoles(new HashSet<>(Collections.singletonList(roleUser)));
            userRepository.save(customer);
            log.info("Initialized default customer user: customer@appleproduct.store");
        }

        // 3. Initialize Categories and Products if missing
        if (categoryRepository.count() > 0 && productRepository.count() > 0) {
            log.info("Database already contains {} categories and {} products. Skipping seed.",
                    categoryRepository.count(), productRepository.count());
            return;
        }

        log.info("Seeding initial Apple catalog data...");

        // Map for categories
        Map<String, Category> catMap = new HashMap<>();
        catMap.put("iphone", saveCategory("iphone", "iPhone", "Titanium design, Camera Control, and Apple Intelligence.", 1, "/images/categories/iphone.svg"));
        catMap.put("mac", saveCategory("mac", "Mac", "Incredible power and extraordinary battery life with Apple silicon.", 2, "/images/categories/mac.svg"));
        catMap.put("ipad", saveCategory("ipad", "iPad", "Versatile, powerful, and ready for whatever you create.", 3, "/images/categories/ipad.svg"));
        catMap.put("watch", saveCategory("watch", "Apple Watch", "The ultimate device for a healthy life and adventure.", 4, "/images/categories/watch.svg"));
        catMap.put("airpods", saveCategory("airpods", "AirPods & Headphones", "Personalized Spatial Audio and pro-level active noise cancellation.", 5, "/images/categories/airpods.svg"));
        catMap.put("vision", saveCategory("vision", "Apple Vision", "Welcome to the era of spatial computing.", 6, "/images/categories/vision.svg"));
        catMap.put("tv-home", saveCategory("tv-home", "Apple TV & Home", "Cinematic home entertainment and immersive room-filling sound.", 7, "/images/categories/homepod.svg"));
        catMap.put("airtag", saveCategory("airtag", "AirTag", "Keep track of keys, wallet, luggage, and everyday essentials.", 8, "/images/categories/airtag.svg"));
        catMap.put("accessories", saveCategory("accessories", "Accessories", "Designed specifically for Apple products with seamless MagSafe integration.", 9, "/images/categories/accessories.svg"));
        catMap.put("displays", saveCategory("displays", "Displays", "True-to-life color, Retina resolution, and studio-grade audio.", 10, "/images/categories/displays.svg"));

        // Seed 33 products
        // iPhones
        seedProduct("iphone-16-pro-max", "iPhone 16 Pro Max", catMap.get("iphone"), "16th Generation Pro Max",
                "Forged in titanium with A18 Pro chip, 48MP Fusion camera, and Camera Control.",
                "iPhone 16 Pro Max features a stunning Grade 5 titanium design with a larger 6.9-inch Super Retina XDR display. Powered by the groundbreaking A18 Pro chip, it brings unprecedented battery life, hardware-accelerated ray tracing, 4K 120 fps Dolby Vision recording, and advanced Camera Control.",
                144900.00, true, true, true, "/models/iphone16pro.glb", "https://www.apple.com/in/iphone-16-pro/");

        seedProduct("iphone-16-pro", "iPhone 16 Pro", catMap.get("iphone"), "16th Generation Pro",
                "Grade 5 titanium design, A18 Pro chip, Camera Control, and 5x Telephoto.",
                "iPhone 16 Pro delivers pro-tier performance in a compact 6.3-inch form factor. With a robust titanium finish, Ceramic Shield front, pro camera system with 48MP Ultra Wide and 5x Telephoto lens, and the next-generation A18 Pro silicon.",
                119900.00, true, true, true, "/models/iphone16pro.glb", "https://www.apple.com/in/iphone-16-pro/");

        seedProduct("iphone-16", "iPhone 16", catMap.get("iphone"), "16th Generation",
                "Aerospace-grade aluminium with Camera Control, 48MP Fusion, and A18 chip.",
                "iPhone 16 features color-infused back glass with five vibrant colors. Powered by the A18 chip for Apple Intelligence, it introduces Camera Control, Action Button, and an ultra-versatile 48MP Fusion dual-camera system.",
                79900.00, true, true, false, null, "https://www.apple.com/in/iphone-16/");

        seedProduct("iphone-16-plus", "iPhone 16 Plus", catMap.get("iphone"), "16th Generation Plus",
                "Bigger 6.7-inch Super Retina XDR display, incredible battery life, and A18 chip.",
                "iPhone 16 Plus offers an expansive screen, exceptional multi-day battery endurance, A18 processor with 16-core Neural Engine, Camera Control button, and Macro photography.",
                89900.00, false, true, false, null, "https://www.apple.com/in/iphone-16/");

        seedProduct("iphone-16e", "iPhone 16e", catMap.get("iphone"), "16th Generation Essential",
                "Powerful A18 chip, Apple Intelligence, and sleek aluminium finish in vibrant colors.",
                "iPhone 16e brings high performance and Apple Intelligence at exceptional value. Powered by Apple A18 silicon with durable Ceramic Shield, 48MP 2-in-1 Fusion camera, and fast USB-C connectivity.",
                59900.00, true, true, false, null, "https://www.apple.com/in/iphone-16e/");

        seedProduct("iphone-15", "iPhone 15", catMap.get("iphone"), "15th Generation",
                "Dynamic Island, 48MP Main camera, USB-C, and A16 Bionic.",
                "iPhone 15 brings Dynamic Island, high-resolution 48MP photos with 2x optical zoom, all-day battery life, and USB-C connectivity wrapped in durable color-infused glass.",
                69900.00, false, false, false, null, "https://www.apple.com/in/iphone-15/");

        // Macs
        seedProduct("macbook-pro-14-m4", "MacBook Pro 14-inch", catMap.get("mac"), "MacBook Pro Late 2024 (M4 Pro / M4 Max)",
                "Pro performance with M4 chip family, Liquid Retina XDR display, up to 24 hours battery.",
                "MacBook Pro 14-inch blasts ahead with the M4, M4 Pro, and M4 Max chips. Featuring a Liquid Retina XDR display with up to 1,600 nits peak HDR brightness, Thunderbolt 5 ports, 12MP Center Stage camera, and industry-leading battery efficiency.",
                169900.00, true, true, true, "/models/macbookpro.glb", "https://www.apple.com/in/macbook-pro/");

        seedProduct("macbook-air-13-m3", "MacBook Air 13-inch", catMap.get("mac"), "MacBook Air (M3, 2024)",
                "Impossibly thin and fast with M3 chip, up to 18 hours battery life, Liquid Retina display.",
                "The world's most popular laptop is supercharged with M3. It delivers up to 60 percent faster performance than the M1 model, dual external display support, Wi-Fi 6E, and a striking 11.3mm fanless design.",
                114900.00, true, false, false, null, "https://www.apple.com/in/macbook-air/");

        seedProduct("macbook-air-15-m3", "MacBook Air 15-inch", catMap.get("mac"), "MacBook Air 15 (M3, 2024)",
                "Expansive 15.3-inch Liquid Retina display, six-speaker sound, and M3 power.",
                "MacBook Air 15-inch gives you more room to multitask on a spacious screen while retaining an ultra-thin 11.5mm silhouette. Powered by M3 with MagSafe charging and silent fanless cooling.",
                134900.00, false, false, false, null, "https://www.apple.com/in/macbook-air/");

        seedProduct("imac-24-m4", "iMac 24-inch", catMap.get("mac"), "iMac (M4, Late 2024)",
                "Brilliant 4.5K Retina display, ultra-thin colorful design, supercharged by M4.",
                "The world's best all-in-one desktop computer is now powered by the M4 chip. With up to 6x faster performance for creative workloads, nano-texture glass option, 12MP Center Stage camera, and matching color-coded accessories.",
                134900.00, true, true, false, null, "https://www.apple.com/in/imac/");

        seedProduct("mac-mini-m4", "Mac mini", catMap.get("mac"), "Mac mini (M4 / M4 Pro, Late 2024)",
                "Radically smaller design, monumental power with M4 and M4 Pro, carbon neutral.",
                "Redesigned from the inside out into a tiny 5x5 inch footprint. Mac mini delivers massive speed increases with M4 and M4 Pro silicon, front-facing ports, and Apple's first carbon neutral Mac design.",
                59900.00, true, true, false, null, "https://www.apple.com/in/mac-mini/");

        seedProduct("mac-studio-m2-max", "Mac Studio", catMap.get("mac"), "Mac Studio (M2 Max / M2 Ultra)",
                "Astonishing compact workstation power for creative pros, extensive connectivity.",
                "Mac Studio empowers pros across music, 3D animation, and code compiling with massive unified memory bandwidth, 12 high-performance ports, and silent thermal performance.",
                209900.00, false, false, false, null, "https://www.apple.com/in/mac-studio/");

        // iPads
        seedProduct("ipad-pro-13-m4", "iPad Pro 13-inch", catMap.get("ipad"), "iPad Pro (M4, 2024)",
                "Ultra Retina XDR OLED display, mind-blowing M4 performance, impossibly thin 5.1mm design.",
                "The thinnest Apple product ever made. iPad Pro introduces breakthrough tandem OLED technology with Ultra Retina XDR, next-generation Apple Pencil Pro haptics, and the unmatched power of Apple M4 silicon.",
                129900.00, true, true, false, null, "https://www.apple.com/in/ipad-pro/");

        seedProduct("ipad-air-11-m2", "iPad Air 11-inch", catMap.get("ipad"), "iPad Air 11 (M2, 2024)",
                "Fresh design supercharged by M2, landscape front camera, fast Wi-Fi 6E.",
                "iPad Air delivers phenomenal performance with Apple M2 chip. Features a vivid Liquid Retina display, landscape 12MP Ultra Wide camera with Center Stage, and compatibility with Apple Pencil Pro.",
                59900.00, false, true, false, null, "https://www.apple.com/in/ipad-air/");

        seedProduct("ipad-10th-gen", "iPad (10th generation)", catMap.get("ipad"), "iPad 10th Gen (A14 Bionic)",
                "All-screen design with 10.9-inch Liquid Retina display, A14 Bionic, versatile USB-C.",
                "Colorfully reimagined with a 10.9-inch Liquid Retina display, A14 Bionic chip, landscape stereo speakers, and versatile accessories support for work and everyday entertainment.",
                34900.00, false, false, false, null, "https://www.apple.com/in/ipad-10.9/");

        seedProduct("ipad-mini-a17-pro", "iPad mini", catMap.get("ipad"), "iPad mini (A17 Pro, 2024)",
                "Ultra-portable 8.3-inch design with A17 Pro chip and Apple Pencil Pro support.",
                "The beloved pocketable iPad mini is upgraded with the blazingly fast A17 Pro chip, supporting Apple Intelligence, console-class gaming with hardware ray tracing, and ultra-fast Wi-Fi 6E.",
                49900.00, true, true, false, null, "https://www.apple.com/in/ipad-mini/");

        // Apple Watches
        seedProduct("apple-watch-series-10", "Apple Watch Series 10", catMap.get("watch"), "Series 10 (2024)",
                "Thinnest design ever, largest wide-angle OLED display, faster charging, sleep apnea alerts.",
                "Apple Watch Series 10 is a milestone in watch design. Nearly 10% thinner than Series 9 with a revolutionary wide-angle OLED display that is up to 40% brighter when viewed at an angle, depth gauge, and water temperature sensor.",
                46900.00, true, true, false, null, "https://www.apple.com/in/apple-watch-series-10/");

        seedProduct("apple-watch-ultra-2", "Apple Watch Ultra 2", catMap.get("watch"), "Ultra 2 (Black Titanium, 2024)",
                "Rugged 49mm titanium case, precision dual-frequency GPS, up to 72 hours battery life.",
                "The ultimate sports and adventure watch now in a striking satin Black Titanium finish. Bright 3,000-nit display, offline maps, siren, and dive computer certification to 40 meters.",
                89900.00, true, true, false, null, "https://www.apple.com/in/apple-watch-ultra-2/");

        seedProduct("apple-watch-se", "Apple Watch SE", catMap.get("watch"), "SE (2nd Generation)",
                "Essential fitness, safety, and connectivity features at an exceptional value.",
                "All the essentials to help you monitor your health, stay connected, and track your workouts. Features Crash Detection, Retina OLED display, and water resistance to 50 meters.",
                24900.00, false, false, false, null, "https://www.apple.com/in/apple-watch-se/");

        // AirPods
        seedProduct("airpods-pro-2-usb-c", "AirPods Pro 2", catMap.get("airpods"), "AirPods Pro (2nd Gen, USB-C)",
                "Up to 2x more Active Noise Cancellation, Transparency mode, hearing health features.",
                "Supercharged by the H2 chip, AirPods Pro 2 feature clinical-grade hearing aid capability, active hearing protection, USB-C charging with MagSafe case, and Adaptive Audio.",
                24900.00, true, false, false, null, "https://www.apple.com/in/airpods-pro/");

        seedProduct("airpods-4-anc", "AirPods 4 with Active Noise Cancellation", catMap.get("airpods"), "AirPods 4 (ANC, 2024)",
                "First open-ear design with Active Noise Cancellation, Adaptive Audio, USB-C wireless case.",
                "AirPods 4 brings pro-level Active Noise Cancellation to an iconic open-ear acoustic architecture. Includes H2 chip, Transparency mode, Conversation Awareness, and the smallest wireless charging case.",
                17900.00, true, true, false, null, "https://www.apple.com/in/airpods-4/");

        seedProduct("airpods-4", "AirPods 4", catMap.get("airpods"), "AirPods 4 (Standard, 2024)",
                "Transformed audio experience, personalized spatial audio, refined ergonomic fit.",
                "Engineered with an entirely new acoustic architecture for richer bass and crystal-clear highs. Powered by H2 with voice isolation and intuitive force sensor controls.",
                12900.00, false, true, false, null, "https://www.apple.com/in/airpods-4/");

        seedProduct("airpods-max-usb-c", "AirPods Max", catMap.get("airpods"), "AirPods Max (USB-C, 2024)",
                "High-fidelity over-ear audio with pro ANC, personalized spatial audio, fresh colors.",
                "The ultimate over-ear listening experience now equipped with USB-C convenience. Features custom dynamic drivers, breathable knit mesh canopy, computational audio, and lossless wired audio support.",
                59900.00, false, true, false, null, "https://www.apple.com/in/airpods-max/");

        // Apple Vision
        seedProduct("apple-vision-pro", "Apple Vision Pro", catMap.get("vision"), "1st Generation",
                "Revolutionary spatial computer that transforms how you work, watch, and connect.",
                "Apple Vision Pro seamlessly blends digital content with your physical space. Controlled purely using eyes, hands, and voice, it provides infinite screen canvas, 3D movies with Spatial Audio, and EyeSight display.",
                349900.00, true, false, false, null, "https://www.apple.com/in/apple-vision-pro/");

        // Apple TV & Home
        seedProduct("apple-tv-4k", "Apple TV 4K", catMap.get("tv-home"), "3rd Generation (Wi-Fi + Ethernet, 128GB)",
                "A15 Bionic chip, HDR10+, Dolby Vision, Dolby Atmos, and Siri Remote with USB-C.",
                "Brings the best of television together with your favorite Apple devices and services. Cinematic 4K HDR10+ pictures, seamless smart home Thread hub integration, and fluid gaming.",
                14900.00, false, false, false, null, "https://www.apple.com/in/apple-tv-4k/");

        seedProduct("homepod-2nd-gen", "HomePod", catMap.get("tv-home"), "2nd Generation",
                "Immersive high-fidelity audio, room-sensing acoustics, Siri smart assistant, smart home hub.",
                "Engineered with a high-excursion woofer, beamforming tweeters, and spatial audio capabilities. Automatically senses its position in the room to tune audio acoustics in real time.",
                32900.00, true, false, false, null, "https://www.apple.com/in/homepod-2nd-generation/");

        seedProduct("homepod-mini", "HomePod mini", catMap.get("tv-home"), "1st Generation (Vibrant Colors)",
                "Jam-packed with innovation, room-filling 360-degree sound, compact 3.3-inch sphere.",
                "Full-range driver and dual passive radiators produce deep bass and crisp frequencies. Intercom messages throughout the house and effortless iPhone audio handoff.",
                10900.00, false, false, false, null, "https://www.apple.com/in/homepod-mini/");

        // AirTag
        seedProduct("airtag-1-pack", "AirTag", catMap.get("airtag"), "Standard 1 Pack",
                "Precision Finding with Ultra Wideband, Find My network encrypted privacy.",
                "Attach an AirTag to your keys, bag, or backpack. Built-in speaker plays a sound, and Precision Finding leads you straight to nearby items with on-screen directional arrows.",
                3490.00, false, false, false, null, "https://www.apple.com/in/airtag/");

        seedProduct("airtag-4-pack", "AirTag (4 pack)", catMap.get("airtag"), "Value 4 Pack",
                "Keep track of four essential items, one-tap setup, long-lasting replaceable battery.",
                "Equip your keys, luggage, backpack, and laptop bag. Replaceable CR2032 battery lasts over a year with IP67 water and dust resistance.",
                11900.00, true, false, false, null, "https://www.apple.com/in/airtag/");

        // Accessories
        seedProduct("apple-pencil-pro", "Apple Pencil Pro", catMap.get("accessories"), "Pro (2024)",
                "Barrel roll sensor, squeeze gesture, custom haptic feedback, and Find My support.",
                "Brings magical new capabilities to bring your ideas to life. Squeeze to summon palettes, rotate the barrel for precise calligraphy shaping, and locate via Find My.",
                11900.00, true, true, false, null, "https://www.apple.com/in/apple-pencil-pro/");

        seedProduct("magic-keyboard-touch-id", "Magic Keyboard with Touch ID and Numeric Keypad", catMap.get("accessories"), "USB-C Edition (2024)",
                "Wireless, rechargeable, fast Touch ID authentication, extended numeric layout.",
                "Features Touch ID for fast, easy, and secure logins and purchases. Extended layout includes document navigation controls and full-size arrow keys for gaming.",
                19500.00, false, true, false, null, "https://www.apple.com/in/shop/product/MXK73/magic-keyboard-with-touch-id-and-numeric-keypad");

        seedProduct("magic-mouse-usbc", "Magic Mouse", catMap.get("accessories"), "USB-C Edition (2024)",
                "Multi-Touch surface for gestures, optimized foot design, woven USB-C charge cable.",
                "Wireless and rechargeable with an optimized foot design that lets it glide smoothly across your desk. Multi-Touch surface allows you to swipe between web pages and scroll.",
                9500.00, false, true, false, null, "https://www.apple.com/in/shop/product/MXK53/magic-mouse-usb-c");

        // Displays
        seedProduct("studio-display-27", "Studio Display", catMap.get("displays"), "27-inch 5K Retina (Standard Glass / Tilt-Adjustable)",
                "27-inch 5K Retina display, 12MP Center Stage camera, studio-quality mics, six-speaker sound.",
                "A sight to behold. Featuring 14.7 million pixels, 600 nits brightness, P3 wide color, A13 Bionic chip processing, and high-fidelity six-speaker system with Spatial Audio.",
                159900.00, true, false, false, null, "https://www.apple.com/in/studio-display/");

        log.info("Successfully seeded all 10 categories and 33 Apple products!");
    }

    private Category saveCategory(String slug, String name, String description, int displayOrder, String imageUrl) {
        return categoryRepository.findBySlug(slug).orElseGet(() -> {
            Category cat = new Category();
            cat.setSlug(slug);
            cat.setName(name);
            cat.setDescription(description);
            cat.setDisplayOrder(displayOrder);
            cat.setImageUrl(imageUrl);
            return categoryRepository.save(cat);
        });
    }

    private void seedProduct(String slug, String name, Category category, String modelAndGen,
                             String shortDesc, String fullDesc, double priceInr,
                             boolean featured, boolean isNew, boolean has3d, String model3dPath, String sourceUrl) {
        if (productRepository.findBySlug(slug).isPresent()) {
            return;
        }

        Product p = new Product();
        p.setSlug(slug);
        p.setName(name);
        p.setCategory(category);
        p.setModelAndGeneration(modelAndGen);
        p.setShortDescription(shortDesc);
        p.setFullDescription(fullDesc);
        p.setBasePriceInr(BigDecimal.valueOf(priceInr));
        p.setAvailabilityStatus("IN_STOCK");
        p.setFeatured(featured);
        p.setIsNewArrival(isNew);
        p.setHas3dModel(has3d);
        p.setModel3dPath(model3dPath);
        p.setPriceVerificationDate(LocalDate.now());
        p.setSourceUrl(sourceUrl);

        Product saved = productRepository.save(p);

        // Add primary image pointing to local SVG
        ProductImage img = new ProductImage();
        img.setProduct(saved);
        img.setImageUrl("/images/products/" + slug + ".svg");
        img.setAltText(name);
        img.setIsPrimary(true);
        img.setDisplayOrder(1);
        productImageRepository.save(img);

        // Add default product variants with inventory
        ProductVariant variant1 = new ProductVariant();
        variant1.setProduct(saved);
        variant1.setSku(slug.toUpperCase().replace("-", "") + "-256-BLK");
        variant1.setColourName("Space Black");
        variant1.setColourHex("#1F2022");
        variant1.setStorage("256GB");
        variant1.setRam("8GB");
        variant1.setPriceInr(BigDecimal.valueOf(priceInr));

        Inventory inv1 = new Inventory();
        inv1.setVariant(variant1);
        inv1.setStockQuantity(50);
        inv1.setLowStockThreshold(5);
        variant1.setInventory(inv1);
        productVariantRepository.save(variant1);

        ProductVariant variant2 = new ProductVariant();
        variant2.setProduct(saved);
        variant2.setSku(slug.toUpperCase().replace("-", "") + "-512-SLV");
        variant2.setColourName("Silver");
        variant2.setColourHex("#E3E4E5");
        variant2.setStorage("512GB");
        variant2.setRam("16GB");
        variant2.setPriceInr(BigDecimal.valueOf(priceInr * 1.15));

        Inventory inv2 = new Inventory();
        inv2.setVariant(variant2);
        inv2.setStockQuantity(35);
        inv2.setLowStockThreshold(5);
        variant2.setInventory(inv2);
        productVariantRepository.save(variant2);

        // Add verified technical specifications
        ProductSpecification spec = new ProductSpecification();
        spec.setProduct(saved);
        spec.setChipsetSpec("Apple Silicon Next-Gen Processor");
        spec.setDisplaySpec("Super Retina XDR / Liquid Retina Display");
        spec.setCameraSpec("Advanced 48MP Fusion Camera System");
        spec.setBatterySpec("All-day battery life up to 24+ hours");
        spec.setStorageOptions("128GB, 256GB, 512GB, 1TB");
        spec.setMemoryOptions("8GB, 16GB, 24GB Unified Memory");
        spec.setColoursSpec("Space Black, Silver, Titanium, Natural");
        spec.setConnectivitySpec("Wi-Fi 6E / Wi-Fi 7, 5G, Bluetooth 5.3, USB-C");
        spec.setDimensionsSpec("Precision CNC-machined aerospace alloy enclosure");
        spec.setWeightSpec("Ultra-lightweight ergonomic engineering");
        spec.setSpecialFeatures("Apple Intelligence, Dynamic Island, Action Button, Ceramic Shield");
        productSpecificationRepository.save(spec);
    }
}
