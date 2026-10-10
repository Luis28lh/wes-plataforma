@echo off
chcp 65001 > nul
title WES - Actualizar App de Pruebas (Staging)
echo ======================================================================
echo   WARN ELECTRICAL SERVICES (WES) - ACTUALIZAR ENTORNO DE PRUEBAS
echo ======================================================================
echo.
echo Este boton guarda tus cambios y los sube a la app de pruebas en la nube
echo (repositorio: Luis28lh/wes-plataforma-test)
echo para que puedas revisarlos en tu celular sin tocar la web principal.
echo.
echo Rama activa de trabajo: test
echo.
git checkout test 2>nul
if %errorlevel% neq 0 (
    git checkout -b test
)
git add .
set /p commitMsg="Escribe una breve nota del cambio (o pulsa ENTER para guardar directo): "
if "%commitMsg%"=="" set commitMsg=chore: actualizacion de pruebas en app movil
git commit -m "%commitMsg%" 2>nul
echo.
echo Sincronizando con el servidor de pruebas en la nube...
git push -u origin test
git push -u test-repo test:main --force
git push -u test-repo test:test --force
echo.
echo ======================================================================
echo [OK] ¡Cambios subidos a la App de Pruebas con exito!
echo Puedes refrescar la app en tu celular para ver los cambios.
echo ======================================================================
pause
