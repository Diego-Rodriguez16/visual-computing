import React from 'react';

const ModelSelector = ({ currentFormat, onChange }) => {
  // Definición de formatos disponibles con sus nombres para mostrar
  const availableFormats = [
    { value: 'obj', label: 'OBJ', description: 'Formato tradicional de malla 3D con buena compatibilidad' },
    { value: 'stl', label: 'STL', description: 'Formato simple optimizado para impresión 3D' },
    { value: 'gltf', label: 'GLTF', description: 'Formato moderno con soporte para animaciones y materiales' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Selector de Formato</h2>
      
      <div className="space-y-3">
        {availableFormats.map((format) => (
          <button
            key={format.value}
            onClick={() => onChange(format.value)}
            className={`w-full text-left p-3 rounded-lg flex items-center ${
              currentFormat === format.value 
                ? 'bg-blue-50 border-blue-500 border' 
                : 'bg-gray-50 border-gray-200 border hover:bg-gray-100'
            }`}
          >
            <div className="flex-1">
              <div className={`font-medium ${currentFormat === format.value ? 'text-blue-700' : 'text-gray-700'}`}>
                {format.label}
              </div>
              <p className="text-xs text-gray-500 mt-1">{format.description}</p>
            </div>
            
            {currentFormat === format.value && (
              <div className="bg-blue-500 rounded-full h-3 w-3"></div>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Selecciona un formato para visualizar y comparar el modelo.</p>
      </div>
    </div>
  );
};

export default ModelSelector;