@echo off
REM TaskFlow Desktop Build Script for Windows

echo.
echo ======================================
echo   TaskFlow Desktop Build Script
echo ======================================
echo.

REM Step 1: Build Frontend
echo [1/3] Building frontend...
cd ..\frontend
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%
echo ✓ Frontend built successfully
echo.

REM Step 2: Build Backend
echo [2/3] Building backend...
cd ..\backend
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%
echo ✓ Backend built successfully
echo.

REM Step 3: Build Desktop App
echo [3/3] Building desktop application...
cd ..\desktop
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%
call npm run build:win
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ======================================
echo   Build Complete!
echo ======================================
echo.
echo Installers are in: desktop\dist\
echo.
dir dist /b
echo.
pause
