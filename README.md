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

# Memento Academy - Twitter Marketing Strategy

## Overview

Complete marketing automation system for Memento Academy with:

- **Bilingual content** (English & Spanish)
- **Course promotion** for all 4 free courses
- **Weekly posting schedule** optimized for engagement
- **New follower welcome system** (auto-reply)

---

## Weekly Posting Schedule

### Distribution (19 tweets/week)

**Monday** (3 tweets)

- 09:00 UTC - Motivation (EN)
- 14:00 UTC - Web3 Basics course (EN)
- 20:00 UTC - Industry insight (ES)

**Tuesday** (3 tweets)

- 09:00 UTC - Crypto 101 course (ES)
- 14:00 UTC - Community engagement (EN)
- 20:00 UTC - Educational value (EN)

**Wednesday** (3 tweets)

- 09:00 UTC - Engagement question (ES)
- 14:00 UTC - CBDC course (EN)
- 20:00 UTC - Community engagement (ES)

**Thursday** (3 tweets)

- 09:00 UTC - Educational value (EN)
- 14:00 UTC - Security course (ES)
- 20:00 UTC - Educational value (EN)

**Friday** (3 tweets)

- 09:00 UTC - Call-to-action (ES)
- 14:00 UTC - Engagement question (EN)
- 20:00 UTC - Web3 Basics course (ES)

**Saturday** (2 tweets)

- 10:00 UTC - Weekend learning (EN)
- 16:00 UTC - Educational value (ES)

**Sunday** (2 tweets)

- 10:00 UTC - Week prep (ES)
- 18:00 UTC - Call-to-action (EN)

---

## Content Strategy

### 1. Course Promotions (40%)

Rotating promotion of all 4 free courses:

#### Web3 Basics

- URL: `https://memento-academy.com/[en/es]/learn/web3-basics`
- Duration: 45 min
- Target: Absolute beginners
- Key message: "Understanding the new era of the internet"

#### Crypto 101

- URL: `https://memento-academy.com/[en/es]/learn/crypto-101`
- Duration: 60 min
- Target: Crypto newcomers
- Key message: "Everything about cryptocurrencies without the noise"

#### Understanding CBDCs

- URL: `https://memento-academy.com/[en/es]/learn/cbdc`
- Duration: 40 min
- Target: Finance-conscious users
- Key message: "How digital currencies will affect your money"

#### Security Guide

- URL: `https://memento-academy.com/[en/es]/learn/safety`
- Duration: 50 min
- Target: Anyone holding crypto
- Key message: "Protect yourself from scams"

### 2. Educational Value (25%)

Quick tips and insights:

- Fun facts about crypto history
- Simple explanations of complex concepts
- Industry trends and predictions
- Key differences (Bitcoin vs Ethereum, etc.)

### 3. Community Building (20%)

- Discord community links: `https://discord.gg/MWfHKfjYS7`
- Highlight 50K+ learners milestone
- Encourage questions and discussions
- Beginner-friendly messaging

### 4. Engagement Questions (10%)

- Ask about first crypto experience
- Request topic suggestions
- Solicit feedback on content format
- Identify learning barriers

### 5. Calls-to-Action (5%)

- Newsletter signup
- Course exploration
- Community joining
- Social proof (testimonials)

---

## Language Distribution

**Bilingual Strategy:**

- ~50% English tweets
- ~50% Spanish tweets
- Alternating throughout the week
- Both languages link to respective course URLs

**Why Bilingual?**

- Crypto/Web3 is global
- Large Spanish-speaking crypto community
- Memento Academy supports both languages
- Expands reach significantly

---

## New Follower Welcome System

### How It Works

1. **Check Frequency**: Every 2 hours
2. **Detection**: Compares current followers vs previous check
3. **Welcome Action**: Sends public welcome tweet mentioning new follower
4. **Tracking**: Stores welcomed users to avoid duplicates

### Welcome Messages (3 variations per language)

**English:**

1. "Welcome to Memento Academy! We're excited to have you here. Start your Web3 journey with our free courses: https://memento-academy.com/en/courses"
2. "Thanks for following! New to Web3? No problem. We break down complex topics into simple lessons. Check out our free courses: https://memento-academy.com/en/courses"
3. "Hey there! Welcome to the Memento Academy community. Explore our free Web3 courses and join 50K+ learners: https://memento-academy.com/en/courses"

**Spanish:**

