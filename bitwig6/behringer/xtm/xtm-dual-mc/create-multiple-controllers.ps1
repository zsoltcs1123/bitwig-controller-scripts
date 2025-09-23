# PowerShell script to create multiple X-Touch Mini controller instances
# Run this from the xtm directory

param(
    [int]$NumControllers = 3
)

Write-Host "Creating $NumControllers X-Touch Mini controller scripts..."

$baseDir = "xtm-dual"
$baseName = "xtm-dual"

for ($i = 2; $i -le $NumControllers; $i++) {
    $newDir = "$baseName-$i"
    $newName = "X-Touch Mini Dual 6 - Controller $i"
    $newUUID = "a1b2c3d4-e5f6-$($i.ToString('D4'))-5678-90abcdef1234"
    
    Write-Host "Creating controller $i in $newDir..."
    
    # Copy directory
    Copy-Item -Path $baseDir -Destination $newDir -Recurse -Force
    
    # Update package.json
    $packageJson = Get-Content "$newDir/package.json" -Raw
    $packageJson = $packageJson -replace 'Controller 1', "Controller $i"
    $packageJson | Set-Content "$newDir/package.json"
    
    # Update control script
    $controlScript = Get-Content "$newDir/$baseName.control.js" -Raw
    $controlScript = $controlScript -replace 'Controller 1', "Controller $i"
    $controlScript = $controlScript -replace 'a1b2c3d4-e5f6-1234-5678-90abcdef1234', $newUUID
    
    # Update MIDI channels (each controller gets its own channel set)
    $inputChannel = $i - 1  # 0-based: Controller 1=0, Controller 2=1, etc.
    $faderChannel = 8 + ($i - 1)  # Controller 1=8, Controller 2=9, etc.
    $outputChannel = $inputChannel
    
    $controlScript = $controlScript -replace 'const INPUT_MIDI_CHANNEL = 0;', "const INPUT_MIDI_CHANNEL = $inputChannel;"
    $controlScript = $controlScript -replace 'const FADER_MIDI_CHANNEL = 8;', "const FADER_MIDI_CHANNEL = $faderChannel;"
    $controlScript = $controlScript -replace 'const OUTPUT_MIDI_CHANNEL = 0;', "const OUTPUT_MIDI_CHANNEL = $outputChannel;"
    
    $controlScript | Set-Content "$newDir/$baseName.control.js"
    
    Write-Host "  - MIDI Channels: Input=$inputChannel, Fader=$faderChannel, Output=$outputChannel"
}

Write-Host ""
Write-Host "Created $($NumControllers-1) additional controller scripts!"
Write-Host ""
Write-Host "To use multiple controllers:"
Write-Host "1. Each X-Touch Mini must be on a DIFFERENT USB port or use different names"
Write-Host "2. In Bitwig, add each controller separately:"
Write-Host "   - Controller 1: Uses MIDI channels 1 & 9"
Write-Host "   - Controller 2: Uses MIDI channels 2 & 10"
Write-Host "   - Controller 3: Uses MIDI channels 3 & 11"
Write-Host ""
Write-Host "NOTE: You'll need MIDI routing software to route each physical"
Write-Host "controller to its assigned MIDI channel, OR each controller"
Write-Host "needs to be different hardware models/configurations."
