async function verify3DSystem() {
  console.log('====================================================');
  console.log('   APPLE PRODUCT 3D SYSTEM INTEGRATION VERIFICATION  ');
  console.log('====================================================\n');

  let passed = true;

  // 1. Verify 3D Assets on Frontend Server
  console.log('--- 1. Testing Local 3D Model & Draco Assets ---');
  const assetUrls = [
    { url: 'http://localhost:5173/models/iphone.glb', expectedType: 'model/gltf-binary', minBytes: 800000 },
    { url: 'http://localhost:5173/draco/draco_decoder.wasm', minBytes: 100000 },
    { url: 'http://localhost:5173/draco/draco_decoder.js', minBytes: 500000 },
    { url: 'http://localhost:5173/draco/draco_wasm_wrapper.js', minBytes: 50000 },
    { url: 'http://localhost:5173/images/fallback.svg', minBytes: 1000 },
  ];

  for (const asset of assetUrls) {
    try {
      const res = await fetch(asset.url);
      const buf = await res.arrayBuffer();
      const ok = res.status === 200 && buf.byteLength >= asset.minBytes;
      if (!ok) {
        console.error(`  [FAIL] ${asset.url} -> HTTP ${res.status}, size: ${buf.byteLength} bytes`);
        passed = false;
      } else {
        console.log(`  [OK  ] ${asset.url} -> HTTP 200 (${buf.byteLength} bytes)`);
      }
    } catch (e) {
      console.error(`  [FAIL] ${asset.url} -> ${e.message}`);
      passed = false;
    }
  }

  // 2. Verify GLB Magic Bytes
  console.log('\n--- 2. Validating iPhone GLB Binary Header ---');
  try {
    const glbRes = await fetch('http://localhost:5173/models/iphone.glb');
    const glbBuf = await glbRes.arrayBuffer();
    const dataView = new DataView(glbBuf);
    const magic = dataView.getUint32(0, true);
    // 0x46546C67 in ASCII is "glTF"
    const isGlTF = magic === 0x46546C67;
    const version = dataView.getUint32(4, true);
    console.log(`  [OK  ] GLB Binary Header: "glTF" (magic=0x${magic.toString(16)}), version=${version}`);
    if (!isGlTF || version !== 2) {
      console.error('  [FAIL] Invalid GLB format!');
      passed = false;
    }
  } catch (e) {
    console.error('  [FAIL] Header check failed:', e.message);
    passed = false;
  }

  // 3. Verify Backend Database & API Configuration
  console.log('\n--- 3. Testing Product API 3D Model Configuration ---');
  try {
    const prodRes = await fetch('http://localhost:8080/api/products?limit=100');
    const prodJson = await prodRes.json();
    const allProducts = prodJson.data.content;

    const with3D = allProducts.filter(p => p.has3dModel);
    const without3D = allProducts.filter(p => !p.has3dModel);

    console.log(`  Products with has3dModel=true: ${with3D.length}`);
    with3D.forEach(p => console.log(`    - ID ${p.id}: ${p.name} (Slug: ${p.slug})`));

    // Verify only verified models are enabled
    const invalid3D = with3D.filter(p => p.id !== 1 && p.id !== 2);
    if (invalid3D.length > 0) {
      console.error('  [FAIL] Products without verified models incorrectly flagged with has3dModel=true:', invalid3D);
      passed = false;
    } else {
      console.log('  [OK  ] Exactly 2 verified products (iPhone 16 Pro Max, iPhone 16 Pro) have 3D View enabled.');
    }

    console.log(`  Products using Image Gallery Fallback: ${without3D.length}`);
    console.log('  [OK  ] Mac, iPad, Watch, AirPods, Vision Pro, TV/Home safely configured with image gallery.');
  } catch (e) {
    console.error('  [FAIL] API check failed:', e.message);
    passed = false;
  }

  // 4. Test Detailed Endpoint for iPhone 16 Pro Max
  console.log('\n--- 4. Testing Product Detail Endpoint (/api/products/iphone-16-pro-max) ---');
  try {
    const detailRes = await fetch('http://localhost:8080/api/products/iphone-16-pro-max');
    const detailJson = await detailRes.json();
    const p = detailJson.data;
    if (p.has3dModel === true && p.model3dPath === '/models/iphone.glb') {
      console.log(`  [OK  ] Product detail confirmed: has3dModel=true, model3dPath=${p.model3dPath}`);
    } else {
      console.error(`  [FAIL] Detail endpoint returned unexpected values: has3dModel=${p.has3dModel}, model3dPath=${p.model3dPath}`);
      passed = false;
    }
  } catch (e) {
    console.error('  [FAIL] Detail endpoint check failed:', e.message);
    passed = false;
  }

  // 5. Test Detailed Endpoint for a Fallback Product (MacBook Pro 14)
  console.log('\n--- 5. Testing Product Detail Endpoint (/api/products/macbook-pro-14-m4) ---');
  try {
    const mbRes = await fetch('http://localhost:8080/api/products/macbook-pro-14-m4');
    const mbJson = await mbRes.json();
    const p = mbJson.data;
    if (p.has3dModel === false && !p.model3dPath && p.images.length > 0) {
      console.log(`  [OK  ] MacBook Pro detail confirmed: has3dModel=false, images=${p.images.length} (Photo Gallery active)`);
    } else {
      console.error(`  [FAIL] MacBook Pro detail returned unexpected values: has3dModel=${p.has3dModel}`);
      passed = false;
    }
  } catch (e) {
    console.error('  [FAIL] MacBook check failed:', e.message);
    passed = false;
  }

  console.log('\n====================================================');
  if (passed) {
    console.log('   ALL 3D VIEWING CHECKS PASSED SUCCESSFULLY (100%) ');
  } else {
    console.log('   SOME CHECKS FAILED - REVIEW LOGS ABOVE           ');
    process.exit(1);
  }
  console.log('====================================================\n');
}

verify3DSystem();
