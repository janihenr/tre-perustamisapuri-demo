# Perustamisapuri - Digitaalinen avustaja yrittäjyydelle Tampereella

Perustamisapuri on digitaalinen avustaja, joka tukee yrittäjyyttä Tampereella. Tämä repositorio sisältää demo-version, joka esittelee järjestelmän keskeiset toiminnallisuudet.

## Projektin rakenne

```
perustamisapuri/
├── perustamisapuri-app/    # Next.js demo-sovellus
├── PRD/                    # Product Requirements Document
└── README.md              # Tämä tiedosto
```

## Ominaisuudet

### Demo-version toiminnallisuudet
- **Mock Suomi.fi -kirjautuminen**: Simuloitu sisäänkirjautuminen
- **Käyttäjäprofiili**: Perustietojen syöttö ja hallinta
- **Chat-käyttöliittymä**: Keskustelu Perustamisapurin kanssa
- **Yrittäjäprofiili**: Tietojen tarkastelu ja hallinta
- **PDF-export**: Profiilin lataaminen (placeholder)
- **Responsiivinen design**: Toimii mobiilissa ja työpöydällä
- **Suomenkielinen käyttöliittymä**: Kaikki tekstit suomeksi

### Teknologiat
- **Frontend**: Next.js 14+ (App Router)
- **UI-kirjasto**: shadcn/ui
- **Tyylittely**: Tailwind CSS
- **Kieli**: TypeScript
- **AI-integraatio**: OpenAI API (demo-tilassa simuloitu)

## Pika-aloitus

1. **Siirry sovellushakemistoon**:
   ```bash
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

## Dokumentaatio

- **[Sovelluksen README](./perustamisapuri-app/README.md)**: Yksityiskohtaiset ohjeet sovelluksen käyttöön
- **[Product Requirements Document](./PRD/perustamisapuri_demo_prd.md)**: Projektin vaatimukset ja tavoitteet
- **[Deployment-ohjeet](./perustamisapuri-app/DEPLOYMENT.md)**: Tuotantoon viennin ohjeet

## Käyttötapaukset

### Yrittäjälle
- Kysymykset yrityksen perustamisesta
- Lupien ja säädösten selvittäminen
- Liiketoimintasuunnitelman kehittäminen
- Rahoitusvaihtoehtojen kartoitus

### Demo-esittelylle
- Käyttöliittymän ja käyttäjäkokemuksen esittely
- Chat-toiminnallisuuden demonstrointi
- Profiilinhallinnan näyttäminen
- Responsiivisen designin esittely

## Demo-rajoitukset

Tämä on demo-versio, jossa:
- Ei oikeaa OpenAI API -yhteyttä (simuloidut vastaukset)
- Tiedot tallennetaan paikallisesti (localStorage)
- Ei oikeaa Suomi.fi -integraatiota
- PDF-lataus on placeholder-toiminto
- Rajoitettu tietokanta mock-datalla

## Tulevat ominaisuudet

### Tuotantoversio (ei demossa)
- Oikea OpenAI API -integraatio
- Tietokantatallennus (Azure SQL/CosmosDB)
- Suomi.fi-autentikointi
- Oikea PDF-generointi
- Dokumenttien lataus ja käsittely
- RAG-toiminnallisuus validoidulla tietokannalla
- Azure-deployment

### Laajennukset
- Taloudellisten laskelmien työkalut
- Dokumenttien automaattinen käsittely
- Integraatiot Tampereen kaupungin palveluihin
- Monimuotoinen sisällön tuki

## Projektin luonne

**Henkilökohtainen harrastusprojekti**: Tämä on henkilökohtainen harrastusprojekti, joka on kehitetty oppimis- ja kokeilutarkoituksessa. Projekti esittelee digitaalisen avustajan konseptia yrittäjyydelle Tampereella.

## Kehitys

### Kehitysympäristön pystytys
```bash
# Kloonaa repositorio
git clone <repository-url>
cd perustamisapuri

# Siirry sovellushakemistoon ja asenna riippuvuudet
cd perustamisapuri-app
npm install

# Käynnistä kehityspalvelin
npm run dev
```

### Koodin laatu
```bash
# Linting
npm run lint

# Tuotantokäännös
npm run build
```

## Tuki ja yhteystiedot

Tämä on demo-projekti Tampereen kaupungin yrittäjäpalveluille. Projekti on kehitetty esittelytarkoituksessa ja oppimisprojektina.

---

**Huomio**: Tämä on demo-versio eikä sisällä oikeita integraatioita tai tuotantotason tietoturvaa. Kaikki data on simuloitua ja tarkoitettu vain esittelykäyttöön.