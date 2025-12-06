# forge-campo-dinamico

Proyecto Forge que crea dos campos personalizados en Jira Cloud dentro de la pestaña **CIERRE**:

- **Resuelto Por**: lista desplegable de usuarios filtrada por el cliente de la incidencia.
- **Dpto Resuelto Por**: lista desplegable de departamentos filtrada por el mismo cliente.

## Cómo funciona

1. El campo "Cliente" de la incidencia se consulta mediante la clave configurada en `CLIENT_FIELD_KEY` (por defecto `customfield_cliente`).
2. Según el valor del cliente, se toma la configuración declarada en `clientDirectory` para obtener usuarios y departamentos que se mostrarán como opciones.
3. Los valores seleccionados quedan almacenados en el campo personalizado y se muestran en modo lectura.

Puedes ajustar las listas de usuarios y departamentos en `src/index.jsx` para que reflejen los equipos y clientes reales de tu sitio Jira.

## Despliegue

1. Instala las dependencias y autentica Forge si aún no lo hiciste.
   ```bash
   npm install
   forge login
   ```
2. Actualiza el `app.id` en `manifest.yml` con el identificador de tu aplicación Forge registrada.
3. Despliega y vincula la aplicación al sitio Jira:
   ```bash
   forge deploy
   forge install --upgrade --product jira
   ```

Una vez instalada, añade los campos personalizados "Resuelto Por" y "Dpto Resuelto Por" a la pantalla de cierre de tus actividades en Jira.
