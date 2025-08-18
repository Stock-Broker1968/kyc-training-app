const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression()); // Comprimir respuestas
app.use(cors()); // Permitir CORS para integración con Hotmart
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true }));

// Headers de seguridad
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'ALLOWALL'); // Permitir iframe en Hotmart
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname), {
    maxAge: '1d', // Cache por 1 día
    etag: true
}));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para healthcheck
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'KYC Training App is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API endpoint para tracking (opcional)
app.post('/api/track', (req, res) => {
    const { userId, action, data } = req.body;
    console.log(`User ${userId} performed ${action}:`, data);
    res.json({ success: true });
});

// API endpoint para obtener estadísticas (opcional)
app.get('/api/stats', (req, res) => {
    res.json({
        totalUsers: 0,
        completionRate: 0,
        averageScore: 0,
        message: 'Stats endpoint ready for implementation'
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Algo salió mal',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 KYC Training App running on port ${PORT}`);
    console.log(`📊 Visit http://localhost:${PORT} to start training`);
    console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
    console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
});