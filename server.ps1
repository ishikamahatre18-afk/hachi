$root = $PSScriptRoot
$l = New-Object Net.HttpListener
$l.Prefixes.Add('http://localhost:8000/')
$l.Start()
Start-Process 'http://localhost:8000/'
Write-Host 'Hachi is running at http://localhost:8000/  (close this window to stop)'
$m = @{'.html'='text/html';'.js'='text/javascript';'.json'='application/json';'.svg'='image/svg+xml';'.png'='image/png';'.txt'='text/plain'}
while ($l.IsListening) {
  $c = $l.GetContext()
  $p = [Uri]::UnescapeDataString($c.Request.Url.LocalPath).TrimStart('/')
  if (-not $p) { $p = 'index.html' }
  $f = Join-Path $root $p
  if ((Test-Path $f -PathType Leaf) -and ($f.StartsWith($root))) {
    $b = [IO.File]::ReadAllBytes($f); $e = [IO.Path]::GetExtension($f)
    if ($m[$e]) { $c.Response.ContentType = $m[$e] } else { $c.Response.ContentType = 'application/octet-stream' }
    $c.Response.OutputStream.Write($b, 0, $b.Length)
  } else { $c.Response.StatusCode = 404 }
  $c.Response.Close()
}
