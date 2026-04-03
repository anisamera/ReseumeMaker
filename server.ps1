$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server started. Listening on http://localhost:$port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $response = $context.Response
        
        $requestPath = $context.Request.Url.LocalPath
        if ($requestPath -eq "/") { $requestPath = "/index.html" }
        
        $filePath = Join-Path (Get-Location).Path $requestPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            
            if ($filePath.EndsWith(".html")) { $response.ContentType = "text/html; charset=utf-8" }
            elseif ($filePath.EndsWith(".css")) { $response.ContentType = "text/css" }
            elseif ($filePath.EndsWith(".png")) { $response.ContentType = "image/png" }
            elseif ($filePath.EndsWith(".js")) { $response.ContentType = "application/javascript" }
            
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            Write-Host "404 Not Found: $requestPath"
        }
        $response.Close()
    }
} catch {
    Write-Host "Server stopped."
} finally {
    $listener.Stop()
}
