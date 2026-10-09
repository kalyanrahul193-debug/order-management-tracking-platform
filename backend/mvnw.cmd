@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.
@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script for Windows
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0__%"=="" SET __MVNW_ARG0__=%~0
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_PSMODULEP_SAVE=%PSModulePath%
@SET PSModulePath=

@FOR /F "usebackq tokens=1* delims==" %%A IN (`powershell -noprofile "& {$scriptDir = '%~dp0'; $wrapperJar = Join-Path $scriptDir '.mvn\wrapper\maven-wrapper.jar'; $wrapperProps = Join-Path $scriptDir '.mvn\wrapper\maven-wrapper.properties'; if (-not (Test-Path $wrapperJar)) { $props = Get-Content $wrapperProps | ConvertFrom-StringData; $url = $props.wrapperUrl; Write-Host 'Downloading Maven Wrapper...'; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile($url, $wrapperJar) }; $distributionUrl = (Get-Content $wrapperProps | ConvertFrom-StringData).distributionUrl; $mavenHome = Join-Path $env:USERPROFILE '.m2\wrapper\dists'; $mavenDir = Join-Path $mavenHome ($distributionUrl.Split('/')[-1] -replace '\.zip$',''); if (-not (Test-Path $mavenDir)) { $zipFile = Join-Path $mavenHome 'maven.zip'; New-Item -ItemType Directory -Path $mavenHome -Force | Out-Null; Write-Host 'Downloading Maven distribution...'; (New-Object Net.WebClient).DownloadFile($distributionUrl, $zipFile); Expand-Archive -Path $zipFile -DestinationPath $mavenHome -Force; Remove-Item $zipFile }; $mvnExe = Get-ChildItem -Path $mavenDir -Recurse -Filter 'mvn.cmd' | Select-Object -First 1; if ($mvnExe) { Write-Output \"MVNW_CMD=$($mvnExe.FullName)\" } else { $mvnExe = Get-ChildItem -Path $mavenHome -Recurse -Filter 'mvn.cmd' | Select-Object -First 1; if ($mvnExe) { Write-Output \"MVNW_CMD=$($mvnExe.FullName)\" } else { Write-Output 'MVNW_ERROR=Could not find mvn.cmd' } }}"`) DO @SET "%%A=%%B"

@SET PSModulePath=%__MVNW_PSMODULEP_SAVE%

@IF NOT "%__MVNW_ERROR__%"=="" (
    @ECHO %__MVNW_ERROR__%
    @EXIT /B 1
)

@IF "%__MVNW_CMD__%"=="" (
    @ECHO Could not determine Maven command
    @EXIT /B 1
)

"%__MVNW_CMD__%" %*
