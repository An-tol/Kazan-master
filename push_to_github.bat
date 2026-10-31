@echo off
chcp 65001 >nul
title Отправка проекта на GitHub
echo ========================================================
echo Отправка приложения Казан-Мастер в репозиторий:
echo https://github.com/An-tol/Kazan-master
echo ========================================================
echo.
echo Если сейчас откроется окно браузера - просто нажмите "Sign in with your browser" (Авторизоваться).
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo УСПЕХ! Проект успешно отправлен на GitHub!
    echo.
    echo Сейчас откроется страница Actions:
    echo https://github.com/An-tol/Kazan-master/actions
    echo Там уже началась автоматическая сборка вашего APK-файла!
    echo ========================================================
    start https://github.com/An-tol/Kazan-master/actions
) else (
    echo.
    echo Произошла ошибка при отправке.
)
pause
