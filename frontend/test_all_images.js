async function verifyAll() {
  console.log('=== VERIFYING LOCAL PRODUCT & CATEGORY ASSETS ===\n');

  // 1. Verify Fallback Asset
  try {
    const fallbackRes = await fetch('http://localhost:5173/images/fallback.svg');
    console.log(`[OK ] Fallback Asset (/images/fallback.svg): HTTP ${fallbackRes.status}`);
    if (fallbackRes.status !== 200) {
      console.error('FAILED: Fallback asset not returning HTTP 200');
      process.exit(1);
    }
  } catch (e) {
    console.error('FAILED to fetch fallback:', e.message);
    process.exit(1);
  }

  // 2. Verify all 10 Category SVGs
  const categories = [
    'iphone', 'mac', 'ipad', 'watch', 'airpods',
    'vision', 'tv-home', 'airtag', 'accessories', 'displays'
  ];
  console.log(`\nVerifying all ${categories.length} category SVGs on frontend:`);
  let catErrors = 0;
  for (const slug of categories) {
    const url = `http://localhost:5173/images/categories/${slug}.svg`;
    try {
      const res = await fetch(url);
      const ok = res.status === 200;
      if (!ok) catErrors++;
      console.log(`  [${ok ? 'OK ' : 'FAIL'}] /images/categories/${slug}.svg -> HTTP ${res.status}`);
    } catch (e) {
      catErrors++;
      console.log(`  [FAIL] /images/categories/${slug}.svg -> Error: ${e.message}`);
    }
  }

  // 3. Verify all 33 Product SVGs (especially all iPhone models)
  const productSlugs = [
    'iphone-16-pro-max', 'iphone-16-pro', 'iphone-16', 'iphone-16-plus', 'iphone-15', 'iphone-16e',
    'macbook-pro-14-m4', 'macbook-air-13-m3', 'macbook-air-15-m3', 'mac-mini-m4', 'imac-24-m4', 'mac-studio-m2-max',
    'ipad-pro-13-m4', 'ipad-air-11-m2', 'ipad-10th-gen', 'ipad-mini-a17-pro',
    'apple-watch-series-10', 'apple-watch-ultra-2', 'apple-watch-se',
    'airpods-pro-2-usb-c', 'airpods-4-anc', 'airpods-max-usb-c',
    'apple-vision-pro',
    'apple-tv-4k', 'homepod-2nd-gen', 'homepod-mini',
    'airtag-1-pack', 'airtag-4-pack',
    'apple-pencil-pro', 'magic-keyboard-touch-id', 'magic-mouse-usbc',
    'studio-display-27', 'pro-display-xdr'
  ];

  console.log(`\nVerifying all ${productSlugs.length} product local SVGs on frontend:`);
  let prodErrors = 0;
  for (const slug of productSlugs) {
    const url = `http://localhost:5173/images/products/${slug}.svg`;
    try {
      const res = await fetch(url);
      const ok = res.status === 200;
      if (!ok) {
        prodErrors++;
        console.log(`  [FAIL] /images/products/${slug}.svg -> HTTP ${res.status}`);
      } else {
        console.log(`  [OK ] /images/products/${slug}.svg -> HTTP 200`);
      }
    } catch (e) {
      prodErrors++;
      console.log(`  [FAIL] /images/products/${slug}.svg -> Error: ${e.message}`);
    }
  }

  console.log('\n========================================');
  console.log(`CATEGORY CHECK: ${categories.length - catErrors}/${categories.length} OK (${catErrors} failures)`);
  console.log(`PRODUCT CHECK:  ${productSlugs.length - prodErrors}/${productSlugs.length} OK (${prodErrors} failures)`);
  console.log('========================================\n');

  if (catErrors > 0 || prodErrors > 0) {
    process.exit(1);
  } else {
    console.log('SUCCESS: ALL PRODUCT & CATEGORY ASSETS LOADED SUCCESSFULLY (HTTP 200)!');
  }
}

verifyAll();
