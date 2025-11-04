@echo off
echo Starting React Native Android App...

REM Add Node.js to PATH
set PATH=%PATH%;C:\Program Files\nodejs

REM Start Metro bundler in background
start "Metro Bundler" cmd /k "npm start"

REM Wait a moment for Metro to start
timeout /t 5 /nobreak > nul

REM Run Android app
npx react-native run-android

pause

