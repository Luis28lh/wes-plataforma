@echo off
chcp 65001 > nul
title WES - Publicar a Produccion (Rama Principal)
echo ======================================================================
echo   WARN ELECTRICAL SERVICES (WES) - PUBLICAR A PRODUCCION (PRINCIPAL)
echo ======================================================================
echo.
echo ADVERTENCIA:
echo Este proceso tomara todos los cambios probados en la app de pruebas
echo y los publicara en la web oficial de PRODUCCION (web.warnelectricalservices.com).
echo.
set /p confirmacion="¿Deseas publicar los cambios a produccion ahora? (S/N): "
if /i not "%confirmacion%"=="S" (
    echo Operacion cancelada por el usuario.
    pause
    exit /b
)
echo.
echo 1. Asegurando cambios en la rama de pruebas (test)...
git checkout test 2>nul
git add .
git diff-index --quiet HEAD -- || git commit -m "feat(staging): cambios probados listos para produccion"
git push -u origin test
echo.
echo 2. Pasando a la rama principal (main)...
git checkout main
if %errorlevel% neq 0 (
    echo Error al cambiar a la rama principal. Revisa el estado del proyecto.
    pause
    exit /b
)
git pull origin main
echo.
echo 3. Fusionando cambios de pruebas a produccion...
git merge test -m "feat(release): promocion automatica desde entorno de pruebas a produccion"
if %errorlevel% neq 0 (
    echo [ALERTA] Hubo un conflicto al fusionar. Resuelvelo antes de continuar.
    pause
    exit /b
)
echo.
echo 4. Publicando a produccion en la nube...
git push origin main
echo.
echo 5. Regresando a la rama de pruebas (test) para trabajo seguro...
git checkout test
echo.
echo ======================================================================
echo [EXITO TOTAL] ¡Plataforma publicada en produccion oficialmente!
echo Tu entorno local quedo configurado nuevamente en 'test' para que
echo sigas probando seguro sin alterar produccion.
echo ======================================================================
pause