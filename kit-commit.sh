#!/bin/bash
echo "🚀 Iniciando Kit-Commit..."
git pull
git add .
echo "Digite a mensagem do commit:"
read msg
git commit -m "$msg"
git push origin main
echo "✅ Enviado para o GitHub (Netlify fará o deploy automático)."
