$files = @(
    "manifest.json",
    "common.js",
    "content.js",
    "nonoun.js",
    "words.js",
    "nonoun.html",
    "nonoun.css",
    "icon16.png",
    "icon48.png",
    "icon128.png"
)

$version = (Get-Content manifest.json | ConvertFrom-Json).version
$output  = "nonoun-$version.zip"

if (Test-Path $output) { Remove-Item $output }

Compress-Archive -Path $files -DestinationPath $output
Write-Host "Created $output"
