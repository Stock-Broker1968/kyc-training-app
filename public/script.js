// Objeto principal para encapsular toda la lógica de la aplicación
const kycApp = {
    // Referencias a elementos del DOM para fácil acceso
    dom: {
        registrationScreen: document.getElementById('registrationScreen'),
        evaluationScreen: document.getElementById('evaluationScreen'),
        resultsScreen: document.getElementById('resultsScreen'),
        registrationForm: document.getElementById('registrationForm'),
        userStateSelect: document.getElementById('userState'),
        stateRiskIndicator: document.getElementById('stateRiskIndicator'),
        displayUserName: document.getElementById('displayUserName'),
        displayUserState: document.getElementById('displayUserState'),
        timeElapsed: document.getElementById('timeElapsed'),
        progressIndicator: document.getElementById('progressIndicator'),
        caseContainer: document.getElementById('caseContainer'),
        finalScore: document.getElementById('finalScore'),
        gradeBadge: document.getElementById('gradeBadge'),
        certificate: document.getElementById('certificate'),
        certName: document.getElementById('certName'),
        certDate: document.getElementById('certDate'),
        certScore: document.getElementById('certScore'),
        certId: document.getElementById('certId'),
        detailedResults: document.getElementById('detailedResults'),
        printButton: document.getElementById('printButton'),
        repeatButton: document.getElementById('repeatButton')
    },

    // Estado de la aplicación
    state: {
        user: null,
        selectedCases: [],
        currentCaseIndex: 0,
        responses: [],
        startTime: null,
        timerInterval: null,
        selectedRisk: null
    },

    // Base de datos de clientes
    allClients: [
        { id: 1, name: "Hans Müller", photo: "https://i.pravatar.cc/300?img=33", nationality: "Alemana", occupation: "Importador de maquinaria industrial", address: "Av. Presidente Masaryk 525, Polanco", city: "Ciudad de México", state: "CDMX", stateRisk: "medio", volume: "$500,000 USD", frequency: "Mensual", cashHandling: "Bajo", transactionality: "Transferencias internacionales desde cuentas en Suiza y Liechtenstein", fundsOrigin: "Pariente directo es Exministro de Finanzas alemán (PEP)", pepStatus: "Conexiones políticas internacionales de alto nivel", alerts: ["Paraíso fiscal", "PEP directo", "Montos elevados", "Múltiples jurisdicciones"], correctRisk: "high", explanation: "RIESGO ALTO: Combinación crítica de transferencias desde paraísos fiscales (Suiza), conexiones PEP directas de alto nivel, y montos significativos que requieren debida diligencia reforzada." },
        { id: 2, name: "Juana Pérez Luna", photo: "https://i.pravatar.cc/300?img=49", nationality: "Mexicana", occupation: "Ama de casa", address: "Calle Tulipanes 45, Col. La Florida", city: "Naucalpan", state: "Estado de México", stateRisk: "medio", volume: "$10,000 USD", frequency: "Mensual", cashHandling: "Alto (80% efectivo)", transactionality: "Sin actividad económica formal registrada ante SAT", fundsOrigin: "Esposo investigado por desvío de recursos públicos (2019-2021)", pepStatus: "Cónyuge con antecedentes de corrupción", alerts: ["Inconsistencia perfil/operaciones", "Vínculos corrupción", "Alto efectivo", "Sin registro SAT"], correctRisk: "high", explanation: "RIESGO ALTO: Perfil inconsistente con operaciones, vínculos directos con casos de corrupción documentados, alto manejo de efectivo sin justificación económica." },
        { id: 3, name: "Emilio Torres Hernández", photo: "https://i.pravatar.cc/300?img=11", nationality: "Mexicana", occupation: "Influencer / Creador de contenido", address: "Torre Virreyes, Lomas de Chapultepec", city: "Ciudad de México", state: "CDMX", stateRisk: "medio", volume: "$50,000 USD", frequency: "Semanal", cashHandling: "Muy Alto (95% efectivo)", transactionality: "Depósitos en efectivo fraccionados, múltiples sucursales", fundsOrigin: "Donaciones de seguidores sin comprobantes fiscales", pepStatus: "Sin conexiones PEP identificadas", alerts: ["Estructuración sospechosa", "Sin comprobantes", "95% efectivo", "Depósitos fraccionados"], correctRisk: "high", explanation: "RIESGO ALTO: Patrón claro de estructuración (smurfing), imposibilidad de verificar origen lícito de fondos, 95% en efectivo sin documentación fiscal." },
        { id: 4, name: "Pedro Hernández Juárez", photo: "https://i.pravatar.cc/300?img=52", nationality: "Mexicana", occupation: "Agricultor de subsistencia", address: "Camino al Ejido S/N, Santa María", city: "Tlaxiaco", state: "Oaxaca", stateRisk: "bajo", volume: "$5,000 MXN", frequency: "Mensual", cashHandling: "Alto (100% efectivo)", transactionality: "Venta de productos agrícolas en mercados locales", fundsOrigin: "Cosechas de maíz y frijol, sin RFC por estar en RIF", pepStatus: "Sin conexiones políticas", alerts: ["Sin bancarización", "Economía informal justificada", "Zona rural"], correctRisk: "medium", explanation: "RIESGO MEDIO: Aunque maneja 100% efectivo, es justificable por contexto rural y falta de acceso bancario. Montos acordes con actividad agrícola de subsistencia." },
        { id: 5, name: "Mónica Gómez García", photo: "https://i.pravatar.cc/300?img=32", nationality: "Mexicana", occupation: "Socia en despacho jurídico", address: "Torre Reforma 180, Piso 42", city: "Ciudad de México", state: "CDMX", stateRisk: "medio", volume: "$120,000 MXN", frequency: "Mensual", cashHandling: "Bajo (5% efectivo)", transactionality: "Transferencias de clientes corporativos, todo facturado", fundsOrigin: "Honorarios profesionales con CFDI", pepStatus: "Sin vínculos políticos", alerts: [], correctRisk: "low", explanation: "RIESGO BAJO: Perfil completamente coherente, operaciones 95% bancarizadas, comprobantes fiscales completos, sin señales de alerta." },
        { id: 6, name: "Luis Ramos Corona", photo: "https://i.pravatar.cc/300?img=60", nationality: "Mexicana", occupation: "Comerciante de autos usados", address: "Av. Insurgentes 234, Col. Centro", city: "Culiacán", state: "Sinaloa", stateRisk: "alto", volume: "$150,000 MXN", frequency: "Diario", cashHandling: "Muy Alto (90% efectivo)", transactionality: "Depósitos diarios justo debajo del límite de reporte", fundsOrigin: "Venta de vehículos sin facturas, solo contratos simples", pepStatus: "Sin conexiones directas", alerts: ["Zona de alto riesgo", "Estructuración evidente", "Sin facturas", "Negocio de alto riesgo"], correctRisk: "high", explanation: "RIESGO ALTO: Ubicación en Sinaloa (alto riesgo), patrón de estructuración para evitar reportes, negocio de alto riesgo (autos usados), 90% efectivo sin facturas." },
        { id: 7, name: "José Ríos Díaz", photo: "https://i.pravatar.cc/300?img=13", nationality: "Mexicana", occupation: "Ex-Secretario de Obras Públicas", address: "Residencial Las Águilas, Casa 15", city: "Morelia", state: "Michoacán", stateRisk: "alto", volume: "$250,000 USD", frequency: "Mensual", cashHandling: "Bajo", transactionality: "Transferencias desde Islas Caimán y Panamá", fundsOrigin: "Consultorías a empresas ganadoras de licitaciones públicas", pepStatus: "PEP - Alto funcionario 2018-2024", alerts: ["PEP activo", "Paraísos fiscales", "Conflicto de interés", "Zona de alto riesgo"], correctRisk: "high", explanation: "RIESGO ALTO: PEP con transferencias desde múltiples paraísos fiscales, evidentes conflictos de interés con empresas beneficiadas en licitaciones durante su gestión." },
        { id: 8, name: "Ana Robles Moreno", photo: "https://i.pravatar.cc/300?img=44", nationality: "Mexicana", occupation: "Médico especialista en cirugía plástica", address: "Hospital Angeles, Consultorio 512", city: "Monterrey", state: "Nuevo León", stateRisk: "medio", volume: "$200,000 MXN", frequency: "Mensual", cashHandling: "Medio (40% efectivo)", transactionality: "Mezcla de transferencias y efectivo de pacientes", fundsOrigin: "Cirugías estéticas, 60% con factura, 40% sin factura", pepStatus: "Sin conexiones políticas", alerts: ["Subdeclaración fiscal probable", "40% sin factura", "Sector de riesgo medio"], correctRisk: "medium", explanation: "RIESGO MEDIO: Aunque es profesional establecida, el 40% de operaciones sin factura y en efectivo en sector de cirugía estética requiere monitoreo." },
        { id: 9, name: "Yu Chen", photo: "https://i.pravatar.cc/300?img=5", nationality: "China", occupation: "Estudiante de doctorado", address: "Ciudad Universitaria, Residencia Internacional", city: "Ciudad de México", state: "CDMX", stateRisk: "medio", volume: "¥70,000 CNY", frequency: "Mensual", cashHandling: "Bajo", transactionality: "Transferencia mensual del China Scholarship Council", fundsOrigin: "Beca gubernamental china para estudios en el extranjero", pepStatus: "Sin conexiones identificadas", alerts: [], correctRisk: "low", explanation: "RIESGO BAJO: Fondos de origen gubernamental verificable, montos acordes con beca estudiantil, perfil coherente con actividad." },
        { id: 10, name: "Daniel Cruz González", photo: "https://i.pravatar.cc/300?img=7", nationality: "Mexicana", occupation: "CEO de Startup Fintech", address: "WeWork Insurgentes, Piso 8", city: "Ciudad de México", state: "CDMX", stateRisk: "medio", volume: "$80,000 USD", frequency: "Variable", cashHandling: "Nulo (0% efectivo)", transactionality: "Inversiones en criptomonedas, trading de Bitcoin y Ethereum", fundsOrigin: "Empresa no constituida formalmente, sin RFC empresarial", pepStatus: "Sin conexiones políticas", alerts: ["Criptoactivos", "Sin formalización", "Sector Fintech no regulado", "Alta volatilidad"], correctRisk: "medium", explanation: "RIESGO MEDIO: Uso intensivo de criptomonedas dificulta trazabilidad, empresa no formalizada, sector Fintech no regulado completamente." },
        { id: 11, name: "Antonio Rivera Marín", photo: "https://i.pravatar.cc/300?img=70", nationality: "Mexicana", occupation: "Pensionado del IMSS", address: "Unidad Habitacional CTM, Edificio 4", city: "Aguascalientes", state: "Aguascalientes", stateRisk: "bajo", volume: "$12,000 MXN", frequency: "Mensual", cashHandling: "Bajo", transactionality: "Depósito directo de pensión del IMSS", fundsOrigin: "Pensión por 35 años de servicio", pepStatus: "Sin conexiones políticas", alerts: [], correctRisk: "low", explanation: "RIESGO BAJO: Ingresos completamente verificables del IMSS, montos fijos mensuales, perfil de pensionado sin alertas." },
        { id: 12, name: "Laura Méndez Villalobos", photo: "https://i.pravatar.cc/300?img=45", nationality: "Mexicana", occupation: "Conductora de TV y modelo", address: "Santa Fe, Torre Zentrum", city: "Ciudad de México", state: "CDMX", stateRisk: "medio", volume: "$250,000 MXN", frequency: "Mensual", cashHandling: "Bajo (10% efectivo)", transactionality: "Contratos con televisoras y marcas de moda", fundsOrigin: "Contratos publicitarios verificables con grandes marcas", pepStatus: "Sin conexiones políticas", alerts: [], correctRisk: "low", explanation: "RIESGO BAJO: Alta visibilidad pública, contratos verificables con empresas conocidas, operaciones bancarizadas en 90%." }
    ],

    // Método de inicialización
    init() {
        this.dom.registrationForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.startEvaluation();
        });
        this.dom.userStateSelect.addEventListener('change', this.updateStateRisk.bind(this));
        this.dom.printButton.addEventListener('click', () => window.print());
        this.dom.repeatButton.addEventListener('click', () => location.reload());
    },

    // Métodos de la aplicación
    updateStateRisk() {
        const state = this.dom.userStateSelect.value;
        const highRiskStates = ['Tamaulipas', 'Sinaloa', 'Guerrero', 'Michoacán', 'Chihuahua', 'Baja California'];
        const mediumRiskStates = ['Jalisco', 'Guanajuato', 'Estado de México', 'Veracruz', 'Morelos', 'Sonora'];
        
        let indicatorHTML = '';
        if (highRiskStates.includes(state)) {
            indicatorHTML = '<span class="state-risk-indicator risk-alto">⚠️ Zona de Alto Riesgo</span>';
        } else if (mediumRiskStates.includes(state)) {
            indicatorHTML = '<span class="state-risk-indicator risk-medio">⚠️ Zona de Riesgo Medio</span>';
        } else if (state) {
            indicatorHTML = '<span class="state-risk-indicator risk-bajo">✓ Zona de Riesgo Bajo</span>';
        }
        this.dom.stateRiskIndicator.innerHTML = indicatorHTML;
    },

    startEvaluation() {
        const formData = new FormData(this.dom.registrationForm);
        this.state.user = {
            name: formData.get('userName'),
            state: formData.get('userState')
        };
        
        const trainingType = formData.get('trainingType');
        this.state.selectedCases = trainingType === 'quick' 
            ? [...this.allClients].sort(() => 0.5 - Math.random()).slice(0, 5) 
            : [...this.allClients];
        
        this.state.startTime = new Date();
        this.startTimer();
        
        this.dom.registrationScreen.style.display = 'none';
        this.dom.evaluationScreen.style.display = 'block';
        
        this.dom.displayUserName.textContent = this.state.user.name;
        this.dom.displayUserState.textContent = this.state.user.state;
        
        this.createProgressIndicators();
        this.loadCase(0);
    },

    startTimer() {
        let seconds = 0;
        this.state.timerInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            this.dom.timeElapsed.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }, 1000);
    },

    createProgressIndicators() {
        this.dom.progressIndicator.innerHTML = '';
        this.state.selectedCases.forEach((_, i) => {
            const step = document.createElement('div');
            step.classList.add('progress-step');
            step.textContent = i + 1;
            step.id = `progress-${i}`;
            this.dom.progressIndicator.appendChild(step);
        });
    },

    loadCase(index) {
        this.state.currentCaseIndex = index;
        const currentCase = this.state.selectedCases[index];
        
        document.querySelectorAll('.progress-step').forEach((step, i) => {
            step.classList.remove('active', 'complete');
            if (i < index) step.classList.add('complete');
            else if (i === index) step.classList.add('active');
        });
        
        const geoRisk = currentCase.stateRisk === 'alto' ? 'high-risk' : currentCase.stateRisk === 'medio' ? 'medium-risk' : 'low-risk';
        
        this.dom.caseContainer.innerHTML = `
            <div class="police-file-card">
                <div class="case-header">
                    <div class="mugshot-container">
                        <img src="${currentCase.photo}" alt="${currentCase.name}" class="mugshot" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(currentCase.name)}&size=300&background=1f2937&color=fbbf24&bold=true'">
                        <div class="case-number">CASO #${String(currentCase.id).padStart(5, '0')}</div>
                    </div>
                    <div class="suspect-info">
                        <div class="suspect-name">${currentCase.name}</div>
                        <div class="info-grid">
                            <div class="info-item"><div class="info-label">Nacionalidad</div><div class="info-value">${currentCase.nationality}</div></div>
                            <div class="info-item"><div class="info-label">Ocupación</div><div class="info-value">${currentCase.occupation}</div></div>
                            <div class="info-item"><div class="info-label">Domicilio</div><div class="info-value">${currentCase.address}</div></div>
                            <div class="info-item"><div class="info-label">Ciudad/Estado</div><div class="info-value">${currentCase.city}, ${currentCase.state}</div></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="geographic-risk">
                <h3>📍 ANÁLISIS DE RIESGO GEOGRÁFICO</h3>
                <div class="risk-factor-card ${geoRisk}">
                    <div class="risk-factor-title">
                        Ubicación: ${currentCase.state}
                        <span class="risk-indicator-badge badge-${currentCase.stateRisk === 'alto' ? 'high' : currentCase.stateRisk === 'medio' ? 'medium' : 'low'}">
                            ${currentCase.stateRisk.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            <div class="risk-analysis">
                <h3>🔍 ANÁLISIS DETALLADO DE FACTORES DE RIESGO</h3>
                <div class="risk-factors">
                    <div class="risk-factor-card ${currentCase.cashHandling.includes('Alto') || currentCase.cashHandling.includes('Muy') ? 'high-risk' : currentCase.cashHandling.includes('Medio') ? 'medium-risk' : 'low-risk'}">
                        <div class="risk-factor-title">💵 Manejo de Efectivo: <strong>${currentCase.cashHandling}</strong></div>
                    </div>
                    <div class="risk-factor-card">
                        <div class="risk-factor-title">💰 Volumen: <strong>${currentCase.volume}</strong> - ${currentCase.frequency}</div>
                    </div>
                    <div class="risk-factor-card ${currentCase.pepStatus.includes('PEP') || currentCase.pepStatus.includes('político') ? 'high-risk' : 'low-risk'}">
                        <div class="risk-factor-title">🏛️ Estatus PEP: <strong>${currentCase.pepStatus}</strong></div>
                    </div>
                    <div class="risk-factor-card ${currentCase.fundsOrigin.includes('corrupción') || currentCase.fundsOrigin.includes('fiscal') ? 'high-risk' : ''}">
                         <div class="risk-factor-title">🔍 Origen de Fondos: <strong>${currentCase.fundsOrigin}</strong></div>
                    </div>
                </div>
                ${currentCase.alerts && currentCase.alerts.length > 0 ? `
                    <div class="alerts-container">
                        <h4>🚨 ALERTAS IDENTIFICADAS</h4>
                        <div class="alerts-grid">
                            ${currentCase.alerts.map(alert => `<span class="alert-tag">${alert}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="risk-selection">
                <h3>🎯 EVALUACIÓN FINAL DE RIESGO</h3>
                <div class="risk-options">
                    <div class="risk-option" onclick="kycApp.selectRisk('low', this)">
                        <div class="risk-option-icon">🟢</div> <h4 class="low-risk-text">RIESGO BAJO</h4>
                    </div>
                    <div class="risk-option" onclick="kycApp.selectRisk('medium', this)">
                        <div class="risk-option-icon">🟡</div> <h4 class="medium-risk-text">RIESGO MEDIO</h4>
                    </div>
                    <div class="risk-option" onclick="kycApp.selectRisk('high', this)">
                        <div class="risk-option-icon">🔴</div> <h4 class="high-risk-text">RIESGO ALTO</h4>
                    </div>
                </div>
            </div>

            <div class="justification-group">
                <label for="justification">📝 JUSTIFICACIÓN DE LA EVALUACIÓN:</label>
                <textarea id="justification" placeholder="Explica detalladamente las razones de tu evaluación... (mínimo 100 caracteres)"></textarea>
            </div>

            <div class="case-actions">
                ${index > 0 ? `<button class="btn btn-back" onclick="kycApp.previousCase()">← Caso Anterior</button>` : '<div></div>'}
                <button class="btn btn-primary" onclick="kycApp.saveAndNext()">
                    ${index < this.state.selectedCases.length - 1 ? 'Siguiente Caso →' : '✅ FINALIZAR INVESTIGACIÓN'}
                </button>
            </div>
        `;
    },

    selectRisk(level, element) {
        this.state.selectedRisk = level;
        document.querySelectorAll('.risk-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
        document.getElementById('justification').focus();
    },

    saveAndNext() {
        const justification = document.getElementById('justification').value;
        if (!this.state.selectedRisk) return alert('⚠️ Debes seleccionar un nivel de riesgo');
        if (justification.length < 100) return alert('⚠️ La justificación debe tener al menos 100 caracteres');
        
        this.state.responses[this.state.currentCaseIndex] = {
            risk: this.state.selectedRisk,
            justification: justification,
            correct: this.state.selectedRisk === this.state.selectedCases[this.state.currentCaseIndex].correctRisk
        };
        
        this.state.selectedRisk = null;
        if (this.state.currentCaseIndex < this.state.selectedCases.length - 1) {
            this.loadCase(this.state.currentCaseIndex + 1);
        } else {
            this.finishEvaluation();
        }
    },

    previousCase() {
        if (this.state.currentCaseIndex > 0) {
            this.loadCase(this.state.currentCaseIndex - 1);
        }
    },

    finishEvaluation() {
        clearInterval(this.state.timerInterval);
        
        const correctAnswers = this.state.responses.filter(r => r.correct).length;
        const totalQuestions = this.state.responses.length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        
        let gradeText, gradeClass;
        if (score >= 90) { gradeText = 'EXCELENTE'; gradeClass = 'badge-high'; } 
        else if (score >= 80) { gradeText = 'MUY BIEN'; gradeClass = 'badge-medium'; } 
        else if (score >= 70) { gradeText = 'APROBADO'; gradeClass = 'badge-low'; } 
        else { gradeText = 'REPROBADO'; gradeClass = 'badge-high'; }
        
        this.dom.evaluationScreen.style.display = 'none';
        this.dom.resultsScreen.style.display = 'block';
        
        this.dom.finalScore.textContent = `${score}%`;
        this.dom.gradeBadge.innerHTML = `<span class="risk-indicator-badge ${gradeClass}">${gradeText}</span>`;
        
        if (score >= 70) {
            this.dom.certificate.style.display = 'block';
            this.dom.certName.textContent = this.state.user.name.toUpperCase();
            this.dom.certDate.textContent = new Date().toLocaleDateString('es-MX');
            this.dom.certScore.textContent = `${score}%`;
            this.dom.certId.textContent = 'KYC-' + Date.now().toString(36).toUpperCase();
        } else {
            this.dom.certificate.style.display = 'none';
        }
        
        let detailsHTML = '<h2>📋 DETALLE DE EVALUACIONES</h2>';
        this.state.responses.forEach((response, index) => {
            const currentCase = this.state.selectedCases[index];
            detailsHTML += `
                <div class="result-card ${response.correct ? 'correct' : 'incorrect'}">
                    <h3>${response.correct ? '✅' : '❌'} Caso ${index + 1}: ${currentCase.name}</h3>
                    <p><strong>Tu evaluación:</strong> Riesgo ${response.risk.toUpperCase()}</p>
                    <p><strong>Evaluación correcta:</strong> Riesgo ${currentCase.correctRisk.toUpperCase()}</p>
                    <div class="explanation-box">
                        <strong>💡 Explicación:</strong>
                        <p>${currentCase.explanation}</p>
                    </div>
                </div>
            `;
        });
        this.dom.detailedResults.innerHTML = detailsHTML;
    }
};

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    kycApp.init();
});
