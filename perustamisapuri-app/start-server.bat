@echo off
cd /d "%~dp0"
echo ====================================================
echo           PERUSTAMISAPURI - KEHITYSPALVELIN
echo ====================================================
echo.

if not exist ".env.local" (
    echo ⚠️  HUOM: OpenAI API-avain puuttuu!
    echo.
    echo Suorita ensin: setup-openai.bat
    echo Tai luo .env.local tiedosto manuaalisesti.
    echo.
    echo ====================================================
    echo.
)

echo Kaynnistetaan Next.js palvelin...
echo Palvelimen osoite: http://localhost:3001
echo.
echo HUOM: ALA SULJE tata ikkunaa! 
echo       Palvelin sammuu jos suljet ikkunan.
echo.
echo Odota kunnes nakyy "Ready in X seconds"...
echo.
echo ====================================================
echo.
npx next dev -p 3001
echo.
echo ====================================================
echo Palvelin on sammunut.
echo.
echo Haluatko tyhjentaa istunnon tiedot (keskusteluhistoria)?
echo [K] = Kyllä, tyhjennä tiedot
echo [E] = Ei, säilytä tiedot  
echo [Q] = Poistu ilman toimintoja
echo.
choice /c KEQ /n /m "Valitse (K/E/Q): "

if errorlevel 3 goto :end
if errorlevel 2 goto :keep_data
if errorlevel 1 goto :clear_data

:clear_data
echo.
echo Tyhjennetään istunnon tiedot...
echo Avataan tyhjennyssivu selaimessa...
echo.
start "" "http://localhost:3001/clear-session.html?auto=true"
timeout /t 3 /nobreak >nul
echo.
echo Istunnon tiedot on tyhjennetty!
echo Voit nyt sulkea selaimen ja aloittaa puhtaalta pöydältä.
echo.
goto :end

:keep_data
echo.
echo Istunnon tiedot säilytetään.
echo Keskusteluhistoria on saatavilla kun palaat sovellukseen.
echo.
goto :end

:end
echo ====================================================
echo Paina mitä tahansa näppäintä sulkeaksesi ikkunan...
pause
cls
