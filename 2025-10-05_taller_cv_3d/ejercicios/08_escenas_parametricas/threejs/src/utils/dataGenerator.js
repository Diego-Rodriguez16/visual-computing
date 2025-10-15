// utils/dataGenerator.js

/**
 * Genera un conjunto de datos aleatorios para la visualización
 * @param {number} count - Número de elementos a generar
 * @returns {Array} - Array de objetos con datos para visualizar
 */
export function generateRandomData(count) {
    const data = [];
    
    for (let i = 0; i < count; i++) {
      data.push({
        id: i,
        value: Math.random() * 10,           // Valor aleatorio entre 0-10
        category: Math.floor(Math.random() * 5), // Categoría (0-4)
        rotation: Math.random(),             // Valor para la rotación (0-1)
        importance: Math.random() > 0.7      // Booleano de importancia (30% de probabilidad)
      });
    }
    
    return data;
  }
  
  /**
   * Genera datos a partir de un conjunto de números proporcionado
   * @param {Array<number>} values - Array de valores numéricos
   * @returns {Array} - Array de objetos formatados para la visualización
   */
  export function generateDataFromValues(values) {
    return values.map((value, index) => ({
      id: index,
      value,
      category: index % 5,
      rotation: (index / values.length),
      importance: value > (Math.max(...values) * 0.7)
    }));
  }
  
  /**
   * Transforma datos complejos en un formato adecuado para la visualización
   * @param {Array} rawData - Datos brutos en cualquier formato
   * @param {Function} valueAccessor - Función para acceder al valor numérico principal
   * @param {Function} categoryAccessor - Función para determinar la categoría (0-4)
   * @returns {Array} - Datos transformados para la visualización
   */
  export function transformData(rawData, valueAccessor, categoryAccessor) {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    const transformed = rawData.map((item, index) => {
      const value = valueAccessor ? valueAccessor(item) : item;
      const category = categoryAccessor ? categoryAccessor(item) : 0;
      
      return {
        id: index,
        value: typeof value === 'number' ? value : 1,
        category: typeof category === 'number' ? Math.min(4, Math.max(0, category)) : 0,
        rotation: Math.random(),
        importance: false
      };
    });
    
    // Calcular el máximo para establecer la importancia
    const maxValue = Math.max(...transformed.map(item => item.value));
    
    // Establecer importancia para elementos con valor superior al 70% del máximo
    transformed.forEach(item => {
      item.importance = item.value > (maxValue * 0.7);
    });
    
    return transformed;
  }