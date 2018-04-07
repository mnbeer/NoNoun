# Zip all the files needed to upload to the Chrome Developer Dashboard
# Run from root folder

# target path (where the files to be zipped are located)
$path = "."

# destination path (where the zip file is saved)
$destination = "Dist\dist.zip"
# Delete file if it exists; we will rebuild
If (Test-Path $destination){
	Remove-Item $destination
}
# Exclude these files and folders from the distrubution package
$exclude = @(".gitignore","Dist","Exclude", "Test", "Prepare", "Help")
# get files to zip
$files = Get-ChildItem -Path $path -Exclude $exclude
# compress
Compress-Archive -Path $files -DestinationPath $destination -Force
