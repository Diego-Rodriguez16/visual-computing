import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import ModelSelector from './components/ModelSelector';
import ModelInfo from './components/ModelInfo';
import ModelComparison from './components/ModelComparison';
import useModelStats from './hooks/useModelStats';

// Importación perezosa del visor de modelos para mejor rendimiento
const ModelViewer = lazy(() => import('./components/ModelViewer'));

function App() {
  // Estado para el formato de modelo actual
  const [format, setFormat] = useState('obj');
  
  // Rutas a los modelos
  const modelPaths = {
    obj: '/models/magnolia.obj',
    stl: '/models/magnolia.stl',
    gltf: '/models/magnolia.gltf'
  };

  // Referencia al componente ModelViewer para poder llamar sus métodos
  const modelViewerRef = useRef(null);
  
  // Hook personalizado para manejar estadísticas del modelo
  const { currentStats, updateModelStats, canCompare, getComparison } = useModelStats(format);

  // Manejador para cambiar el formato del modelo
  const handleFormatChange = (newFormat) => {
    setFormat(newFormat);
  };

  // Manejador para cuando se carga un modelo
  const handleModelLoaded = (stats) => {
    updateModelStats(stats);
  };

  // Manejador para restablecer la vista
  const handleResetView = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.resetView();
    }
  };

  // Manejador para aplicar escala humana
  const handleHumanScale = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.applyHumanScale();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Visualizador y Comparador de Modelos 3D</h1>
          <p className="text-gray-600 mt-2">Explora las diferencias entre formatos de modelos 3D</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: Selector y estadísticas */}
          <div className="space-y-6">
            <ModelSelector 
              currentFormat={format} 
              onChange={handleFormatChange} 
            />
            <ModelInfo modelStats={currentStats} />
            
            {/* Comparación de modelos (solo visible cuando hay suficientes datos) */}
            {canCompare && (
              <ModelComparison comparison={getComparison()} />
            )}
          </div>
          
          {/* Columna central y derecha: Visor 3D */}
          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <Suspense fallback={
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">Cargando visor 3D...</span>
                </div>
              }>
                <div className="h-[500px] w-full">
                  <ModelViewer 
                    ref={modelViewerRef}
                    format={format} 
                    modelPath={modelPaths[format]} 
                    onModelLoaded={handleModelLoaded}
                  />
                </div>
              </Suspense>
              
              {/* Barra de herramientas */}
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Formato: <span className="font-semibold">{format.toUpperCase()}</span>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={handleResetView}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Restablecer vista
                  </button>
                  <button 
                    onClick={handleHumanScale}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Escala humana
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Taller de Visualización y Conversión de Formatos 3D - 2025</p>
        </footer>
      </div>
    </div>
  );
}

export default App;