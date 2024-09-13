---
title: '⚠️ {{ env.ACTION_TYPE }} Failed in {{ payload.repository.name }}'
assignees: 'testing'
labels: 'bug, automation'
---

La acción **{{ env.ACTION_TYPE }}** falló en la ejecución del flujo de trabajo en la rama **{{ github.ref }}**. Por favor, revisa los errores y toma las medidas necesarias.

### Detalles del error:

-   [Enlace al flujo de trabajo fallido]({{ github.server_url }}/{{ github.repository }}/actions/runs/{{ github.run_id }})

### Pasos a seguir:

1. Revisa los logs del flujo de trabajo para identificar los errores.
2. Aplica las correcciones necesarias según el contexto del fallo (ya sea de lint, build u otro).
3. Vuelve a hacer commit y push de los cambios para ejecutar el flujo de trabajo nuevamente.
