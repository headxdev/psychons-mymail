@echo off
title MyMail Server Starter
setlocal EnableDelayedExpansion

:: Set color codes for better visibility
set "RED=[31m"
set "GREEN=[32m"
set "YELLOW=[33m"
set "CYAN=[36m"
set "RESET=[0m"

:: Function to show detailed error message and pause
:ShowError
echo %RED%==================================
echo ERROR: %~1
echo Details: %~2
echo ==================================%RESET%
echo.
echo %CYAN%Possible solution: %~3%RESET%
echo.
timeout /t 1 >nul
echo Press any key to exit...
pause >nul
exit /b 1

:: Show startup banner
echo %GREEN%==================================
echo Initializing MyMail Server...
echo ==================================%RESET%
echo.

:: Check Node.js installation
echo %CYAN%Checking Node.js installation...%RESET%
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    call :ShowError "Node.js is missing" ^
                   "Could not execute 'node --version'" ^
                   "Download and install Node.js from https://nodejs.org"
)

:: Check npm installation
echo %CYAN%Checking npm installation...%RESET%
npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    call :ShowError "npm is missing" ^
                   "Could not execute 'npm --version'" ^
                   "Reinstall Node.js to fix this issue"
)

:: Get public IP
echo %CYAN%Detecting public IP...%RESET%
powershell -Command "try { $ip = (Invoke-WebRequest -Uri 'http://checkip.amazonaws.com' -UseBasicParsing -TimeoutSec 5).Content.Trim(); Write-Output $ip } catch { $_.Exception.Message }" > ip.txt
set /p PUBLIC_IP=<ip.txt
del ip.txt

if not "%PUBLIC_IP:~0,4%"=="http" (
    echo %YELLOW%==================================
    echo WARNING: Network issue detected!
    echo Details: Could not reach IP detection service
    echo Using localhost as fallback
    echo ==================================%RESET%
    echo.
    set PUBLIC_IP=localhost
    timeout /t 3 > nul
) else (
    echo %GREEN%Public IP detected: %PUBLIC_IP%[0m
)

:: Check if package.json exists
if not exist "package.json" (
    call :ShowError "Missing package.json" ^
                   "Required configuration file not found" ^
                   "Make sure you're in the correct project directory"
)

:: Install dependencies
if not exist "node_modules" (
    echo %CYAN%Installing dependencies...%RESET%
    npm install 2>npm_error.txt
    if !ERRORLEVEL! NEQ 0 (
        set /p NPM_ERROR=<npm_error.txt
        del npm_error.txt
        call :ShowError "npm install failed" ^
                       "!NPM_ERROR!" ^
                       "Check your internet connection or npm registry access"
    )
)

:: Configure server
echo %CYAN%Configuring server...%RESET%
echo const PUBLIC_IP = '%PUBLIC_IP%'; > public_ip.js
type server.js >> public_ip.js 2>server_error.txt
if !ERRORLEVEL! NEQ 0 (
    set /p SERVER_ERROR=<server_error.txt
    del server_error.txt
    call :ShowError "Server configuration failed" ^
                   "!SERVER_ERROR!" ^
                   "Verify that server.js exists and is accessible"
)

move /y public_ip.js server.js >nul 2>move_error.txt
if !ERRORLEVEL! NEQ 0 (
    set /p MOVE_ERROR=<move_error.txt
    del move_error.txt
    call :ShowError "File operation failed" ^
                   "!MOVE_ERROR!" ^
                   "Check if server.js is locked by another process"
)

:: Start server
echo %GREEN%==================================
echo Starting server...
echo ==================================%RESET%
echo.
echo %YELLOW%The server will automatically find an available port
echo Press Ctrl+C to stop the server%RESET%
echo.

npm start 2>start_error.txt
if !ERRORLEVEL! NEQ 0 (
    set /p START_ERROR=<start_error.txt
    del start_error.txt
    call :ShowError "Server startup failed" ^
                   "!START_ERROR!" ^
                   "Check the error details above or verify port availability"
)

endlocal
pause