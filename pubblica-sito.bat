@echo off
REM Doppio click su questo file per pubblicare il sito aggiornato.
REM Fa tutto da solo: build + deploy su Cloudflare (stesso sito di ironwoodlivigno.com).

cd /d "%~dp0"

echo ============================================
echo   1/2 - Genero i file del sito (npm run build)
echo ============================================
call npm run build
if errorlevel 1 (
    echo.
    echo ERRORE durante la build. Controlla il messaggio sopra.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   2/2 - Pubblico su Cloudflare (npm run deploy)
echo ============================================
call npm run deploy
if errorlevel 1 (
    echo.
    echo ERRORE durante la pubblicazione. Controlla il messaggio sopra.
    echo Se l'errore parla di login, esegui prima: npx wrangler login
    pause
    exit /b 1
)

echo.
echo ============================================
echo   FATTO! Il sito e' online su ironwoodlivigno.com
echo ============================================
pause
