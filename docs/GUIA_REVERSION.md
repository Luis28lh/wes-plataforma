# GUÍA DE RESTAURACIÓN Y REVERSIÓN INMEDIATA - WES

> **Documento Operativo de Emergencia**  
> En caso de fallo crítico en producción, sigue estrictamente este procedimiento para restaurar la plataforma a la última versión estable sin degradar bases de datos ni reintroducir vulnerabilidades.

---

## 1. Versión Estable de Referencia

- **Versión:** `v1.96` (Build 96)
- **Tag Git:** `v1.96-stable`
- **Ubicación de Respaldo Inmutable:** `docs/respaldos/v1.96_build96/`
- **Manifiesto:** `docs/respaldos/v1.96_build96/MANIFEST.json`

---

## 2. Procedimiento de Restauración Paso a Paso

### Caso A: Reversión Rápida de Archivos Publicados
Si una modificación rompió el diseño, el HTML o los scripts en el frontend:

1. Ejecuta el script de restauración automatizado:
   ```bash
   node scripts/restore_stable.js
   ```
   *(Este script copia los archivos validados de `docs/respaldos/v1.96_build96/` a la raíz y a `proyecto-wes/`, verificando sus sumas de comprobación).*

2. Verifica localmente con la suite pre-despliegue:
   ```bash
   node scripts/verify_preflight.js
   ```

3. Redespliega a Google Apps Script:
   ```bash
   node proyecto-wes/scripts/deploy_apps_script.js
   ```

4. Haz commit y push de la restauración a GitHub:
   ```bash
   git add -A
   git commit -m "revert: restaurar plataforma a version estable v1.96 (Build 96)"
   git push origin main
   git push v1 main
   ```

---

### Caso B: Reversión vía Git Tag
Si se requiere volver exactamente al estado del tag `v1.96-stable`:

```bash
git checkout v1.96-stable -- index.html admin.html panel.html control.html servicio-tecnico.html js/ proyecto-wes/
node proyecto-wes/scripts/deploy_apps_script.js
git commit -m "revert: restaurar codigo exacto desde tag v1.96-stable"
git push origin main
git push v1 main
```

---

## 3. Reglas de Oro de Reversión
1. **NO alterar bases de datos vivas:** La hoja de Google Sheets (`Cotizaciones`, `Soporte_Tecnico`, `Clientes`, `Auditoria`) NUNCA se sobreescribe durante una reversión de interfaz o código.
2. **NO reintroducir cuentas ni tokens eliminados:** No restaurar versiones anteriores a la Build 95 que contenían el bypass `'wes_owner_authorized_session'` o `secondaryEmail: 'wes.inform@gmail.com'`.
3. **Comprobación inmediata:** Tras revertir, verificar `web.warnelectricalservices.com` y la Web App de Apps Script en modo incógnito.
