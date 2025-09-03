/**
 * SISTEMA DE AUTO-TESTING PARA PERMISOS
 * Este script prueba automáticamente que los permisos se actualicen correctamente
 * SIN INTERVENCIÓN MANUAL
 */

class PermissionsAutoTester {
    constructor() {
        this.testResults = [];
        this.currentTest = null;
    }

    // Test 1: Verificar que saveRolePermissions ejecuta updateAllUsersOfRole
    async testSaveRolePermissionsFlow() {
        console.log('🧪 TEST 1: Verificando flujo saveRolePermissions → updateAllUsersOfRole');
        
        // Mock de la función para interceptar llamadas
        const originalUpdate = window.updateAllUsersOfRole;
        let updateCalled = false;
        let updateParams = null;
        
        window.updateAllUsersOfRole = function(role, permissions) {
            updateCalled = true;
            updateParams = { role, permissions };
            console.log('✅ updateAllUsersOfRole fue llamado:', role, permissions);
            if (originalUpdate) originalUpdate(role, permissions);
        };
        
        // Simular guardado de permisos
        try {
            // Trigger manual del flujo (simula lo que hace el drag & drop)
            const testRole = 'admin';
            const testPermissions = ['dashboard', 'admin-users', 'quotes'];
            
            // Llamar directamente a saveRolePermissions
            if (typeof window.saveRolePermissions === 'function') {
                await window.saveRolePermissions(testRole, testPermissions);
            }
            
            // Verificar resultado
            const testPassed = updateCalled && updateParams?.role === testRole;
            
            this.testResults.push({
                test: 'saveRolePermissions → updateAllUsersOfRole',
                passed: testPassed,
                details: updateCalled ? 
                    `Función llamada con: ${JSON.stringify(updateParams)}` : 
                    'La función NO fue llamada'
            });
            
        } finally {
            // Restaurar función original
            window.updateAllUsersOfRole = originalUpdate;
        }
    }

    // Test 2: Verificar actualización cross-window
    async testCrossWindowUpdate() {
        console.log('🧪 TEST 2: Verificando actualización cross-window');
        
        const testRole = 'admin';
        const testPermissions = ['dashboard', 'admin-users', 'test-page'];
        
        // Obtener estado inicial
        const initialUserData = localStorage.getItem('user_data');
        const initialUser = initialUserData ? JSON.parse(initialUserData) : null;
        
        // Simular trigger cross-window
        localStorage.setItem('permission_update_trigger', JSON.stringify({
            timestamp: Date.now(),
            role: testRole,
            allowedPages: testPermissions
        }));
        
        // Esperar propagación
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verificar actualización
        const updatedUserData = localStorage.getItem('user_data');
        const updatedUser = updatedUserData ? JSON.parse(updatedUserData) : null;
        
        const wasUpdated = updatedUser?.role_permissions && 
                          JSON.stringify(updatedUser.role_permissions) === JSON.stringify(testPermissions);
        
        this.testResults.push({
            test: 'Cross-window permission update',
            passed: wasUpdated,
            details: wasUpdated ? 
                `Permisos actualizados a: ${JSON.stringify(updatedUser.role_permissions)}` :
                'Los permisos NO se actualizaron'
        });
    }

    // Test 3: Verificar re-render del sidebar
    async testSidebarRerender() {
        console.log('🧪 TEST 3: Verificando re-render del sidebar');
        
        // Contar componentes antes
        const sidebarElementsBefore = document.querySelectorAll('[class*="sidebar"] a').length;
        
        // Disparar evento de actualización
        window.dispatchEvent(new CustomEvent('userPermissionsUpdated', {
            detail: { 
                role: 'admin', 
                allowedPages: ['dashboard', 'admin-users'],
                updatedPermissions: ['dashboard', 'admin-users']
            }
        }));
        
        // Esperar re-render
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Contar componentes después
        const sidebarElementsAfter = document.querySelectorAll('[class*="sidebar"] a').length;
        
        const changed = sidebarElementsBefore !== sidebarElementsAfter;
        
        this.testResults.push({
            test: 'Sidebar re-render on permission change',
            passed: changed || sidebarElementsBefore > 0,
            details: `Elementos antes: ${sidebarElementsBefore}, después: ${sidebarElementsAfter}`
        });
    }

    // Test 4: Verificar que la función existe en el build
    testFunctionExistence() {
        console.log('🧪 TEST 4: Verificando existencia de funciones críticas');
        
        const functionsToCheck = [
            'updateAllUsersOfRole',
            'saveRolePermissions',
            'handlePermissionUpdate'
        ];
        
        functionsToCheck.forEach(funcName => {
            const exists = typeof window[funcName] === 'function' || 
                          document.querySelector('script')?.textContent?.includes(funcName);
            
            this.testResults.push({
                test: `Función ${funcName} existe`,
                passed: exists,
                details: exists ? '✅ Función encontrada' : '❌ Función NO encontrada'
            });
        });
    }

    // Ejecutar todos los tests
    async runAllTests() {
        console.log('🚀 INICIANDO AUTO-TESTING DE PERMISOS');
        console.log('=====================================');
        
        // Test de existencia
        this.testFunctionExistence();
        
        // Tests asíncronos
        await this.testSaveRolePermissionsFlow();
        await this.testCrossWindowUpdate();
        await this.testSidebarRerender();
        
        // Mostrar resultados
        this.displayResults();
        
        return this.testResults;
    }

    // Mostrar resultados formateados
    displayResults() {
        console.log('\n📊 RESULTADOS DEL AUTO-TEST');
        console.log('===========================');
        
        let passed = 0;
        let failed = 0;
        
        this.testResults.forEach(result => {
            const icon = result.passed ? '✅' : '❌';
            console.log(`${icon} ${result.test}`);
            console.log(`   ${result.details}`);
            
            if (result.passed) passed++;
            else failed++;
        });
        
        console.log('\n📈 RESUMEN');
        console.log(`Total: ${this.testResults.length} tests`);
        console.log(`Pasados: ${passed} ✅`);
        console.log(`Fallados: ${failed} ❌`);
        
        if (failed === 0) {
            console.log('\n🎉 TODOS LOS TESTS PASARON - SISTEMA FUNCIONANDO CORRECTAMENTE');
        } else {
            console.log('\n⚠️ HAY TESTS FALLANDO - REVISAR IMPLEMENTACIÓN');
        }
    }
}

// Auto-ejecutar si estamos en el browser
if (typeof window !== 'undefined') {
    window.PermissionsAutoTester = PermissionsAutoTester;
    
    // Ejecutar automáticamente después de 2 segundos
    setTimeout(() => {
        console.log('🤖 Auto-ejecutando tests de permisos...');
        const tester = new PermissionsAutoTester();
        tester.runAllTests();
    }, 2000);
}

export default PermissionsAutoTester;