/**
 * FIX AUTOMÁTICO DE PERMISOS - SE CARGA AUTOMÁTICAMENTE
 * Este script arregla el problema de que updateAllUsersOfRole no se ejecuta
 * después del drag & drop de permisos
 */

(function() {
    console.log('🔧 [PERMISSION FIX] Iniciando parche automático de permisos...');
    
    // Esperar a que la app esté cargada
    let attempts = 0;
    const maxAttempts = 50;
    
    const initFix = setInterval(() => {
        attempts++;
        
        if (attempts > maxAttempts) {
            clearInterval(initFix);
            console.warn('⚠️ [PERMISSION FIX] No se pudo aplicar el fix después de 50 intentos');
            return;
        }
        
        // Verificar si la app React está cargada
        if (document.querySelector('#root')._reactRootContainer || 
            document.querySelector('[data-reactroot]')) {
            
            clearInterval(initFix);
            applyPermissionFix();
        }
    }, 100);
    
    function applyPermissionFix() {
        console.log('✅ [PERMISSION FIX] Aplicando parche de permisos...');
        
        // Interceptar fetch para detectar guardado de permisos
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [url, options] = args;
            
            // Detectar llamadas a role-permissions
            if (options?.method === 'POST' && 
                url.includes('role-permissions') && 
                options.body) {
                
                try {
                    const body = JSON.parse(options.body);
                    
                    // Extraer rol del URL
                    const urlParams = new URLSearchParams(url.split('?')[1]);
                    const role = urlParams.get('role_name');
                    
                    if (role && Array.isArray(body)) {
                        console.log(`🎯 [PERMISSION FIX] Interceptado guardado de permisos para ${role}`);
                        
                        return originalFetch.apply(this, args)
                            .then(response => {
                                if (response.ok) {
                                    console.log(`⚡ [PERMISSION FIX] Ejecutando updateAllUsersOfRole(${role})`);
                                    
                                    // Ejecutar la actualización después de un pequeño delay
                                    setTimeout(() => {
                                        executeUpdateAllUsersOfRole(role, body);
                                    }, 100);
                                }
                                return response;
                            });
                    }
                } catch (e) {
                    // No es el body esperado, continuar normal
                }
            }
            
            return originalFetch.apply(this, args);
        };
        
        console.log('✅ [PERMISSION FIX] Interceptor de fetch instalado');
    }
    
    function executeUpdateAllUsersOfRole(role, allowedPages) {
        console.log(`⚡ [PERMISSION FIX] Actualizando usuarios del rol ${role} con permisos:`, allowedPages);
        
        // Actualizar localStorage si el usuario actual es del rol afectado
        const userData = localStorage.getItem('user_data');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                
                if (user.roles && user.roles.includes(role)) {
                    console.log(`⚡ [PERMISSION FIX] Usuario actual es ${role}, actualizando permisos...`);
                    user.role_permissions = allowedPages;
                    localStorage.setItem('user_data', JSON.stringify(user));
                    
                    // Disparar evento para re-render
                    window.dispatchEvent(new CustomEvent('userPermissionsUpdated', {
                        detail: { role, allowedPages, updatedPermissions: allowedPages }
                    }));
                    
                    // Forzar re-render del contexto React
                    window.dispatchEvent(new Event('storage'));
                    
                    console.log(`✅ [PERMISSION FIX] Permisos actualizados localmente`);
                } else {
                    console.log(`⚡ [PERMISSION FIX] Usuario actual (${user.roles?.[0]}) no es ${role}`);
                }
            } catch (e) {
                console.error('❌ [PERMISSION FIX] Error actualizando usuario:', e);
            }
        }
        
        // SIEMPRE enviar notificación cross-window
        console.log(`📢 [PERMISSION FIX] Enviando notificación cross-window para ${role}`);
        localStorage.setItem('permission_update_trigger', JSON.stringify({
            timestamp: Date.now(),
            role: role,
            allowedPages: allowedPages,
            source: 'permission-fix-auto'
        }));
        
        // Limpiar después de 100ms
        setTimeout(() => {
            localStorage.removeItem('permission_update_trigger');
        }, 100);
    }
    
    // Exponer función para debugging
    window.__permissionFixStatus = function() {
        return {
            applied: true,
            version: '1.0.0',
            description: 'Fix automático para updateAllUsersOfRole'
        };
    };
    
    console.log('✅ [PERMISSION FIX] Script cargado completamente');
})();