1. "¡Bienvenido a Memento Academy! Nos emociona tenerte aquí. Comienza tu viaje Web3 con nuestros cursos gratuitos: https://memento-academy.com/es/courses"
2. "¡Gracias por seguirnos! ¿Nuevo en Web3? No hay problema. Desglosamos temas complejos en lecciones simples. Mira nuestros cursos gratuitos: https://memento-academy.com/es/courses"
3. "¡Hola! Bienvenido a la comunidad de Memento Academy. Explora nuestros cursos gratuitos de Web3 y únete a más de 50K estudiantes: https://memento-academy.com/es/courses"

### Alternative: Direct Messages

If you have Twitter API v2 elevated access with DM permissions:

- Uncomment DM functionality in `follower-welcome.js`
- Sends private welcome message instead of public tweet
- More personal, less spammy
- Requires user to follow you back

---

## Files Structure

```
twitter-bot/
├── index.js                          # Main bot with scheduling
├── follower-welcome.js               # New follower detection & welcome
├── scheduled-tweets.json             # Active tweet schedule (marketing)
├── scheduled-tweets-basic.json.backup # Original simple tweets
├── marketing-tweets-bilingual.json   # Tweet library (reference)
├── followers-data.json               # Tracked followers (auto-generated)
└── MARKETING_STRATEGY.md            # This file
```

---

## Key Metrics to Track

1. **Engagement Rate**

   - Likes, retweets, replies per tweet
   - Best performing content types
   - Best performing times

2. **Course Click-Through Rate**

   - Track URL clicks to course pages
   - Compare EN vs ES performance
   - Identify most popular courses

3. **Community Growth**

   - New followers per week
   - Discord joins from Twitter
   - Newsletter signups

4. **Content Performance**
   - Questions vs statements
   - Course promos vs educational value
   - EN vs ES engagement

---

## Optimization Tips

### If Engagement is Low:

- Increase question tweets (drive replies)
- Add more visual content (images/videos)
- Adjust posting times for audience timezone
- Test different CTAs

### If Course Clicks are Low:

- Shorten tweet text, emphasize value
- Test different course descriptions
- Highlight "FREE" more prominently
- Add social proof (number of students)

### If Follower Growth is Low:

- Engage with Web3/crypto influencers
- Reply to relevant conversations
- Use trending hashtags strategically
- Run Twitter polls

---

## Content Rotation Strategy

### Weekly Rotation

**Week 1**: Focus on Web3 Basics + Crypto 101
**Week 2**: Focus on CBDCs + Security
**Week 3**: Mix all four courses
**Week 4**: Premium course teasers + community

### Monthly Themes

**Month 1**: Beginner onboarding
**Month 2**: Security and safety
**Month 3**: Advanced topics teasers
**Month 4**: Community success stories

---

## Deployment on Railway

When you update content or strategy:

```bash
# Update tweets
git add scheduled-tweets.json
git commit -m "Update: new tweet schedule"
git push

# Railway auto-deploys!
```

Bot will automatically:

- Load new schedule
- Continue follower checks
- Apply changes without downtime

---

## Future Enhancements

### Planned Features:

1. **Reply to mentions** - Auto-respond to common questions
2. **Thread posting** - Multi-tweet educational threads
3. **Media support** - Images/infographics in tweets
4. **A/B testing** - Test different tweet variations
5. **Analytics dashboard** - Track performance metrics
6. **Sentiment analysis** - Monitor community sentiment
7. **Trending topics** - Auto-post about Web3 news

### Premium Features (if budget allows):

1. **Twitter Ads** - Promote high-performing tweets
2. **Influencer outreach** - Partner with Web3 educators
3. **Giveaways** - Course completion NFTs
4. **AMA sessions** - Live Q&A with experts

---

## Support & Maintenance

### Daily Tasks (Automated):

- Tweet posting per schedule
- New follower detection and welcome
- Error logging

### Weekly Tasks (Manual):

- Review engagement metrics
- Adjust poorly performing tweets
- Respond to high-value replies
- Check Railway logs for errors

### Monthly Tasks (Manual):

- Rotate tweet content
- Update course links if needed
- Analyze growth trends
- Plan next month's themes

---

## Contact & Resources

- **Main Site**: https://memento-academy.com
- **Discord**: https://discord.gg/MWfHKfjYS7
- **Twitter**: @memento_academy
- **GitHub**: https://github.com/CallejaJ/twitter-bot

---

_Last Updated: January 2026_
_Bot Version: 2.0 (Marketing Edition)_
