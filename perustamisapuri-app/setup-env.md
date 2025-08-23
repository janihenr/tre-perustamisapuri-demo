# Ympäristömuuttujien asennus

## OpenAI API-avaimen lisääminen

1. Luo `.env.local` tiedosto projektin juureen (jos ei ole jo olemassa)
2. Lisää OpenAI API-avaimesi tiedostoon:

```
OPENAI_API_KEY=your_actual_openai_api_key_here
```

## OpenAI API-avaimen hankkiminen

1. Mene osoitteeseen: https://platform.openai.com/api-keys
2. Kirjaudu sisään tai luo tili
3. Klikkaa "Create new secret key"
4. Kopioi avain ja liitä se `.env.local` tiedostoon

## Testaus

Kun olet lisännyt API-avaimen:

1. Käynnistä sovellus: `npm run dev`
2. Mene chat-sivulle: http://localhost:3000/chat
3. Kokeile lähettää viesti

Jos saat virheilmoituksen "OpenAI API-avain puuttuu", tarkista että:
- `.env.local` tiedosto on oikeassa paikassa
- Avain on kirjoitettu oikein
- Sovellus on käynnistetty uudelleen avaimen lisäämisen jälkeen
