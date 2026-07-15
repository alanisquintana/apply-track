$root = $PSScriptRoot

$backend = Start-Process -NoNewWindow -PassThru -FilePath "node" -ArgumentList "$root\backend\dist\main.js"
Start-Sleep -Milliseconds 500
$frontend = Start-Process -NoNewWindow -PassThru -FilePath "node" -ArgumentList "$root\frontend\node_modules\vite\bin\vite.js", "--port", "3000" -WorkingDirectory "$root\frontend"

Write-Host "Backend: http://localhost:3001 | Frontend: http://localhost:3000"
Write-Host "PIDs: backend=$($backend.Id) frontend=$($frontend.Id)"
