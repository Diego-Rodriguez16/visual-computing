import { useState, useEffect } from 'react';

const useModelStats = (currentFormat) => {
  // Estado para almacenar todas las estadísticas de los modelos
  const [modelStats, setModelStats] = useState({});
  
  // Estado para almacenar los tiempos de carga de los modelos
  const [loadTimes, setLoadTimes] = useState({});
  
  // Estado para almacenar las estadísticas del modelo actual
  const [currentStats, setCurrentStats] = useState(null);
  
  // Función para actualizar las estadísticas del modelo actual
  const updateModelStats = (stats) => {
    if (!stats) return;
    
    // Guardamos las estadísticas para el formato actual
    setModelStats(prev => ({
      ...prev,
      [currentFormat]: stats
    }));
    
    // Guardamos el tiempo de carga reportado por el componente ModelViewer
    setLoadTimes(prev => ({
      ...prev,
      [currentFormat]: {
        time: stats.loadTime || 0
      }
    }));
    
    // Actualizamos las estadísticas actuales
    setCurrentStats(stats);
  };
  
  // Cuando cambia el formato, actualizamos las estadísticas actuales
  useEffect(() => {
    if (modelStats[currentFormat]) {
      setCurrentStats(modelStats[currentFormat]);
    } else {
      setCurrentStats(null);
    }
  // SOLO reaccionamos al cambio de `currentFormat`
  }, [currentFormat, modelStats]);
  
  // Función para determinar si se pueden comparar formatos
  const canCompare = Object.keys(modelStats).length > 1;
  
  // Función para obtener una comparación entre formatos
  const getComparison = () => {
    if (!canCompare) return null;
    
    const formats = Object.keys(modelStats);
    
    // Encontrar el formato con menos vértices
    const minVertices = formats.reduce((min, format) => {
      if (!min || modelStats[format].vertexCount < min.count) {
        return { format, count: modelStats[format].vertexCount };
      }
      return min;
    }, null);
    
    // Encontrar el formato con más vértices
    const maxVertices = formats.reduce((max, format) => {
      if (!max || modelStats[format].vertexCount > max.count) {
        return { format, count: modelStats[format].vertexCount };
      }
      return max;
    }, null);
    
    // Calcular la diferencia de vértices
    const rawDifference = maxVertices.count - minVertices.count;
    const percentage = ((rawDifference / maxVertices.count) * 100).toFixed(1);
    
    // Encontrar el formato con carga más rápida
    const fastestLoad = formats.reduce((fastest, format) => {
      if (!loadTimes[format]) return fastest;
      const loadTime = loadTimes[format].time;
      if (!fastest || loadTime < fastest.time) {
        return { format, time: loadTime };
      }
      return fastest;
    }, null);
    
    // Encontrar el formato con carga más lenta
    const slowestLoad = formats.reduce((slowest, format) => {
      if (!loadTimes[format]) return slowest;
      const loadTime = loadTimes[format].time;
      if (!slowest || loadTime > slowest.time) {
        return { format, time: loadTime };
      }
      return slowest;
    }, null);
    
    return {
      minVertices,
      maxVertices,
      vertexDifference: {
        rawDifference,
        percentage
      },
      fastestLoad,
      slowestLoad
    };
  };
  
  return {
    currentStats,
    updateModelStats,
    canCompare,
    getComparison
  };
};

export default useModelStats;