import React from 'react';

const ModelInfo = ({ modelStats }) => {
  // Si no tenemos estadísticas, mostramos un indicador de carga
  if (!modelStats) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Información del Modelo</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  // Manejar error de carga
  if (modelStats.error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Información del Modelo</h2>
        <div className="p-3 bg-red-50 text-red-700 rounded-md mb-3">
          <p className="text-sm font-semibold">Error al cargar el modelo</p>
          <p className="text-xs mt-1">No se pudieron obtener las estadísticas. Intenta con otro formato.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Formato</span>
            <span className="font-semibold text-blue-600">{modelStats.format}</span>
          </div>
        </div>
      </div>
    );
  }

  // Aseguramos que no se rompa si vienen undefined
  const vertexCount = modelStats.vertexCount ?? 0;
  const faceCount = modelStats.faceCount ?? 0;

  const vertexCountColor = vertexCount > 10000 ? 'text-amber-600' : 'text-green-600';
  const faceCountColor = faceCount > 5000 ? 'text-amber-600' : 'text-green-600';

  const estimatedSizeBytes = vertexCount * 12 + faceCount * 12;
  let sizeDisplay = '';

  if (estimatedSizeBytes < 1024) {
    sizeDisplay = `${estimatedSizeBytes} bytes`;
  } else if (estimatedSizeBytes < 1024 * 1024) {
    sizeDisplay = `${(estimatedSizeBytes / 1024).toFixed(2)} KB`;
  } else {
    sizeDisplay = `${(estimatedSizeBytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Información del Modelo</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Formato</span>
          <span className="font-semibold text-blue-600">{modelStats.format}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Tamaño estimado</span>
          <span className="font-semibold">{sizeDisplay}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Vértices</span>
          <span className={`font-semibold ${vertexCountColor}`}>
            {vertexCount.toLocaleString()}
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Caras</span>
          <span className={`font-semibold ${faceCountColor}`}>
            {faceCount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-2">Características</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${modelStats.hasNormals ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm">Normales</span>
          </div>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${modelStats.hasTextures ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm">Texturas</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Los datos son aproximados y pueden variar en diferentes visualizadores.</p>
      </div>
    </div>
  );
};

export default ModelInfo;