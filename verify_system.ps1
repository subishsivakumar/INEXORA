# Complete System Verification Script for Apple Product
$ErrorActionPreference = "Stop"

Write-Host "======================================================"
Write-Host "   APPLE PRODUCT — END-TO-END VERIFICATION SUITE       "
Write-Host "======================================================"

$frontendUrl = "http://localhost:5173"
$backendUrl = "http://localhost:8080"
$testTimestamp = (Get-Date).ToString("yyyyMMddHHmmss")
$testEmail = "shopper_$testTimestamp@appleproduct.store"
$testPassword = "Customer@Password2026"

# Test 1: Frontend Server Check
Write-Host ""
Write-Host "[TEST 1] Verifying Frontend Dev Server ($frontendUrl)..."
$fe = Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing -TimeoutSec 10
if ($fe.StatusCode -eq 200) {
    Write-Host "  -> PASS: Frontend responds with HTTP 200 OK"
} else {
    Write-Error "  -> FAIL: Frontend returned $($fe.StatusCode)"
}

# Test 2: Categories Retrieval
$catUrl = "$backendUrl/api/categories"
Write-Host ""
Write-Host "[TEST 2] Verifying Categories API ($catUrl)..."
$categories = Invoke-RestMethod -Uri $catUrl -Method Get
Write-Host "  -> PASS: Retrieved $($categories.Count) categories:"
foreach ($cat in $categories) {
    Write-Host "     - $($cat.name) ($($cat.slug))"
}

# Test 3: Products Retrieval & Search
$prodUrl = "$backendUrl/api/products?page=0&size=10"
Write-Host ""
Write-Host "[TEST 3] Verifying Products API ($prodUrl)..."
$products = Invoke-RestMethod -Uri $prodUrl -Method Get
Write-Host "  -> PASS: Retrieved $($products.content.Count) products on page 0 (Total: $($products.totalElements))"

$searchUrl = "$backendUrl/api/products?search=iPhone"
Write-Host ""
Write-Host "[TEST 3B] Searching for 'iPhone' ($searchUrl)..."
$searchRes = Invoke-RestMethod -Uri $searchUrl -Method Get
Write-Host "  -> PASS: Found $($searchRes.totalElements) matching products"

# Test 4: Product Detail
$detailUrl = "$backendUrl/api/products/iphone-16-pro"
Write-Host ""
Write-Host "[TEST 4] Fetching Product Details for 'iphone-16-pro' ($detailUrl)..."
$iphone = Invoke-RestMethod -Uri $detailUrl -Method Get
Write-Host "  -> PASS: Name: $($iphone.name)"
Write-Host "     Base Price: INR $($iphone.basePrice)"
Write-Host "     Variants count: $($iphone.variants.Count)"
Write-Host "     Specifications count: $($iphone.specifications.Count)"

# Test 5: Side-by-Side Comparison API
$compUrl = "$backendUrl/api/products/compare?ids=1,2"
Write-Host ""
Write-Host "[TEST 5] Verifying Product Comparison API ($compUrl)..."
$comp = Invoke-RestMethod -Uri $compUrl -Method Get
Write-Host "  -> PASS: Compared $($comp.products.Count) products side-by-side with $($comp.attributes.Count) attributes"

# Test 6: User Registration
$regUrl = "$backendUrl/api/auth/register"
Write-Host ""
Write-Host "[TEST 6] Registering new user '$testEmail' ($regUrl)..."
$regBody = @{
    fullName = "Test Shopper $testTimestamp"
    email = $testEmail
    password = $testPassword
    confirmPassword = $testPassword
} | ConvertTo-Json

$regResp = Invoke-RestMethod -Uri $regUrl -Method Post -ContentType "application/json" -Body $regBody
$token = $regResp.token
Write-Host "  -> PASS: Registered successfully! User ID: $($regResp.user.id), Token issued."

# Test 7: User Profile (/api/auth/me)
$meUrl = "$backendUrl/api/auth/me"
Write-Host ""
Write-Host "[TEST 7] Verifying Authenticated Profile ($meUrl)..."
$authHeaders = @{ Authorization = "Bearer $token" }
$me = Invoke-RestMethod -Uri $meUrl -Method Get -Headers $authHeaders
Write-Host "  -> PASS: Authenticated user: $($me.fullName) ($($me.email)) [Role: $($me.role)]"

