
# Módulo Extra – Reasignación de Turnos  
Examen Final – Desarrollo Web  
Universidad Mariano Gálvez de Guatemala

---

## 📌 Descripción del Módulo Implementado

Este módulo añade la funcionalidad de **reasignar turnos entre clínicas** dentro del sistema de gestión de turnos. Se desarrolló un modal donde el usuario puede seleccionar la nueva clínica y escribir el motivo del cambio.  
El sistema registra el cambio sin alterar el orden de los demás turnos.

---

## ✔ Funciones implementadas

### 1. Botón **Reasignar** en el listado de turnos  
Cada turno ahora muestra un botón que permite abrir el formulario de reasignación.

### 2. Modal elegante para reasignación  
El modal incluye:
- Selección de nueva clínica  
- Campo obligatorio de motivo  
- Botones Guardar / Cancelar  
- Notificación tipo “toast” al confirmar  

### 3. Reasignación con número de turno fijo  
Al mover un turno:
- Los demás turnos de la clínica original **no se reordenan**
- El turno reasignado recibe el **siguiente número disponible** en la nueva clínica
- Se garantiza la continuidad y trazabilidad de la cola

### 4. Registro de historial  
Cada cambio queda almacenado en la tabla:

`turno_reasignacion`

Incluye:
- Clínica anterior  
- Clínica nueva  
- Motivo  
- Fecha y hora  

### 5. Actualización de BD  
Se añadió la columna:

`numero_turno_clinica`  
para evitar recalcular números y mantener el orden original de cada clínica.

---

## 🛠 Tecnologías utilizadas

- Node.js (Express)  
- MySQL  
- EJS  
- HTML / CSS / JavaScript  
- Toast UI para notificaciones  
- Modal propio estilizado  

---
## Como Iniciar el proyecto
1. Cloncar el REPO
2. ejecutra npm install en la carpeta
3. correr script de bd
4. arrancar con npm run dev
5. ir a http://localhost:3000

## 👤 Autor

**Nombre:** Rodolfo Rodriguez
**Carné:** 5190-19-17416

---

## 📅 Fecha

15 de noviembre de 2025
