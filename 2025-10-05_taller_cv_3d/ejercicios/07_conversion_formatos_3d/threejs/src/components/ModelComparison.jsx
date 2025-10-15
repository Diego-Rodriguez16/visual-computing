import React from 'react';

const ModelComparison = ({ comparison }) => {
  if (!comparison) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Comparación de Formatos</h2>

      {/* Sección de comparación de vértices */}
      {comparison.minVertices && comparison.maxVertices && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Densidad de Geometría</h3>
          
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">
              Menos vértices:
            </span>
            <span className="text-sm font-semibold text-green-600">
              {comparison.minVertices.format.toUpperCase()} ({comparison.minVertices.count.toLocaleString()})
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Más vértices:
            </span>
            <span className="text-sm font-semibold text-amber-600">
              {comparison.maxVertices.format.toUpperCase()} ({comparison.maxVertices.count.toLocaleString()})
            </span>
          </div>
          
          {/* Barra de diferencia */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${100 - Number(comparison.vertexDifference.percentage)}%` }}
            ></div>
          </div>
          
          <div className="mt-1 text-xs text-gray-500 text-center">
            Diferencia de {comparison.vertexDifference.percentage}% ({comparison.vertexDifference.rawDifference.toLocaleString()} vértices)
          </div>
        </div>
      )}

      {/* Sección de comparación de tiempo de carga */}
      {comparison.fastestLoad && comparison.slowestLoad && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-2">Rendimiento de Carga</h3>
          
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">
              Carga más rápida:
            </span>
            <span className="text-sm font-semibold text-green-600">
              {comparison.fastestLoad.format.toUpperCase()} ({comparison.fastestLoad.time.toFixed(0)} ms)
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Carga más lenta:
            </span>
            <span className="text-sm font-semibold text-amber-600">
              {comparison.slowestLoad.format.toUpperCase()} ({comparison.slowestLoad.time.toFixed(0)} ms)
            </span>
          </div>
          
          {/* Barra de diferencia */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ 
                width: `${(comparison.fastestLoad.time / comparison.slowestLoad.time * 100).toFixed(0)}%` 
              }}
            ></div>
          </div>
          
          <div className="mt-1 text-xs text-gray-500 text-center">
            {comparison.slowestLoad.format.toUpperCase()} es {(comparison.slowestLoad.time / comparison.fastestLoad.time).toFixed(1)}x más lento
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Esta comparación se actualiza conforme cambias entre formatos.</p>
      </div>
    </div>
  );
};

export default ModelComparison;