# Perustamisapuri - Demo

Digitaalinen avustaja yrittäjyydelle Tampereella. Tämä on demo-versio, joka esittelee Perustamisapurin keskeiset toiminnallisuudet.

## Ominaisuudet

### ✅ Toteutettu (Demo-versio)
- **Sisäänkirjautuminen**: Mock Suomi.fi -kirjautuminen
- **Käyttäjäprofiili**: Perustietojen syöttö ja hallinta
- **Chat-käyttöliittymä**: Keskustelu Perustamisapurin kanssa
- **Yrittäjäprofiili**: Tietojen tarkastelu ja hallinta
- **Teemavalinta**: Tumma/vaalea tila (aina näkyvissä)
- **Responsiivinen design**: Toimii mobiilissa ja työpöydällä
- **Suomenkielinen käyttöliittymä**: Kaikki tekstit suomeksi

### 🔄 Demo-toiminnallisuudet
- Simuloitu OpenAI-integraatio (ei oikeaa API-yhteyttä)
- Paikallinen tietojen tallennus (localStorage)
- Mock-vastaukset keskusteluissa
- PDF-latauksen placeholder

## Teknologiat

- **Framework**: Next.js 14+ (App Router)
- **UI-kirjasto**: shadcn/ui
- **Tyylittely**: Tailwind CSS
- **Teemavalinta**: next-themes
- **Kieli**: TypeScript
- **Ikonit**: Lucide React

## Asennus ja käynnistys

1. **Kloonaa repositorio**:
   ```bash
   git clone <repository-url>
   cd perustamisapuri-app
   ```

2. **Asenna riippuvuudet**:
   ```bash
   npm install
   ```

3. **Käynnistä kehityspalvelin**:
   ```bash
   npm run dev
   ```

4. **Avaa selaimessa**:
   ```
   http://localhost:3000
   ```

## Käyttöohjeet

### 1. Sisäänkirjautuminen
- Avaa sovellus selaimessa
- Klikkaa "Kirjaudu sisään Suomi.fi" (ei vaadi oikeita tunnuksia)

### 2. Profiilin luominen
- Täytä perustiedot lomakkeeseen
- Anna liikeidea ja tausta
- Klikkaa "Jatka keskusteluun"

### 3. Keskustelu
- Kysy mitä tahansa yrittäjyydestä
- Saat simuloituja vastauksia
- Keskustelut tallentuvat automaattisesti

### 4. Profiilin tarkastelu
- Siirry "Yrittäjäprofiili"-sivulle
- Tarkastele tietojasi eri välilehdissä
- Lataa profiili PDF:nä (placeholder)

## Sivurakenne

```
/                   # Sisäänkirjautuminen
/onboarding        # Profiilin luominen
/chat              # Keskusteluliittymä
/profile           # Yrittäjäprofiili
/api/chat          # Chat API endpoint
```

## Komponentit

### UI-komponentit (shadcn/ui)
- `Button` - Painikkeet
- `Card` - Kortit
- `Input` - Syöttökentät
- `Textarea` - Tekstialueet
- `Select` - Valintaluettelot
- `Dialog` - Modaalit
- `Avatar` - Profiilikuvat
- `Badge` - Merkit
- `Tabs` - Välilehdet
- `Separator` - Erottimet

### Mukautetut komponentit
- `ThemeProvider` - Teemanhallinta
- `ThemeToggle` - Teemavalitsin

## Konfiguraatio

### Tailwind CSS
- Mukautetut värit ja teemat
- Responsiiviset breakpointit
- shadcn/ui -integraatio

### TypeScript
- Tiukat tyyppitarkistukset
- Kaikki komponentit tyypitetty
- API-rajapintojen tyypit

## Demo-rajoitukset

Tämä on demo-versio, jossa:
- Ei oikeaa OpenAI API -yhteyttä
- Tiedot tallennetaan paikallisesti
- Ei oikeaa Suomi.fi -integraatiota
- PDF-lataus on placeholder
- Simuloidut vastaukset keskusteluissa

## Tulevat ominaisuudet (ei demossa)

- Oikea OpenAI API -integraatio
- Tietokantatallennus
- Suomi.fi-autentikointi
- PDF-generointi
- Dokumenttien lataus
- RAG-toiminnallisuus
- Azure-deployment

## Kehitys

### Uusien komponenttien lisääminen
```bash
npx shadcn@latest add [component-name]
```

### Linting ja formatointi
```bash
npm run lint
```

### Tuotantokäännös
```bash
npm run build
npm start
```

## Projektin luonne

**Henkilökohtainen harrastusprojekti**: Tämä on henkilökohtainen harrastusprojekti, joka on kehitetty oppimis- ja kokeilutarkoituksessa. Projekti esittelee digitaalisen avustajan konseptia yrittäjyydelle Tampereella.

## Tuki ja yhteystiedot

Tämä on demo-projekti Tampereen kaupungin yrittäjäpalveluille.

---

**Huom**: Tämä on demo-versio eikä sisällä oikeita integraatioita tai tuotantotason tietoturvaa.