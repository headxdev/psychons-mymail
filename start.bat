@echo off
echo Starting MyMail setup...

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

:: Install dependencies
echo Installing dependencies...
call npm install

:: Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file from example...
    copy .env.example .env
)

:: Start the server
echo Starting the server...
npm run dev
