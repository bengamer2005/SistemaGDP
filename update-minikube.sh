#!/bin/bash
# Este script construye el frontend para Minikube con la VITE_API_URL correcta
# y actualiza el deployment en Kubernetes
# ./update-minikube.sh

# Apuntar Docker a Minikube
echo "Configurando Docker para Minikube..."
eval $(minikube docker-env)

# Construir la imagen frontend con la variable de entorno
echo "Construyendo frontend-app:5.2 con VITE_API_URL=/api..."
docker build \
  --no-cache \
  --build-arg VITE_API_URL=/api \
  -t frontend-app:5.2 ./frontend

# Actualizar el deployment en Kubernetes
echo "Actualizando deployment sistemagdp-frontend..."
kubectl set image deployment/sistemagdp-frontend \
  sistemagdp-frontend=frontend-app:5.2
kubectl rollout status deployment/sistemagdp-frontend

# Abrir el servicio en Minikube
echo "Abriendo frontend en navegador..."
minikube service sistemagdp-frontend-serviceg