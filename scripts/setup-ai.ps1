# AI Backend Setup Script for Windows PowerShell
# Run this script to quickly set up the AI backend service

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Vue3 Admin AI Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running in correct directory
if (!(Test-Path "server\package.json")) {
    Write-Host "Error: Please run this script from the project root directory." -ForegroundColor Red
    Write-Host "Current path: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

# Step 1: Install backend dependencies
Write-Host "[1/5] Installing backend dependencies..." -ForegroundColor Green
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies!" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Check if .env exists
Write-Host "[2/5] Checking configuration..." -ForegroundColor Green
if (!(Test-Path "server\.env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "server\.env.example" "server\.env"
} else {
    Write-Host ".env file already exists." -ForegroundColor Green
}
Write-Host ""

# Step 3: Prompt for API Key
Write-Host "[3/5] Configure API Key" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "You need an Alibaba Cloud DashScope API Key." -ForegroundColor White
Write-Host "Get it from: https://dashscope.console.aliyun.com/apiKey" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

$apiKey = Read-Host "Enter your DashScope API Key (or press Enter to skip)"

if ($apiKey) {
    # Update .env file with API Key
    $envContent = Get-Content "server\.env" -Raw
    $envContent = $envContent -replace 'sk-your-actual-api-key-here', $apiKey
    Set-Content "server\.env" $envContent -NoNewline
    Write-Host "API Key configured!" -ForegroundColor Green
} else {
    Write-Host "Skipped. You can configure it later in server\.env" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Verify configuration
Write-Host "[4/5] Verifying configuration..." -ForegroundColor Green
$envFile = Get-Content "server\.env" -Raw
if ($envFile -match 'DASHSCOPE_API_KEY=sk-') {
    Write-Host "API Key is configured." -ForegroundColor Green
} else {
    Write-Host "Warning: API Key not found in .env file!" -ForegroundColor Yellow
    Write-Host "Please edit server\.env and add your API Key." -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Start backend server
Write-Host "[5/5] Starting backend server..." -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "The backend will run on http://localhost:3000" -ForegroundColor White
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Set-Location server
node index.js
