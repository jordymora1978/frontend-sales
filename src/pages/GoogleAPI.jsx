import React, { useState, useEffect } from 'react';
import { GOOGLE_API_URL } from '../config/api.js';
import { ENDPOINTS } from '../config/endpoints.js';
import { 
  Mail, 
  Settings, 
  Play, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Calendar,
  Search,
  FileText,
  Database,
  Clock,
  User,
  ExternalLink,
  Shield,
  Key,
  Cloud
} from 'lucide-react';
import '../components/Consolidador.css';

const GoogleAPI = () => {
  // Estados para configuración
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [authUrl, setAuthUrl] = useState('');

  // Estados para procesamiento
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStats, setProgressStats] = useState({
    emailsFound: 0,
    emailsProcessed: 0,
    attachmentsProcessed: 0,
    recordsUpdated: 0,
    errors: 0
  });

  // Estados para configuración de búsqueda
  const [searchConfig, setSearchConfig] = useState({
    dateRange: '7',
    includeProcessed: false,
    selectedSenders: []
  });

  // Estados para alertas y resultados
  const [alerts, setAlerts] = useState([]);
  const [processedEmails, setProcessedEmails] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Lista de remitentes conocidos
  const knownSenders = [
    { email: 'facturacion@anicam.com', name: 'ANICAM', types: ['Logistics', 'Aditionals'], enabled: true },
    { email: 'billing@chilexpress.cl', name: 'ChileXpress', types: ['CXP'], enabled: true },
    { email: 'invoices@servientrega.com', name: 'Servientrega', types: ['Logistics'], enabled: true },
    { email: 'facturas@coordinadora.com', name: 'Coordinadora', types: ['Logistics'], enabled: true },
    { email: 'billing@interrapidisimo.com', name: 'Inter Rapidísimo', types: ['Logistics'], enabled: true }
  ];

  useEffect(() => {
    checkGmailSetup();
    loadProcessedEmails();
  }, []);

  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const checkGmailSetup = async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}${ENDPOINTS.GOOGLE_API.SETUP_STATUS}`);
      if (response.ok) {
        const data = await response.json();
        setIsConfigured(data.configured);
        setIsConnected(data.connected);
        setSetupStep(data.current_step || 1);
      }
    } catch (error) {
      console.error('Error checking Gmail setup:', error);
    }
  };

  const startOAuthFlow = async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}${ENDPOINTS.GOOGLE_API.AUTH_START}`);
      if (response.ok) {
        const data = await response.json();
        setAuthUrl(data.auth_url);
        window.open(data.auth_url, '_blank');
        addAlert('info', 'Se abrió una ventana para autenticación con Google. Autoriza la aplicación y regresa aquí.');
      }
    } catch (error) {
      console.error('Error starting OAuth flow:', error);
      addAlert('error', 'Error al iniciar autenticación con Google');
    }
  };

  const verifyConnection = async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}${ENDPOINTS.GOOGLE_API.AUTH_VERIFY}`);
      if (response.ok) {
        const data = await response.json();
        if (data.connected) {
          setIsConnected(true);
          setSetupStep(4);
          addAlert('success', 'Conexión con Gmail verificada exitosamente');
        } else {
          addAlert('warning', 'Aún no se ha completado la autenticación');
        }
      }
    } catch (error) {
      console.error('Error verifying connection:', error);
      addAlert('error', 'Error al verificar conexión con Gmail');
    }
  };

  const processGmailEmails = async () => {
    setProcessing(true);
    setProgress(0);
    setProgressStats({ emailsFound: 0, emailsProcessed: 0, attachmentsProcessed: 0, recordsUpdated: 0, errors: 0 });

    try {
      const response = await fetch(`${GOOGLE_API_URL}${ENDPOINTS.GOOGLE_API.PROCESS_EMAILS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date_range_days: parseInt(searchConfig.dateRange),
          include_processed: searchConfig.includeProcessed,
          selected_senders: searchConfig.selectedSenders
        })
      });

      if (!response.ok) {
        throw new Error('Error en el procesamiento de emails');
      }

      const result = await response.json();
      
      setProgress(100);
      setProgressStats({
        emailsFound: result.emails_found || 0,
        emailsProcessed: result.emails_processed || 0,
        attachmentsProcessed: result.attachments_processed || 0,
        recordsUpdated: result.records_updated || 0,
        errors: result.errors?.length || 0
      });

      setShowResults(true);
      loadProcessedEmails();

      addAlert('success', `Procesamiento completado: ${result.emails_processed} emails procesados`);

    } catch (error) {
      console.error('Error processing emails:', error);
      addAlert('error', 'Error al procesar emails: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const loadProcessedEmails = async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}${ENDPOINTS.GOOGLE_API.AUDIT_EMAILS}?limit=50`);
      if (response.ok) {
        const data = await response.json();
        setProcessedEmails(data.emails || []);
      }
    } catch (error) {
      console.error('Error loading processed emails:', error);
    }
  };

  const handleSenderToggle = (senderEmail) => {
    setSearchConfig(prev => ({
      ...prev,
      selectedSenders: prev.selectedSenders.includes(senderEmail)
        ? prev.selectedSenders.filter(s => s !== senderEmail)
        : [...prev.selectedSenders, senderEmail]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSetupWizard = () => (
    <div className="upload-section">
      <h2 className="section-title">
        <Settings size={20} />
        Configuración de Gmail API
      </h2>

      <div className="setup-steps">
        {/* Paso 1: Google Cloud Console */}
        <div className={`setup-step ${setupStep > 1 ? 'completed' : setupStep === 1 ? 'active' : ''}`}>
          <div className={`step-number ${setupStep > 1 ? 'completed' : setupStep === 1 ? 'active' : ''}`}>
            {setupStep > 1 ? <CheckCircle size={16} /> : '1'}
          </div>
          <div className="step-content">
            <h3 className="step-title">Configurar Google Cloud Console</h3>
            <p className="step-description">
              Crea un proyecto en Google Cloud Console y habilita Gmail API. 
              Necesitarás generar credenciales OAuth2 para la aplicación web.
            </p>
            <div className="step-actions">
              <button 
                className="modern-btn google"
                onClick={() => window.open('https://console.cloud.google.com', '_blank')}
              >
                <ExternalLink size={16} />
                Abrir Google Cloud Console
              </button>
              <button 
                className="modern-btn secondary"
                onClick={() => setSetupStep(2)}
              >
                Ya configuré el proyecto
              </button>
            </div>
          </div>
        </div>

        {/* Paso 2: Credenciales */}
        <div className={`setup-step ${setupStep > 2 ? 'completed' : setupStep === 2 ? 'active' : ''}`}>
          <div className={`step-number ${setupStep > 2 ? 'completed' : setupStep === 2 ? 'active' : ''}`}>
            {setupStep > 2 ? <CheckCircle size={16} /> : '2'}
          </div>
          <div className="step-content">
            <h3 className="step-title">Configurar Credenciales</h3>
            <p className="step-description">
              Crea credenciales OAuth2 y configura las URLs de redirección autorizadas.
              Descarga el archivo de credenciales y súbelo al servidor.
            </p>
            <div className="step-actions">
              <button 
                className="modern-btn"
                onClick={() => setSetupStep(3)}
              >
                <Key size={16} />
                Credenciales Configuradas
              </button>
            </div>
          </div>
        </div>

        {/* Paso 3: Autenticación */}
        <div className={`setup-step ${setupStep > 3 ? 'completed' : setupStep === 3 ? 'active' : ''}`}>
          <div className={`step-number ${setupStep > 3 ? 'completed' : setupStep === 3 ? 'active' : ''}`}>
            {setupStep > 3 ? <CheckCircle size={16} /> : '3'}
          </div>
          <div className="step-content">
            <h3 className="step-title">Autenticar con Gmail</h3>
            <p className="step-description">
              Autoriza la aplicación para acceder a tu cuenta de Gmail.
              Este paso te redirigirá a Google para completar la autenticación.
            </p>
            <div className="step-actions">
              <button 
                className="modern-btn google"
                onClick={startOAuthFlow}
                disabled={!isConfigured}
              >
                <Shield size={16} />
                Autenticar con Google
              </button>
              <button 
                className="modern-btn secondary"
                onClick={verifyConnection}
              >
                <RefreshCw size={16} />
                Verificar Conexión
              </button>
            </div>
          </div>
        </div>

        {/* Paso 4: Completado */}
        <div className={`setup-step ${setupStep === 4 ? 'completed' : ''}`}>
          <div className={`step-number ${setupStep === 4 ? 'completed' : ''}`}>
            {setupStep === 4 ? <CheckCircle size={16} /> : '4'}
          </div>
          <div className="step-content">
            <h3 className="step-title">¡Configuración Completada!</h3>
            <p className="step-description">
              Gmail API está configurado y listo para usar. 
              Ahora puedes procesar facturas directamente desde Gmail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessingInterface = () => (
    <>
      {/* Configuration Section */}
      <div className="config-section">
        <h2 className="section-title">
          <Settings size={20} />
          Configuración de Búsqueda
        </h2>

        <div className="config-grid">
          <div className="config-item">
            <div className="config-label">Rango de Fechas</div>
            <div className="config-description">Buscar emails de los últimos N días</div>
            <select
              className="modern-select"
              value={searchConfig.dateRange}
              onChange={(e) => setSearchConfig(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="7">Últimos 7 días</option>
              <option value="15">Últimos 15 días</option>
              <option value="30">Último mes</option>
              <option value="60">Últimos 2 meses</option>
            </select>
          </div>

          <div className="config-item">
            <div className="config-label">Emails Procesados</div>
            <div className="config-description">Incluir emails ya procesados anteriormente</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={searchConfig.includeProcessed}
                onChange={(e) => setSearchConfig(prev => ({ ...prev, includeProcessed: e.target.checked }))}
              />
              Incluir procesados
            </label>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <div className="config-label">Remitentes a Procesar</div>
          <div className="config-description">Selecciona los remitentes de facturas que quieres procesar</div>
          <div className="senders-grid">
            {knownSenders.map(sender => (
              <div 
                key={sender.email}
                className={`sender-checkbox ${searchConfig.selectedSenders.includes(sender.email) ? 'checked' : ''}`}
                onClick={() => handleSenderToggle(sender.email)}
              >
                <input
                  type="checkbox"
                  checked={searchConfig.selectedSenders.includes(sender.email)}
                  onChange={() => {}}
                />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{sender.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{sender.email}</div>
                  <div className="attachment-types">
                    {sender.types.map(type => (
                      <span key={type} className={`type-tag ${type.toLowerCase()}`}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Processing Section */}
      <div className="upload-section">
        <h2 className="section-title">
          <Play size={20} />
          Procesar Facturas desde Gmail
        </h2>

        <div className="processing-controls">
          <button 
            className="modern-btn"
            onClick={processGmailEmails}
            disabled={processing || searchConfig.selectedSenders.length === 0}
          >
            {processing ? (
              <>
                <RefreshCw size={16} className="spin" />
                Procesando...
              </>
            ) : (
              <>
                <Mail size={16} />
                Procesar Facturas
              </>
            )}
          </button>

          <button 
            className="modern-btn secondary"
            onClick={loadProcessedEmails}
          >
            <RefreshCw size={16} />
            Actualizar Lista
          </button>
        </div>

        {searchConfig.selectedSenders.length === 0 && (
          <div className="alert warning">
            <AlertCircle size={18} />
            <span>Selecciona al menos un remitente para procesar facturas</span>
          </div>
        )}
      </div>

      {/* Progress Section */}
      {processing && (
        <div className="progress-section">
          <h3 className="section-title">
            <Clock size={20} />
            Progreso del Procesamiento
          </h3>
          
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="progress-stats">
            <div className="stat-item">
              <div className="stat-number">{progressStats.emailsFound}</div>
              <div className="stat-label">Emails Encontrados</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{progressStats.emailsProcessed}</div>
              <div className="stat-label">Emails Procesados</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{progressStats.attachmentsProcessed}</div>
              <div className="stat-label">Adjuntos Procesados</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{progressStats.recordsUpdated}</div>
              <div className="stat-label">Registros Actualizados</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{progressStats.errors}</div>
              <div className="stat-label">Errores</div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderAuditTable = () => (
    <div className="upload-section">
      <h2 className="section-title">
        <FileText size={20} />
        Historial de Emails Procesados
      </h2>

      {processedEmails.length > 0 ? (
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Fecha Email</th>
                <th>Remitente</th>
                <th>Asunto</th>
                <th>Adjuntos</th>
                <th>Tipos</th>
                <th>Registros</th>
                <th>Estado</th>
                <th>Procesado</th>
              </tr>
            </thead>
            <tbody>
              {processedEmails.map((email, index) => (
                <tr key={index}>
                  <td>{formatDate(email.email_date)}</td>
                  <td>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                      {email.sender_name || 'Desconocido'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {email.sender}
                    </div>
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {email.subject}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {email.attachments_count || 0}
                  </td>
                  <td>
                    <div className="attachment-types">
                      {(email.attachment_types || []).map(type => (
                        <span key={type} className={`type-tag ${type.toLowerCase()}`}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {email.records_updated || 0}
                  </td>
                  <td>
                    <span className={`status-badge ${email.processing_status || 'unknown'}`}>
                      {email.processing_status || 'Unknown'}
                    </span>
                  </td>
                  <td>{formatDate(email.processed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Mail size={32} />
          </div>
          <div className="empty-title">Sin emails procesados</div>
          <div className="empty-desc">
            Aún no se han procesado emails desde Gmail. Configura los remitentes y ejecuta el procesamiento.
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="consolidador-container">
      {/* Header */}
      <div className="consolidador-header">
        <div className="header-content">
          <div className="header-icon">
            <Mail size={24} />
          </div>
          <div className="header-info">
            <h1>Google API - Procesador Directo de Gmail</h1>
            <p>Procesa facturas directamente desde Gmail sin intermediarios</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="connection-status">
          <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span className="status-text">
            {isConnected ? 'Conectado a Gmail' : 'Desconectado'}
          </span>
          {isConnected && (
            <span className="status-subtext">
              Listo para procesar facturas directamente desde Gmail
            </span>
          )}
        </div>
      </div>

      {/* Alerts */}
      {alerts.map(alert => (
        <div key={alert.id} className={`alert ${alert.type}`}>
          {alert.type === 'error' && <AlertCircle size={18} />}
          {alert.type === 'success' && <CheckCircle size={18} />}
          {alert.type === 'info' && <Info size={18} />}
          {alert.type === 'warning' && <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      ))}

      {/* Información importante */}
      <div className="alert info">
        <Database size={18} />
        <div>
          <strong>Nuevo Sistema Directo:</strong> Este módulo se conecta directamente a Gmail API para procesar facturas 
          sin usar Google Drive como intermediario. Es más eficiente y preciso que el sistema legacy.
        </div>
      </div>

      {/* Main Content */}
      {!isConnected ? renderSetupWizard() : renderProcessingInterface()}

      {/* Audit Table */}
      {isConnected && renderAuditTable()}
    </div>
  );
};

export default GoogleAPI;