document.addEventListener('DOMContentLoaded', () => {
    let distancias = [];
    let alturas = [];
    let ejes = [];
    let medicionesEntreEjes = [];
    let         proyectoData = {
            titulo: '',
            area: '',
            propietario: '',
            fecha: new Date().toISOString().split('T')[0], // Fecha automática en formato YYYY-MM-DD
            actividad: 'MUROS LADRILLO LIMPIO',
            responsable: ''
        };

    const pdfForm = document.getElementById('pdfForm');
    const pdfPreview = document.getElementById('tabla');
    const alturaInput = document.getElementById('altura');

    // Agregar campos de proyecto al formulario
    function agregarCamposProyecto() {
        const form = document.getElementById('pdfForm');
        const fileInput = form.querySelector('#pdfFile');
        
        // Crear contenedor para los campos del proyecto
        const proyectoDiv = document.createElement('div');
        proyectoDiv.id = 'proyectoFields';
        proyectoDiv.style.cssText = 'margin: 20px 0; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;';
        
        proyectoDiv.innerHTML = `
            <h3>Información del Proyecto</h3>
            <div style="background-color: #e8f5e8; padding: 8px; margin-bottom: 10px; border-radius: 3px; border-left: 4px solid #4CAF50;">
                <small><strong>💾 Guardado automático:</strong> Los datos se guardan automáticamente en archivos JSON en la carpeta json/</small>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div>
                    <label for="titulo">Título del Proyecto:</label>
                    <input type="text" id="titulo" placeholder="Ingrese el título del proyecto" style="width: 100%; padding: 5px;">
                </div>
                <div>
                    <label for="area">Área:</label>
                    <input type="text" id="area" placeholder="Ingrese el área" style="width: 100%; padding: 5px;">
                </div>
                <div>
                    <label for="propietario">Propietario:</label>
                    <input type="text" id="propietario" placeholder="Ingrese el propietario" style="width: 100%; padding: 5px;">
                </div>
                <div>
                    <label for="fecha">Fecha:</label>
                    <input type="date" id="fecha" value="${proyectoData.fecha}" style="width: 100%; padding: 5px;">
                </div>
                <div>
                    <label for="actividad">Actividad:</label>
                    <select id="actividad" style="width: 100%; padding: 5px;">
                        <option value="MUROS LADRILLO LIMPIO">MUROS LADRILLO LIMPIO</option>
                        <option value="BLOQUE #5">BLOQUE #5</option>
                        <option value="PAÑETE">PAÑETE</option>
                        <option value="PASTA">PASTA</option>
                        <option value="PINTURA">PINTURA</option>
                    </select>
                </div>
                <div>
                    <label for="responsable">Responsable/Ejecutor:</label>
                    <input type="text" id="responsable" placeholder="Ingrese el responsable" style="width: 100%; padding: 5px;">
                </div>
            </div>
        `;
        
        // Insertar después del input de archivo
        fileInput.parentNode.insertBefore(proyectoDiv, fileInput.nextSibling);
        
        // Agregar event listeners para actualizar proyectoData
        document.getElementById('titulo').addEventListener('input', (e) => {
            proyectoData.titulo = e.target.value;
            guardarDatosAutomaticamente();
        });
        document.getElementById('area').addEventListener('input', (e) => {
            proyectoData.area = e.target.value;
            guardarDatosAutomaticamente();
        });
        document.getElementById('propietario').addEventListener('input', (e) => {
            proyectoData.propietario = e.target.value;
            guardarDatosAutomaticamente();
        });
        document.getElementById('fecha').addEventListener('input', (e) => {
            proyectoData.fecha = e.target.value;
            guardarDatosAutomaticamente();
        });
        document.getElementById('actividad').addEventListener('change', (e) => {
            proyectoData.actividad = e.target.value;
            guardarDatosAutomaticamente();
        });
        document.getElementById('responsable').addEventListener('input', (e) => {
            proyectoData.responsable = e.target.value;
            guardarDatosAutomaticamente();
        });
    }

    // Función para guardar datos automáticamente
    function guardarDatosAutomaticamente() {
        const datosParaGuardar = {
            proyectoData,
            medicionesEntreEjes,
            alturas,
            distancias,
            ejes,
            timestamp: new Date().toISOString()
        };
        
        // Guardar en localStorage
        localStorage.setItem('murosData', JSON.stringify(datosParaGuardar));
        
        // Guardar en archivo JSON en la carpeta json/
        guardarEnArchivoJSON(datosParaGuardar);
        
        console.log('Datos guardados automáticamente');
    }
    
    // Función para guardar en archivo JSON
    function guardarEnArchivoJSON(datos) {
        const fecha = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const nombreArchivo = `muros-autoguardado-${fecha.getFullYear()}${pad(fecha.getMonth()+1)}${pad(fecha.getDate())}-${pad(fecha.getHours())}${pad(fecha.getMinutes())}.json`;
        
        const json = {
            tipo: 'muros-autoguardado',
            fecha: fecha.toISOString(),
            datos: datos
        };
        
        const blob = new Blob([JSON.stringify(json, null, 2)], {type: 'application/json'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nombreArchivo;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`Archivo guardado: ${nombreArchivo}`);
    }
    
    // Función para cargar datos guardados
    function cargarDatosGuardados() {
        const datosGuardados = localStorage.getItem('murosData');
        if (datosGuardados) {
            try {
                const datos = JSON.parse(datosGuardados);
                proyectoData = datos.proyectoData || proyectoData;
                medicionesEntreEjes = datos.medicionesEntreEjes || [];
                alturas = datos.alturas || [];
                distancias = datos.distancias || [];
                ejes = datos.ejes || [];
                
                // Restaurar valores en los campos del formulario
                setTimeout(() => {
                    const tituloInput = document.getElementById('titulo');
                    const areaInput = document.getElementById('area');
                    const propietarioInput = document.getElementById('propietario');
                    const fechaInput = document.getElementById('fecha');
                    const actividadSelect = document.getElementById('actividad');
                    const responsableInput = document.getElementById('responsable');
                    const alturaInput = document.getElementById('altura');
                    
                    if (tituloInput) tituloInput.value = proyectoData.titulo || '';
                    if (areaInput) areaInput.value = proyectoData.area || '';
                    if (propietarioInput) propietarioInput.value = proyectoData.propietario || '';
                    if (fechaInput) fechaInput.value = proyectoData.fecha || '';
                    if (actividadSelect) actividadSelect.value = proyectoData.actividad || 'MUROS LADRILLO LIMPIO';
                    if (responsableInput) responsableInput.value = proyectoData.responsable || '';
                    if (alturaInput) alturaInput.value = alturas[0] || '';
                    
                    // Renderizar tabla si hay datos
                    if (medicionesEntreEjes.length > 0) {
                        renderTabla();
                    }
                }, 100);
                
                console.log('Datos cargados automáticamente');
            } catch (error) {
                console.error('Error al cargar datos guardados:', error);
            }
        }
    }
    
    // Llamar a la función para agregar campos
    agregarCamposProyecto();
    
    // Cargar datos guardados al iniciar
    cargarDatosGuardados();

    pdfForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('pdfFile');
        const file = fileInput.files[0];
        if (!file) {
            alert('Selecciona un PDF');
            return;
        }
        const reader = new FileReader();
        reader.onload = async function(event) {
            const typedarray = new Uint8Array(event.target.result);
            const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
            let texto = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                texto += content.items.map(item => item.str).join(' ') + ' ';
            }
            // Extraer números y buscar ejes
            const numeros = texto.match(/\d+(,\d+)?(\.\d+)?/g) || [];
            distancias = numeros.map(n => parseFloat(n.replace(',', '.')));
            
            // Buscar ejes con patrones más específicos (números en círculos, ejes principales)
            const patronesEjes = [
                /\bEJE\s*(\d+)\b/gi,           // EJE 1, EJE 2, etc.
                /\b(\d+)\s*[●○◯]\b/gi,         // Números seguidos de círculos
                /\b[●○◯]\s*(\d+)\b/gi,         // Círculos seguidos de números
                /\b(\d+)\s*[A-Z]\b/gi,         // Números seguidos de letras (A, B, C)
                /\b[A-Z]\s*(\d+)\b/gi,         // Letras seguidas de números
                /\b(\d+)\b/g                    // Números simples como respaldo
            ];
            
            let ejesEncontrados = [];
            patronesEjes.forEach(patron => {
                const matches = texto.match(patron);
                if (matches) {
                    matches.forEach(match => {
                        const numero = parseInt(match.replace(/[^0-9]/g, ''));
                        if (numero > 0 && numero < 1000) { // Filtrar números razonables
                            ejesEncontrados.push(numero);
                        }
                    });
                }
            });
            
            // Quitar duplicados y ordenar
            ejes = [];
            ejesEncontrados.forEach(e => { 
                if (!ejes.includes(e)) ejes.push(e); 
            });
            ejes.sort((a, b) => a - b);
            
            // Detectar colores y tipos de elementos
            const coloresDetectados = {
                muros: texto.match(/morado|violeta|púrpura|purple/gi) ? true : false,
                puertas: texto.match(/azul|blue/gi) ? true : false,
                ventanas: texto.match(/azul|blue/gi) ? true : false
            };
            
            console.log('Ejes detectados:', ejes);
            console.log('Colores detectados:', coloresDetectados);
            // Si hay al menos 2 ejes, calcular mediciones entre ejes consecutivos
            calcularMedicionesEntreEjes();
            alturas = Array(distancias.length).fill(parseFloat(alturaInput.value) || 0);
            renderTabla();
            guardarDatosAutomaticamente();
        };
        reader.readAsArrayBuffer(file);
    });

    function calcularMedicionesEntreEjes() {
        medicionesEntreEjes = [];
        // Solo usar ejes consecutivos y asociar cada distancia en orden
        if (ejes.length >= 2 && distancias.length > 0) {
            for (let i = 0; i < Math.min(ejes.length - 1, distancias.length); i++) {
                const ejeInicio = ejes[i];
                const ejeFin = ejes[i + 1];
                const distancia = distancias[i] || 0;
                medicionesEntreEjes.push({
                    ejeInicio,
                    ejeFin,
                    distancia,
                    descripcion: '' // Campo para descripción manual
                });
            }
        }
        
        // Si no hay suficientes ejes, crear mediciones con números secuenciales
        if (medicionesEntreEjes.length === 0 && distancias.length > 0) {
            for (let i = 0; i < distancias.length; i++) {
                medicionesEntreEjes.push({
                    ejeInicio: i + 1,
                    ejeFin: i + 2,
                    distancia: distancias[i] || 0,
                    descripcion: ''
                });
            }
        }
    }

    alturaInput.addEventListener('input', function() {
        alturas = Array(distancias.length).fill(parseFloat(alturaInput.value) || 0);
        renderTabla();
        guardarDatosAutomaticamente();
    });

    function handleAlturaChange(index, value) {
        alturas[index] = parseFloat((value + '').replace(',', '.')) || 0;
        renderTabla();
        guardarDatosAutomaticamente();
    }

    function handleEjeChange(index, ejeInicio, ejeFin, value) {
        const distancia = parseFloat((value + '').replace(',', '.')) || 0;
        if (medicionesEntreEjes[index]) {
            medicionesEntreEjes[index].distancia = distancia;
            distancias[index] = distancia;
            renderTabla();
            guardarDatosAutomaticamente();
        }
    }

    function handleObservacionChange(index, value) {
        if (medicionesEntreEjes[index]) {
            medicionesEntreEjes[index].observacion = value;
            guardarDatosAutomaticamente();
        }
    }

    function handleDescripcionChange(index, value) {
        if (medicionesEntreEjes[index]) {
            medicionesEntreEjes[index].descripcion = value;
            guardarDatosAutomaticamente();
        }
    }

    function handleIniciaEjeChange(index, value) {
        if (medicionesEntreEjes[index]) {
            medicionesEntreEjes[index].ejeInicio = value;
            guardarDatosAutomaticamente();
        }
    }

    function handleTerminaEjeChange(index, value) {
        if (medicionesEntreEjes[index]) {
            medicionesEntreEjes[index].ejeFin = value;
            guardarDatosAutomaticamente();
        }
    }

    function guardarJSON() {
        const filas = document.querySelectorAll('#tabla table tr');
        let datos = [];
        for (let i = 1; i < filas.length - 1; i++) { // Saltar encabezado y total
            const celdas = filas[i].querySelectorAll('td');
            const eje = celdas[0].textContent.trim();
            const ejeInicio = celdas[4].querySelector('input').value.trim();
            const ejeFin = celdas[5].querySelector('input').value.trim();
            const distancia = parseFloat(celdas[1].querySelector('input').value.replace(',', '.'));
            const altura = parseFloat(celdas[2].querySelector('input').value.replace(',', '.'));
            const area = parseFloat(celdas[3].textContent);
            const descripcion = celdas[6].querySelector('input').value;
            datos.push({eje, ejeInicio, ejeFin, distancia, altura, area, descripcion});
        }
        const totalArea = filas[filas.length-1].querySelectorAll('td')[1].textContent;
        const fecha = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const nombre = `muros-${fecha.getFullYear()}${pad(fecha.getMonth()+1)}${pad(fecha.getDate())}-${pad(fecha.getHours())}${pad(fecha.getMinutes())}${pad(fecha.getSeconds())}.json`;
        const json = {
            tipo: 'muros',
            fecha: fecha.toISOString(),
            totalArea,
            ejes: ejes,
            datos,
            proyecto: proyectoData
        };
        const blob = new Blob([JSON.stringify(json, null, 2)], {type: 'application/json'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nombre;
        link.click();
    }

    function guardarSoloDistanciasJSON() {
        const filas = document.querySelectorAll('#tabla table tr');
        let datos = [];
        for (let i = 1; i < filas.length - 1; i++) { // Saltar encabezado y total
            const celdas = filas[i].querySelectorAll('td');
            const eje = celdas[0].textContent.trim();
            const ejeInicio = celdas[4].querySelector('input').value.trim();
            const ejeFin = celdas[5].querySelector('input').value.trim();
            const distancia = parseFloat(celdas[1].querySelector('input').value.replace(',', '.'));
            const altura = parseFloat(celdas[2].querySelector('input').value.replace(',', '.'));
            const descripcion = celdas[6].querySelector('input').value;
            datos.push({eje, ejeInicio, ejeFin, distancia, altura, descripcion});
        }
        const fecha = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const nombre = `muros-distancias-${fecha.getFullYear()}${pad(fecha.getMonth()+1)}${pad(fecha.getDate())}-${pad(fecha.getHours())}${pad(fecha.getMinutes())}${pad(fecha.getSeconds())}.json`;
        const json = {
            tipo: 'muros-distancias',
            fecha: fecha.toISOString(),
            ejes: ejes,
            datos,
            proyecto: proyectoData
        };
        const blob = new Blob([JSON.stringify(json, null, 2)], {type: 'application/json'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nombre;
        link.click();
    }

    function exportarExcel() {
        const filas = document.querySelectorAll('#tabla table tr');
        let csv = '';
        filas.forEach(tr => {
            let row = [];
            tr.querySelectorAll('th,td').forEach(td => {
                let val = td.querySelector('input') ? td.querySelector('input').value : td.textContent;
                row.push('"' + val.replace(/"/g, '""') + '"');
            });
            csv += row.join(',') + '\n';
        });
        const blob = new Blob([csv], {type: 'text/csv'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'muros-tabla.csv';
        link.click();
    }

    function exportarPDF() {
        const filas = document.querySelectorAll('#tabla table tr');
        let rows = [];
        filas.forEach(tr => {
            let row = [];
            tr.querySelectorAll('th,td').forEach(td => {
                let val = td.querySelector('input') ? td.querySelector('input').value : td.textContent;
                row.push(val);
            });
            rows.push(row);
        });
        const doc = new window.jspdf.jsPDF({orientation: 'landscape'});
        doc.autoTable({ head: [rows[0]], body: rows.slice(1) });
        doc.save('muros-tabla.pdf');
    }

    function renderTabla() {
        if (!medicionesEntreEjes.length) {
            pdfPreview.innerHTML = '';
            return;
        }
        
        // Información del proyecto
        let proyectoInfo = '';
        if (proyectoData.titulo || proyectoData.area || proyectoData.propietario || proyectoData.fecha || proyectoData.actividad || proyectoData.responsable) {
            proyectoInfo = `
                <div style="background-color: #f0f0f0; padding: 15px; margin-bottom: 20px; border-radius: 5px; border: 1px solid #ddd;">
                    <h3 style="margin-top: 0; color: #333;">Información del Proyecto</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                        ${proyectoData.titulo ? `<div><strong>Título:</strong> ${proyectoData.titulo}</div>` : ''}
                        ${proyectoData.area ? `<div><strong>Área:</strong> ${proyectoData.area}</div>` : ''}
                        ${proyectoData.propietario ? `<div><strong>Propietario:</strong> ${proyectoData.propietario}</div>` : ''}
                        ${proyectoData.fecha ? `<div><strong>Fecha:</strong> ${proyectoData.fecha}</div>` : ''}
                        ${proyectoData.actividad ? `<div><strong>Actividad:</strong> ${proyectoData.actividad}</div>` : ''}
                        ${proyectoData.responsable ? `<div><strong>Responsable:</strong> ${proyectoData.responsable}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        let totalArea = 0;
        let html = proyectoInfo + '<table><tr><th>ITEM</th><th>Distancia (m)</th><th>Altura (m)</th><th>Área (m²)</th><th>EJE</th><th>Inicia Eje</th><th>Termina Eje</th><th>Descripción/Ubicación</th></tr>';
        medicionesEntreEjes.forEach((item, i) => {
            const distancia = item.distancia;
            const altura = alturas[i] || 0;
            const area = (!isNaN(altura)) ? (distancia * altura).toFixed(2) : '';
            totalArea += parseFloat(area) || 0;
            const ejeDisplay = `${item.ejeInicio} - ${item.ejeFin}`;
            html += `<tr>
                <td>${i + 1}</td>
                <td><input type="number" step="0.01" min="0" value="${distancia}" onchange="window.handleEjeChangeMuros(${i}, '${item.ejeInicio}', '${item.ejeFin}', this.value)"></td>
                <td><input type="number" step="0.01" min="0" value="${altura}" onchange="window.handleAlturaChangeMuros(${i}, this.value)"></td>
                <td>${area}</td>
                <td><input type="text" name="eje_${i}" value="${item.ejeInicio}" onchange="window.handleEjeChangeMuros(${i}, this.value)"></td>
                <td><input type="text" name="inicia_eje_${i}" value="${item.ejeInicio}" onchange="window.handleIniciaEjeChangeMuros(${i}, this.value)"></td>
                <td><input type="text" name="termina_eje_${i}" value="${item.ejeFin}" onchange="window.handleTerminaEjeChangeMuros(${i}, this.value)"></td>
                <td><input type="text" name="desc_${i}" placeholder="Descripción o ubicación" value="${item.descripcion || ''}" onchange="window.handleDescripcionChangeMuros(${i}, this.value)"></td>
            </tr>`;
        });
        html += `<tr><td colspan="4" style="text-align:right;font-weight:bold;">Suma total de áreas:</td><td colspan="3" style="font-weight:bold;">${totalArea.toFixed(2)} m²</td></tr>`;
        html += '</table>';
        if (ejes.length > 0) {
            html += `<p><strong>Ejes detectados:</strong> ${ejes.join(', ')}</p>`;
            html += `<p><em>Nota: Los ejes se detectan buscando números en círculos, letras con números, y patrones "EJE X". Si algún eje no se detecta correctamente, puedes editarlo manualmente en las columnas Inicia Eje y Termina Eje.</em></p>`;
        }
        html += '<div style="margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px;">';
        html += '<h4 style="margin-top: 0;">Gestión de archivos:</h4>';
        html += '<button id="guardarJsonBtn">Guardar JSON</button>';
        html += '<button id="guardarDistanciasBtn" style="margin-left:10px;">Guardar solo distancias</button>';
        html += '<button id="cargarJsonBtn" style="margin-left:10px; background-color: #4CAF50; color: white;">Cargar JSON guardado</button>';
        html += '<button id="exportarExcelBtn" style="margin-left:10px;">Exportar a Excel</button>';
        html += '<button id="exportarPdfBtn" style="margin-left:10px;">Exportar a PDF</button>';
        html += '<button id="limpiarDatosBtn" style="margin-left:10px; background-color: #ff4444; color: white;">Limpiar datos guardados</button>';
        html += '</div>';
        pdfPreview.innerHTML = html;
        document.getElementById('guardarJsonBtn').onclick = guardarJSON;
        document.getElementById('guardarDistanciasBtn').onclick = guardarSoloDistanciasJSON;
        document.getElementById('cargarJsonBtn').onclick = cargarArchivoJSON;
        document.getElementById('exportarExcelBtn').onclick = exportarExcel;
        document.getElementById('exportarPdfBtn').onclick = exportarPDF;
        document.getElementById('limpiarDatosBtn').onclick = limpiarDatosGuardados;
    }

    // Función para cargar archivo JSON guardado
    function cargarArchivoJSON() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    try {
                        const jsonData = JSON.parse(event.target.result);
                        if (jsonData.tipo === 'muros-autoguardado' && jsonData.datos) {
                            // Restaurar datos
                            proyectoData = jsonData.datos.proyectoData || proyectoData;
                            medicionesEntreEjes = jsonData.datos.medicionesEntreEjes || [];
                            alturas = jsonData.datos.alturas || [];
                            distancias = jsonData.datos.distancias || [];
                            ejes = jsonData.datos.ejes || [];
                            
                            // Restaurar valores en los campos
                            setTimeout(() => {
                                const tituloInput = document.getElementById('titulo');
                                const areaInput = document.getElementById('area');
                                const propietarioInput = document.getElementById('propietario');
                                const fechaInput = document.getElementById('fecha');
                                const actividadSelect = document.getElementById('actividad');
                                const responsableInput = document.getElementById('responsable');
                                const alturaInput = document.getElementById('altura');
                                
                                if (tituloInput) tituloInput.value = proyectoData.titulo || '';
                                if (areaInput) areaInput.value = proyectoData.area || '';
                                if (propietarioInput) propietarioInput.value = proyectoData.propietario || '';
                                if (fechaInput) fechaInput.value = proyectoData.fecha || '';
                                if (actividadSelect) actividadSelect.value = proyectoData.actividad || 'MUROS LADRILLO LIMPIO';
                                if (responsableInput) responsableInput.value = proyectoData.responsable || '';
                                if (alturaInput) alturaInput.value = alturas[0] || '';
                                
                                // Renderizar tabla si hay datos
                                if (medicionesEntreEjes.length > 0) {
                                    renderTabla();
                                }
                                
                                alert('Archivo JSON cargado correctamente');
                            }, 100);
                        } else {
                            alert('El archivo no es un archivo de guardado válido');
                        }
                    } catch (error) {
                        alert('Error al cargar el archivo JSON: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // Función para limpiar datos guardados
    function limpiarDatosGuardados() {
        if (confirm('¿Estás seguro de que quieres limpiar todos los datos guardados? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('murosData');
            location.reload(); // Recargar la página para limpiar todo
        }
    }

    window.handleAlturaChangeMuros = handleAlturaChange;
    window.handleEjeChangeMuros = handleEjeChange;
    window.handleIniciaEjeChangeMuros = handleIniciaEjeChange;
    window.handleTerminaEjeChangeMuros = handleTerminaEjeChange;
    window.handleDescripcionChangeMuros = handleDescripcionChange;
});
