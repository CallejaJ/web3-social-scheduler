# Bot de Twitter Automatizado

Bot para publicar tweets programados automáticamente usando la API de Twitter (X).

## Requisitos

- Node.js (versión 14 o superior)
- Una cuenta de Twitter Developer
- Credenciales de la API de Twitter

## Configuración

### 1. Obtener credenciales de Twitter API

1. Ve a [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Crea un nuevo proyecto y app (o usa uno existente)
3. En la sección de tu app, ve a "Keys and tokens"
4. Genera y guarda:
   - API Key (Consumer Key)
   - API Secret (Consumer Secret)
   - Access Token
   - Access Token Secret

**IMPORTANTE:** Asegúrate de que tu app tenga permisos de **Read and Write** en la configuración de "User authentication settings".

### 2. Configurar el bot

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` y añade tus credenciales:
   ```
   TWITTER_API_KEY=tu_api_key_aqui
   TWITTER_API_SECRET=tu_api_secret_aqui
   TWITTER_ACCESS_TOKEN=tu_access_token_aqui
   TWITTER_ACCESS_SECRET=tu_access_secret_aqui
   ```

### 3. Configurar tweets programados

Edita el archivo `scheduled-tweets.json` para añadir tus tweets y horarios.

#### Formato de horarios (Cron)

El formato cron es: `minuto hora día mes día_semana`

**Ejemplos:**
- `0 9 * * *` - Todos los días a las 9:00 AM
- `30 14 * * *` - Todos los días a las 2:30 PM
- `0 8 * * 1` - Cada lunes a las 8:00 AM
- `0 20 * * 5` - Cada viernes a las 8:00 PM
- `*/30 * * * *` - Cada 30 minutos

**Días de la semana:**
- 0 = Domingo
- 1 = Lunes
- 2 = Martes
- 3 = Miércoles
- 4 = Jueves
- 5 = Viernes
- 6 = Sábado

#### Ejemplo de configuración:

```json
{
  "tweets": [
    {
      "schedule": "0 9 * * *",
      "text": "¡Buenos días! 🌅"
    },
    {
      "schedule": "0 12 * * 1",
      "text": "¡Feliz lunes! Nueva semana, nuevas oportunidades."
    }
  ]
}
```

## Uso

### Instalar dependencias

```bash
npm install
```

### Ejecutar el bot

```bash
node index.js
```

El bot:
1. Verificará la conexión con Twitter
2. Cargará los tweets programados desde `scheduled-tweets.json`
3. Se quedará ejecutando y publicará tweets según los horarios configurados

### Detener el bot

Presiona `Ctrl+C` en la terminal.

## Ejecutar como servicio

Para mantener el bot ejecutándose permanentemente, puedes usar:

### En Windows (con PM2):

```bash
npm install -g pm2
pm2 start index.js --name twitter-bot
pm2 save
pm2 startup
```

### En Linux/Mac (con systemd o PM2):

Opción 1 - PM2 (recomendado):
```bash
npm install -g pm2
pm2 start index.js --name twitter-bot
pm2 save
pm2 startup
```

Opción 2 - screen:
```bash
screen -S twitter-bot
node index.js
# Presiona Ctrl+A, luego D para desconectar
# Para reconectar: screen -r twitter-bot
```

## Límites de la API de Twitter

- API Gratuita: 1,500 tweets por mes
- Respeta los límites de tasa para evitar suspensiones
- No hagas spam ni violes las políticas de Twitter

## Solución de problemas

### Error 401 (Unauthorized)
- Verifica que tus credenciales en `.env` sean correctas
- Asegúrate de que tu app tenga permisos de "Read and Write"

### Error 403 (Forbidden)
- Tu cuenta puede estar restringida
- Verifica que tu app esté aprobada en el Developer Portal

### Error 429 (Rate Limit)
- Has excedido los límites de tasa
- Espera antes de intentar publicar más tweets

## Seguridad

- **NUNCA** compartas tu archivo `.env` ni lo subas a Git
- Mantén tus credenciales privadas
- El archivo `.gitignore` ya está configurado para proteger `.env`

## Licencia

Uso personal libre.
