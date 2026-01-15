cd backend/
if not exist "node_modules\" (
    call npm install
)
cd tasks/
if not exist "node_modules\" (
    call npm install
)

cd ../
start "SERVEUR-BACKEND" cmd /k "node main.js"
timeout /t 60 /nobreak > nul
cd ../
start "demarrage frontend" "frontend/index.html"
 pause > nul

