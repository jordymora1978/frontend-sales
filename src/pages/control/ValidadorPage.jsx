import React, { useState } from 'react';
import { CheckCircle, Upload, FileText, AlertCircle, Download, RefreshCw, Database, Shield } from 'lucide-react';

const ValidadorPage = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('drapify');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const fileTypes = {
    drapify: { label: 'Drapify', icon: Database, color: '#3b82f6' },
    logistics: { label: 'Logistics', icon: FileText, color: '#10b981' },
    cxp: { label: 'CXP', icon: Shield, color: '#8b5cf6' }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError('');
    setResults(null);
  };

  const handleValidation = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simular procesamiento para demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results para demo
      const mockResults = {
        stats: {
          total_rows: 1250,
          duplicates_found: 45,
          new_records: 1205,
          duplicate_percentage: 3.6
        },
        has_new_records: true,
        duplicates: [
          {
            row: 15,
            order_id: 'ORD-12345',
            prealert_id: 'PR-67890',
            reason: 'Order ID duplicado en base de datos'
          },
          {
            row: 28,
            order_id: 'ORD-12367',
            prealert_id: 'PR-67912',
            reason: 'Prealert ID ya existe'
          },
          {
            row: 42,
            order_id: 'ORD-12389',
            prealert_id: 'PR-67934',
            reason: 'Combinación Order ID + Prealert ID duplicada'
          }
        ]
      };

      setResults(mockResults);
    } catch (err) {
      setError('Error al validar el archivo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCleanFile = async () => {
    if (!file) return;

    try {
      // Simular descarga para demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una implementación real, esto descargaría el archivo
      alert('Archivo limpio generado exitosamente. En producción se descargaría automáticamente.');
    } catch (err) {
      setError('Error al generar archivo limpio: ' + err.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const SelectedFileTypeIcon = fileTypes[fileType]?.icon || Database;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Validador de Duplicados</h1>
            <p className="text-gray-600">Detecta y elimina registros duplicados en archivos Excel/CSV</p>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-blue-600 mt-0.5" size={18} />
          <div className="text-blue-700">
            <strong>Funcionalidades del Validador:</strong><br />
            • Detecta duplicados por Order ID y Prealert ID<br />
            • Genera estadísticas detalladas de validación<br />
            • Permite descargar archivo limpio sin duplicados<br />
            • Soporta archivos Drapify, Logistics y CXP
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Upload size={20} />
          Configuración de Validación
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* File Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Archivo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(fileTypes).map(([type, config]) => {
                const IconComponent = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setFileType(type)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      fileType === type 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent 
                      className="mx-auto mb-2" 
                      style={{ color: config.color }} 
                      size={20} 
                    />
                    <div className="text-xs font-medium">{config.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo Excel/CSV
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="space-y-2">
                    <FileText className="mx-auto text-green-600" size={32} />
                    <div className="font-medium text-gray-800">{file.name}</div>
                    <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                    <div className="text-xs text-green-600">✓ Archivo cargado</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto text-gray-400" size={32} />
                    <div className="text-gray-600">Haga clic para seleccionar archivo</div>
                    <div className="text-sm text-gray-500">Formatos: .xlsx, .xls, .csv</div>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleValidation}
            disabled={loading || !file}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              loading || !file
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Validando...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Validar Duplicados
              </>
            )}
          </button>
          
          {results && results.has_new_records && (
            <button
              onClick={downloadCleanFile}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Descargar Archivo Limpio
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      {results && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <FileText size={20} />
            Resultados de Validación
          </h3>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{results.stats.total_rows}</div>
              <div className="text-sm text-gray-600">Total Registros</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
              <div className="text-2xl font-bold text-red-600">{results.stats.duplicates_found}</div>
              <div className="text-sm text-gray-600">Duplicados</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
              <div className="text-2xl font-bold text-green-600">{results.stats.new_records}</div>
              <div className="text-sm text-gray-600">Nuevos</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">{results.stats.duplicate_percentage}%</div>
              <div className="text-sm text-gray-600">% Duplicados</div>
            </div>
          </div>

          {/* Duplicates Table */}
          {results.duplicates && results.duplicates.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-800">
                Duplicados Encontrados (mostrando primeros resultados):
              </h4>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fila
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prealert ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Razón del Duplicado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.duplicates.map((dup, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {dup.row}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {dup.order_id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {dup.prealert_id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">
                          {dup.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {results.has_new_records ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <CheckCircle size={18} />
              <span>
                ✓ Se encontraron <strong>{results.stats.new_records} registros nuevos</strong> que pueden ser procesados.
                Use el botón "Descargar Archivo Limpio" para obtener el archivo sin duplicados.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
              <AlertCircle size={18} />
              <span>
                ⚠️ No hay registros nuevos para procesar. Todos los registros en el archivo son duplicados.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidadorPage;