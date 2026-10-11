async function verifyAll() {
  console.log('=== VERIFYING CATEGORY IMAGES & PRODUCT IMAGES ===\n');

  // 1. Verify Fallback Asset
  try {
    const fallbackRes = await fetch('http://localhost:5173/images/fallback.svg');
    console.log(`Fallback Asset (/images/fallback.svg): HTTP ${fallbackRes.status} (${fallbackRes.headers.get('content-type')})`);
    if (fallbackRes.status !== 200) {
      console.error('FAILED: Fallback asset not returning HTTP 200');
      process.exit(1);
    }
  } catch (e) {
    console.error('FAILED to fetch fallback:', e);
    process.exit(1);
  }

  // 2. Fetch Categories from Backend API
  const catApiRes = await fetch('http://localhost:8080/api/categories');
  const catData = await catApiRes.json();
  const categories = catData.data || [];
  console.log(`\nRetrieved ${categories.length} categories from API:`);

  let catErrors = 0;
  for (const cat of categories) {
    let testUrl = cat.imageUrl.startsWith('http') ? cat.imageUrl : `http://localhost:5173${cat.imageUrl}`;
    try {
      const res = await fetch(testUrl);
      const ok = res.status === 200;
      if (!ok) catErrors++;
      console.log(`  [${ok ? 'OK ' : 'FAIL'}] ${cat.name} (${cat.slug}): ${cat.imageUrl} -> HTTP ${res.status}`);
    } catch (e) {
      catErrors++;
      console.log(`  [FAIL] ${cat.name} (${cat.slug}): ${cat.imageUrl} -> Error: ${e.message}`);
    }
  }

  // 3. Fetch Products from Backend API
  const prodApiRes = await fetch('http://localhost:8080/api/products?limit=100');
  const prodData = await prodApiRes.json();
  const products = prodData.data?.content || [];
  console.log(`\nRetrieved ${products.length} products from API:`);

  let prodErrors = 0;
  for (const prod of products) {
    let testUrl = prod.primaryImageUrl?.startsWith('http') ? prod.primaryImageUrl : `http://localhost:5173${prod.primaryImageUrl}`;
    try {
      const res = await fetch(testUrl);
      const ok = res.status === 200;
      if (!ok) {
        prodErrors++;
        console.log(`  [FAIL] Product ID ${prod.id}: "${prod.name}" primaryImage: ${prod.primaryImageUrl} -> HTTP ${res.status}`);
      } else {
        console.log(`  [OK ] Product ID ${prod.id}: "${prod.name}" -> HTTP 200`);
      }
    } catch (e) {
      prodErrors++;
      console.log(`  [FAIL] Product ID ${prod.id}: "${prod.name}" primaryImage: ${prod.primaryImageUrl} -> Error: ${e.message}`);
    }
  }

  console.log('\n========================================');
  console.log(`CATEGORY CHECK: ${categories.length - catErrors}/${categories.length} OK (${catErrors} failures)`);
  console.log(`PRODUCT CHECK:  ${products.length - prodErrors}/${products.length} OK (${prodErrors} failures)`);
  console.log('========================================\n');

  if (catErrors > 0 || prodErrors > 0) {
    process.exit(1);
  } else {
    console.log('SUCCESS: ALL CATEGORY AND PRODUCT IMAGES LOADED SUCCESSFULLY (HTTP 200)!');
  }
}

verifyAll();
