/**
 * SISTEMA DE GESTIÓN – PLAZA MEGATÓN
 * Google Apps Script v1.0 — Backend en Google Sheets y Google Drive
 * 
 * Instrucciones:
 * 1. Crea una Hoja de Cálculo en Google Drive llamada: PLAZA_MEGATON_DATABASE
 * 2. Ve a Extensiones > Apps Script
 * 3. Reemplaza el código con este archivo
 * 4. Ejecuta una vez la función "inicializarBaseDeDatos()" para crear todas las pestañas y carpetas automáticamente
 * 5. Haz clic en "Implementar" > "Nueva implementación" > Tipo: "Aplicación web"
 *    - Ejecutar como: "Yo"
 *    - Quién tiene acceso: "Cualquier persona" (para permitir Webhook desde tu servidor)
 * 6. Copia la URL de la aplicación web y colócala en tu archivo .env como GOOGLE_APPS_SCRIPT_URL
 */

function inicializarBaseDeDatos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var pestañasRequeridas = [
    {
      nombre: 'USUARIOS',
      cabeceras: ['user_id', 'nombre', 'email', 'teléfono', 'fecha_registro', 'estado']
    },
    {
      nombre: 'CUBICULOS',
      cabeceras: ['cubiculo_id', 'codigo', 'estado', 'observaciones']
    },
    {
      nombre: 'USUARIO_CUBICULO',
      cabeceras: ['id', 'user_id', 'cubiculo_id', 'fecha_asignacion', 'estado']
    },
    {
      nombre: 'RECLAMACIONES',
      cabeceras: ['codigo', 'fecha', 'hora', 'user_id', 'email', 'cubiculo', 'asunto', 'detalle', 'archivos', 'estado', 'responsable', 'fecha_actualizacion']
    },
    {
      nombre: 'PAGOS',
      cabeceras: ['codigo', 'fecha_registro', 'user_id', 'email', 'cubiculo', 'concepto', 'periodo', 'monto', 'fecha_pago', 'referencia', 'voucher', 'estado', 'observaciones']
    },
    {
      nombre: 'CONFIGURACION',
      cabeceras: ['parametro', 'valor']
    },
    {
      nombre: 'HISTORIAL',
      cabeceras: ['id', 'tipo_documento', 'codigo_documento', 'fecha', 'hora', 'usuario', 'accion', 'estado_anterior', 'estado_nuevo', 'observacion']
    }
  ];

  pestañasRequeridas.forEach(function(item) {
    var sheet = ss.getSheetByName(item.nombre);
    if (!sheet) {
      sheet = ss.insertSheet(item.nombre);
      sheet.appendRow(item.cabeceras);
      sheet.getRange(1, 1, 1, item.cabeceras.length).setFontWeight('bold').setBackground('#D32F2F').setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }
  });

  // Precargar cubículos si está vacío
  var sheetCub = ss.getSheetByName('CUBICULOS');
  if (sheetCub.getLastRow() <= 1) {
    var cubData = [];
    for (var i = 1; i <= 30; i++) {
      var cod = 'C-' + (i < 10 ? '00' + i : (i < 100 ? '0' + i : i));
      cubData.push(['CUB-' + (i < 10 ? '00' + i : i), cod, 'Disponible', 'Nivel 1']);
    }
    sheetCub.getRange(2, 1, cubData.length, 4).setValues(cubData);
  }

  // Crear carpetas en Google Drive
  crearCarpetasDrive();

  Logger.log('¡Base de Datos Plaza Megatón inicializada con éxito!');
}

function crearCarpetasDrive() {
  var rootFolders = DriveApp.getFoldersByName('PLAZA MEGATÓN');
  var rootFolder = rootFolders.hasNext() ? rootFolders.next() : DriveApp.createFolder('PLAZA MEGATÓN');

  var reclFolders = rootFolder.getFoldersByName('01 - RECLAMACIONES');
  if (!reclFolders.hasNext()) {
    rootFolder.createFolder('01 - RECLAMACIONES');
  }

  var pagosFolders = rootFolder.getFoldersByName('02 - PAGOS');
  if (!pagosFolders.hasNext()) {
    rootFolder.createFolder('02 - PAGOS');
  }

  return rootFolder.getId();
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var payload = contents.payload;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'SYNC_USUARIO') {
      var sheet = ss.getSheetByName('USUARIOS');
      sheet.appendRow([
        payload.user_id,
        payload.nombre,
        payload.email,
        payload.telefono || '',
        payload.fecha_registro,
        payload.estado || 'Activo'
      ]);
      return responseJSON({ success: true, message: 'Usuario sincronizado' });
    }

    if (action === 'SYNC_ASIGNACIONES') {
      var sheetUC = ss.getSheetByName('USUARIO_CUBICULO');
      var sheetCub = ss.getSheetByName('CUBICULOS');
      var cubData = sheetCub.getDataRange().getValues();

      (payload.cubiculos || []).forEach(function(cod) {
        var relId = 'UC-' + Date.now();
        sheetUC.appendRow([relId, payload.userId, cod, new Date().toLocaleDateString('es-DO'), 'Activo']);

        // Marcar Ocupado en CUBICULOS
        for (var r = 1; r < cubData.length; r++) {
          if (cubData[r][1] == cod) {
            sheetCub.getRange(r + 1, 3).setValue('Ocupado');
            break;
          }
        }
      });
      return responseJSON({ success: true, message: 'Asignaciones guardadas' });
    }

    if (action === 'SYNC_RECLAMACION') {
      var sheetRec = ss.getSheetByName('RECLAMACIONES');
      sheetRec.appendRow([
        payload.codigo,
        payload.fecha,
        payload.hora,
        payload.user_id,
        payload.email,
        payload.cubiculo,
        payload.asunto,
        payload.detalle,
        Array.isArray(payload.archivos) ? payload.archivos.join('; ') : (payload.archivos || ''),
        payload.estado,
        payload.responsable || 'Sin asignar',
        payload.fecha_actualizacion
      ]);
      return responseJSON({ success: true, message: 'Reclamación sincronizada' });
    }

    if (action === 'SYNC_PAGO') {
      var sheetPag = ss.getSheetByName('PAGOS');
      sheetPag.appendRow([
        payload.codigo,
        payload.fecha_registro,
        payload.user_id,
        payload.email,
        payload.cubiculo,
        payload.concepto,
        payload.periodo,
        payload.monto,
        payload.fecha_pago,
        payload.referencia || '',
        payload.voucher || '',
        payload.estado,
        payload.observaciones || ''
      ]);
      return responseJSON({ success: true, message: 'Pago sincronizado' });
    }

    return responseJSON({ success: false, error: 'Acción no soportada' });
  } catch (err) {
    return responseJSON({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return responseJSON({
    status: 'ONLINE',
    plaza: 'PLAZA MEGATÓN',
    sheets: ss.getSheets().map(function(s) { return s.getName(); })
  });
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
