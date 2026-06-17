'use client';

import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';

// Registry of all simulation engines
const ENGINE_REGISTRY = {
  'projectile3D': () => import('./projectile3D'),
  'pendulum2D': () => import('./pendulum2D'),
  // Add new engines here as they are built
};

// Higher-Order Component that loads the appropriate engine
const EngineLoader = forwardRef(({ config, controlValues, onTelemetryUpdate, isPremiumUnlocked }, ref) => {
  const containerRef = useRef(null);
  const engineInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useImperativeHandle(ref, () => ({
    updateParameter: (id, value) => {
      if (engineInstanceRef.current?.updateParameter) {
        engineInstanceRef.current.updateParameter(id, value);
      }
    },
    reset: () => {
      if (engineInstanceRef.current?.reset) {
        engineInstanceRef.current.reset();
      }
    },
  }));

  useEffect(() => {
    let isMounted = true;

    const loadEngine = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const engineModule = ENGINE_REGISTRY[config?.engineModule];
        if (!engineModule) {
          throw new Error(`Engine "${config?.engineModule}" not found in registry`);
        }

        const module = await engineModule();
        const EngineClass = module.default || module;

        if (!containerRef.current || !isMounted) return;

        // Instantiate engine with the container
        const engine = new EngineClass({
          container: containerRef.current,
          config,
          controlValues,
          onTelemetryUpdate,
          isPremium: isPremiumUnlocked,
        });

        engineInstanceRef.current = engine;

        // Start the simulation loop
        engine.start();
        setIsLoading(false);

      } catch (error) {
        console.error('Failed to load engine:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    loadEngine();

    // Cleanup
    return () => {
      isMounted = false;
      if (engineInstanceRef.current?.destroy) {
        engineInstanceRef.current.destroy();
      }
      engineInstanceRef.current = null;
    };
  }, [config, onTelemetryUpdate, isPremiumUnlocked]);

  // Update parameters when control values change externally
  useEffect(() => {
    if (engineInstanceRef.current?.updateParameters) {
      engineInstanceRef.current.updateParameters(controlValues);
    }
  }, [controlValues]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-sky-50/30 rounded-2xl min-h-[300px]">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🚀</div>
          <div className="text-sky-600 font-medium">Loading simulation...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50/50 rounded-2xl min-h-[300px]">
        <div className="text-center p-6">
          <div className="text-4xl mb-3">⚠️</div>
          <div className="text-red-600 font-medium">Failed to load simulation</div>
          <div className="text-sm text-red-400 mt-1">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative rounded-2xl overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
});

EngineLoader.displayName = 'EngineLoader';
export default EngineLoader;