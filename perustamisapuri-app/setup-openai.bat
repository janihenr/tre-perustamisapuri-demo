@echo off
cd /d "%~dp0"
echo ====================================================
echo         PERUSTAMISAPURI - OpenAI ASETUKSET
echo ====================================================
echo.
echo Tama skripti auttaa sinua lisaamaan OpenAI API-avaimen.
echo.
echo 1. Hanki API-avain osoitteesta: https://platform.openai.com/api-keys
echo 2. Luo uusi "secret key" (alkaa sk-...)
echo 3. Kopioi avain ja liita se alla olevaan kenttaan
echo.
echo ====================================================
echo.

if exist ".env.local" (
    echo HUOM: .env.local tiedosto on jo olemassa.
    echo Haluatko korvata sen? [K/E]
    choice /c KE /n /m "Valitse (K=Kylla, E=Ei): "
    if errorlevel 2 goto :cancel
)

echo.
set /p "apikey=Liita OpenAI API-avain tahan (sk-...): "

if "%apikey%"=="" (
    echo Virhe: API-avain ei voi olla tyhja!
    goto :error
)

if not "%apikey:~0,3%"=="sk-" (
    echo Varoitus: API-avain ei alka "sk-" - oletko varma etta se on oikea?
    choice /c KE /n /m "Jatka silti? (K=Kylla, E=Ei): "
    if errorlevel 2 goto :cancel
)

echo.
echo Luodaan .env.local tiedosto...
(
    echo # OpenAI API Configuration
    echo OPENAI_API_KEY=%apikey%
    echo.
    echo # Next.js Configuration  
    echo NEXT_PUBLIC_APP_NAME=Perustamisapuri
) > .env.local

echo.
echo ====================================================
echo ✅ VALMIS! API-avain lisatty onnistuneesti.
echo ====================================================
echo.
echo Seuraavat askeleet:
echo 1. Sulje kehityspalvelin (Ctrl+C)
echo 2. Kaynnista palvelin uudelleen: npm run dev
echo 3. Mene osoitteeseen: http://localhost:3000/chat
echo.
echo Nyt voit keskustella Perustamisapurin kanssa!
echo ====================================================
goto :end

:cancel
echo.
echo Toiminto peruttu.
goto :end

:error
echo.
echo Yrita uudelleen.
goto :end

:end
echo.
pause
