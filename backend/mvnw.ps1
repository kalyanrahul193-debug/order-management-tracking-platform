# Maven Wrapper for PowerShell
[CmdletBinding()]
param(
    [Parameter(Position = 0, ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
)

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Look for maven in user profile wrapper cache
$mavenDists = "$env:USERPROFILE\.m2\wrapper\dists"
$mvnCmd = Get-ChildItem -Path $mavenDists -Recurse -Filter "mvn.cmd" -ErrorAction SilentlyContinue | Select-Object -First 1

if (-not $mvnCmd) {
    $wrapperProps = Join-Path $scriptDir ".mvn\wrapper\maven-wrapper.properties"
    $distUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip"
    if (Test-Path $wrapperProps) {
        $props = Get-Content $wrapperProps | ConvertFrom-StringData
        if ($props.distributionUrl) { $distUrl = $props.distributionUrl }
    }
    
    $zipFile = Join-Path $env:TEMP "mvn-wrapper-temp.zip"
    Write-Host "Downloading Maven distribution..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    (New-Object Net.WebClient).DownloadFile($distUrl, $zipFile)
    
    New-Item -ItemType Directory -Path $mavenDists -Force | Out-Null
    Expand-Archive -Path $zipFile -DestinationPath $mavenDists -Force
    Remove-Item $zipFile
    $mvnCmd = Get-ChildItem -Path $mavenDists -Recurse -Filter "mvn.cmd" | Select-Object -First 1
}

if (-not $mvnCmd) {
    Write-Error "Could not find or install Maven."
    exit 1
}

# Run maven
& $mvnCmd.FullName @Arguments
exit $LASTEXITCODE
