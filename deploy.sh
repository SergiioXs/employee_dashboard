#!/bin/bash

# Script para compilar y preparar para producción
echo "🔧 Compilando aplicación React..."

# Limpiar build anterior
rm -rf build

# Instalar dependencias si es necesario
echo "📦 Verificando dependencias..."
npm ci --only=production

# Ejecutar tests
echo "🧪 Ejecutando tests..."
npm test -- --watchAll=false

# Compilar para producción
echo "🏗️  Compilando aplicación..."
npm run build

# Verificar tamaño del build
echo "📊 Analizando tamaño del build..."
du -sh build/
echo "📁 Estructura del build:"
ls -la build/

# Optimizar imágenes (opcional)
echo "🖼️  Optimizando imágenes..."
cd build
find . -name "*.png" -exec optipng -o5 {} \;
find . -name "*.jpg" -exec jpegoptim --max=90 {} \;

echo "✅ Compilación completada! Los archivos están en la carpeta 'build/'"
echo "📤 Sube la carpeta 'build/' a tu servidor"