# Test 8: Cart Management
$cartItemUrl = "$backendUrl/api/cart/items"
$varId = $iphone.variants[0].id
Write-Host ""
Write-Host "[TEST 8] Adding Variant $varId to Cart ($cartItemUrl)..."
$cartAddBody = @{
    variantId = $varId
    quantity = 1
} | ConvertTo-Json

$cart1 = Invoke-RestMethod -Uri $cartItemUrl -Method Post -ContentType "application/json" -Headers $authHeaders -Body $cartAddBody
Write-Host "  -> PASS: Added item to cart. Total items: $($cart1.totalQuantity), Subtotal: INR $($cart1.subtotal)"

$cartItemId = $cart1.items[0].id
$updateItemUrl = "$backendUrl/api/cart/items/$cartItemId"
Write-Host ""
Write-Host "[TEST 8B] Updating quantity to 2 for Cart Item $cartItemId ($updateItemUrl)..."
$cartUpdateBody = @{
    quantity = 2
} | ConvertTo-Json
$cart2 = Invoke-RestMethod -Uri $updateItemUrl -Method Put -ContentType "application/json" -Headers $authHeaders -Body $cartUpdateBody
Write-Host "  -> PASS: Updated quantity. Total items: $($cart2.totalQuantity), Subtotal: INR $($cart2.subtotal)"

# Test 9: Wishlist Management
$iphoneId = $iphone.id
$wishUrl = "$backendUrl/api/wishlist/$iphoneId"
Write-Host ""
Write-Host "[TEST 9] Adding Product ID $iphoneId to Wishlist ($wishUrl)..."
$wishResp = Invoke-RestMethod -Uri $wishUrl -Method Post -Headers $authHeaders
Write-Host "  -> PASS: Added to wishlist. Total items: $($wishResp.items.Count)"

# Test 10: Demo Checkout & Order Placement
$ordersUrl = "$backendUrl/api/orders"
Write-Host ""
Write-Host "[TEST 10] Placing Demonstration Order ($ordersUrl)..."
$orderBody = @{
    shippingFullName = "Test Shopper"
    shippingPhone = "+91 98765 43210"
    shippingAddressLine1 = "Level 5, Apple Premium Mall"
    shippingAddressLine2 = "Bandra Kurla BKC"
    shippingCity = "Mumbai"
    shippingState = "Maharashtra"
    shippingPostalCode = "400051"
    shippingCountry = "India"
    paymentMethod = "DEMO_CARD"
    notes = "Deliver between 10am - 4pm"
} | ConvertTo-Json

$order = Invoke-RestMethod -Uri $ordersUrl -Method Post -ContentType "application/json" -Headers $authHeaders -Body $orderBody
Write-Host "  -> PASS: Order placed successfully!"
Write-Host "     Order Number: $($order.orderNumber)"
Write-Host "     Total Amount: INR $($order.totalAmount)"
Write-Host "     Status: $($order.status)"
Write-Host "     Items count: $($order.items.Count)"

# Test 11: Order History Retrieval
Write-Host ""
Write-Host "[TEST 11] Fetching Customer Order History ($ordersUrl)..."
$ordersList = Invoke-RestMethod -Uri $ordersUrl -Method Get -Headers $authHeaders
Write-Host "  -> PASS: Retrieved $($ordersList.totalElements) order(s) for customer"

# Test 12: Admin Authentication & Management
$loginUrl = "$backendUrl/api/auth/login"
Write-Host ""
Write-Host "[TEST 12] Authenticating as Admin (admin@appleproduct.store)..."
$adminLoginBody = @{
    email = "admin@appleproduct.store"
    password = "Customer@Password2026"
} | ConvertTo-Json

$adminAuth = Invoke-RestMethod -Uri $loginUrl -Method Post -ContentType "application/json" -Body $adminLoginBody
$adminToken = $adminAuth.token
$adminHeaders = @{ Authorization = "Bearer $adminToken" }
Write-Host "  -> PASS: Admin logged in! User: $($adminAuth.user.fullName) [Role: $($adminAuth.user.role)]"

Write-Host ""
Write-Host "[TEST 12B] Admin querying all system orders ($ordersUrl)..."
$adminOrders = Invoke-RestMethod -Uri $ordersUrl -Method Get -Headers $adminHeaders
Write-Host "  -> PASS: Admin successfully accessed orders stream (Count: $($adminOrders.totalElements))"

Write-Host ""
Write-Host "======================================================"
Write-Host "   ALL 12 INTEGRATION TESTS PASSED SUCCESSFULLY!       "
Write-Host "======================================================"
