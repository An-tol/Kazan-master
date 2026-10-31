@echo off
cls
echo ========================================================
echo   Pushing Kazan-Master to GitHub (An-tol/Kazan-master)
echo ========================================================
echo.
echo If your browser opens a GitHub login window, please click "Authorize".
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCESS! Uploaded to GitHub!
    echo   Opening Actions page in browser...
    echo ========================================================
    start https://github.com/An-tol/Kazan-master/actions
) else (
    echo.
    echo Something went wrong with git push.
)
echo.
pause
