-- V5: Update 3D model configuration to only enable verified, authentic 3D assets
-- Only iPhone 16 Pro Max (id=1) and iPhone 16 Pro (id=2) have verified, authentic GLB 3D assets (/models/iphone.glb).
-- Disable 3D model flags for all other products (MacBook Pro, Apple Vision Pro, etc.) to present high-resolution image galleries instead of inaccurate geometric placeholders.

UPDATE products 
SET has_3d_model = TRUE, model_3d_path = '/models/iphone.glb' 
WHERE id IN (1, 2);

UPDATE products 
SET has_3d_model = FALSE, model_3d_path = NULL 
WHERE id NOT IN (1, 2);
