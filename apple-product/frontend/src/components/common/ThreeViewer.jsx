import React, { useState, useRef, Suspense, useMemo, useEffect, Component } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Center, useGLTF } from '@react-three/drei';
import { Loader2, RotateCcw, Play, Pause, ZoomIn, ZoomOut, AlertCircle, X, Sparkles } from 'lucide-react';

// Error Boundary to prevent 3D/WebGL failures from crashing the page
class ThreeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ThreeViewer WebGL/Render Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            minHeight: '420px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: '#171717',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(217, 185, 110, 0.2)',
            textAlign: 'center',
          }}
        >
          {this.props.fallbackImageUrl ? (
            <img
              src={this.props.fallbackImageUrl}
              alt=""
              style={{ maxHeight: '220px', maxWidth: '100%', objectFit: 'contain', marginBottom: '16px' }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/fallback.svg';
              }}
            />
          ) : (
            <AlertCircle size={36} style={{ color: '#D9B96E', marginBottom: '12px' }} />
          )}
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FFF8E7', marginBottom: '6px' }}>
            3D View Currently Unavailable
          </h4>
          <p style={{ fontSize: '13px', color: 'rgba(255, 248, 231, 0.65)', maxWidth: '380px', marginBottom: '16px' }}>
            Displaying high-resolution product photography gallery.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              Retry 3D View
            </button>
            {this.props.onClose && (
              <button
                onClick={this.props.onClose}
                className="btn-primary"
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                View Photo Gallery
              </button>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// 3D Model renderer using verified GLB assets with DRACO decoder support
function LoadedGLBModel({ modelUrl = '/models/iphone.glb', autoRotate = true }) {
  const { scene } = useGLTF(modelUrl, '/draco/');
  const groupRef = useRef();

  // Clone scene to prevent memory leaks and state sharing across components
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    // Ensure all meshes cast/receive shadows and have proper material depth
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.roughness = Math.min(child.material.roughness, 0.4);
          child.material.envMapIntensity = 1.2;
        }
      }
    });
    return clone;
  }, [scene]);

  // Gentle turntable rotation when enabled
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <Center>
        <primitive object={clonedScene} scale={0.045} />
      </Center>
    </group>
  );
}

// Helper to manipulate camera distance from overlay buttons
function CameraZoomController({ zoomDelta, onZoomHandled }) {
  const { camera } = useThree();

  useEffect(() => {
    if (zoomDelta !== 0) {
      const newZ = Math.min(Math.max(camera.position.z - zoomDelta * 0.5, 2.5), 7.5);
      camera.position.z = newZ;
      camera.updateProjectionMatrix();
      onZoomHandled();
    }
  }, [zoomDelta, camera, onZoomHandled]);

  return null;
}

export default function ThreeViewer({
  modelUrl = '/models/iphone.glb',
  productName = 'Apple Product',
  fallbackImageUrl,
  onClose,
}) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomDelta, setZoomDelta] = useState(0);
  const controlsRef = useRef();

  // Respect user's reduced-motion preference
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAutoRotate(false);
    }
  }, []);

  function handleResetView() {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }

  function handleZoomIn() {
    setZoomDelta(1);
  }

  function handleZoomOut() {
    setZoomDelta(-1);
  }

  return (
    <ThreeErrorBoundary fallbackImageUrl={fallbackImageUrl} onClose={onClose}>
      <div
        style={{
          width: '100%',
          height: '460px',
          position: 'relative',
          backgroundColor: '#171717',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #262626 0%, #171717 100%)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid rgba(217, 185, 110, 0.25)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Top Control Bar: Status Badge and Close Button */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(23, 23, 23, 0.85)',
              backdropFilter: 'blur(12px)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              color: '#FFF8E7',
              border: '1px solid rgba(217, 185, 110, 0.3)',
              pointerEvents: 'auto',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#D9B96E',
                display: 'inline-block',
                boxShadow: '0 0 8px rgba(217, 185, 110, 0.8)',
              }}
            />
            <span style={{ fontWeight: 600, color: '#D9B96E' }}>Interactive 3D</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span style={{ opacity: 0.85 }}>Drag to rotate 360° • Pinch to zoom</span>
          </div>

          {/* Close / Return to Gallery Button */}
          {onClose && (
            <button
              onClick={onClose}
              title="Close 3D View and return to photos"
              style={{
                backgroundColor: 'rgba(23, 23, 23, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(217, 185, 110, 0.3)',
                color: '#FFF8E7',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                pointerEvents: 'auto',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Floating Action Controls on Bottom-Right */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(23, 23, 23, 0.9)',
            backdropFilter: 'blur(14px)',
            padding: '6px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(217, 185, 110, 0.3)',
          }}
        >
          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause 360° turntable' : 'Play 360° turntable'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: autoRotate ? '#D9B96E' : 'transparent',
              color: autoRotate ? '#171717' : '#FFF8E7',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s',
            }}
          >
            {autoRotate ? <Pause size={12} /> : <Play size={12} />}
            <span>360°</span>
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            style={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              color: '#FFF8E7',
              cursor: 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ZoomIn size={14} />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              color: '#FFF8E7',
              cursor: 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ZoomOut size={14} />
          </button>

          {/* Reset View Button */}
          <button
            onClick={handleResetView}
            title="Reset to default view"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(217, 185, 110, 0.15)',
              color: '#FFF8E7',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>

        {/* 3D Canvas */}
        <Suspense
          fallback={
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                color: 'rgba(255, 248, 231, 0.7)',
              }}
            >
              {fallbackImageUrl ? (
                <img
                  src={fallbackImageUrl}
                  alt={productName}
                  style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain', opacity: 0.7 }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/fallback.svg';
                  }}
                />
              ) : (
                <Loader2 size={32} color="#D9B96E" style={{ animation: 'spin 1s linear infinite' }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFF8E7' }}>
                <Loader2 size={14} color="#D9B96E" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Loading 3D asset ({productName})...</span>
              </div>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 4.4], fov: 42 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Professional Apple Studio Lighting */}
            <ambientLight intensity={0.9} />
            {/* Key light */}
            <directionalLight position={[5, 9, 6]} intensity={2.2} color="#FFFFFF" castShadow />
            {/* Fill light */}
            <directionalLight position={[-6, 1, -4]} intensity={1.4} color="#E2E2EA" />
            {/* Top accent */}
            <directionalLight position={[0, 7, 1]} intensity={1.1} color="#FFFFFF" />
            {/* Bottom rim to illuminate titanium edges */}
            <directionalLight position={[0, -6, 2]} intensity={0.8} color="#C4C4CF" />
            {/* Rear specular backlight */}
            <directionalLight position={[0, 2, -6]} intensity={1.2} color="#FFFFFF" />

            {/* Model with Centering */}
            <LoadedGLBModel modelUrl={modelUrl} autoRotate={autoRotate} />

            {/* Zoom helper */}
            <CameraZoomController zoomDelta={zoomDelta} onZoomHandled={() => setZoomDelta(0)} />

            {/* Smooth 360° Orbit Controls */}
            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              enableDamping={true}
              dampingFactor={0.06}
              minDistance={2.2}
              maxDistance={7.5}
            />
          </Canvas>
        </Suspense>
      </div>
    </ThreeErrorBoundary>
  );
}

// Preload verified model
useGLTF.preload('/models/iphone.glb', '/draco/');
