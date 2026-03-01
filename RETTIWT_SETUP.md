9\*## 🔑 Configuración de Rettiwt API - Guía de Setup

El bot ahora usa **Rettiwt API** en lugar de la API oficial de Twitter (que pasó a ser de pago en 2026).

### ✅ Ventajas

- **100% GRATUITO** - Sin costos mensuales
- **Sin límites** - Publica tweets ilimitados
- **Funciona igual** - Mismo flujo de tweets automatizados

### 📋 Pasos para obtener tu API_KEY

#### 1. Instala la extensión del navegador

Necesitas la extensión de Rettiwt para extraer tu API_KEY:

**Para Chrome:**

- Descarga desde: https://github.com/Rishikant181/Rettiwt-API#readme
- Busca "Rettiwt" en Chrome Web Store (si está disponible)
- O instálala desde el archivo ZIP siguiendo las instrucciones del repo

**Para Firefox:**

- Similar al proceso de Chrome

#### 2. Abre X.com en modo incógnito

```bash
# Importante: Usa modo incógnito/privado
# Esto asegura una sesión limpia sin cookies conflictivas
```

#### 3. Inicia sesión en X.com

Usa tu cuenta de Twitter/X normal

#### 4. Extrae el API_KEY

Haz clic en el icono de la extensión de Rettiwt en la barra de herramientas → Copia el API_KEY que aparece

#### 5. Actualiza tu `.env`

Abre el archivo `.env` en la raíz del proyecto y reemplaza:

```env
RETTIWT_API_KEY=your_api_key_here
```

Con tu API_KEY real (sin comillas):

```env
RETTIWT_API_KEY=abc123def456ghi789...
```

#### 6. Guarda y reinicia el bot

```bash
npm start
```

Deberías ver el mensaje: `[✓ Rettiwt connected]`

---

### 🔒 Seguridad

- El API_KEY es válido **5 años** (si lo extraes en modo incógnito)
- No compartas tu API_KEY públicamente
- Si alguien lo obtiene, pueden publicar tweets en tu nombre
- Para regenerar: repite los pasos 2-4

---

### ❓ Preguntas frecuentes

**P: ¿El bot puede ser baneado por usar Rettiwt?**  
R: Riesgo muy bajo. Rettiwt simula navegador real, no es obvio que es un bot.

**P: ¿Cuánto tiempo tarda en obtener el API_KEY?**  
R: 5 minutos aprox.

**P: ¿Necesito mantener la extensión instalada?**  
R: No, solo para extraer el API_KEY. Una vez que lo tengas en `.env`, ya no la necesitas.

**P: ¿Funciona con Bluesky y Lens/Hey también?**  
R: Sí, esos siguen funcionando como antes.

---

### 🧪 Después de configurar

Una vez que pegues el API_KEY en `.env`, prueba la conexión:

```bash
npm start
```

Deberías ver en logs:

```
[✓ Rettiwt connected]
[Bot running... Press Ctrl+C to stop]
```

¡Listo! El bot debería empezar a publicar tweets según tu horario en `scheduled-tweets.json`

---

**Referencia base:** https://github.com/Rishikant181/Rettiwt-API
