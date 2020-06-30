# Trabajo final de Graduación
## Prototipo tecnológico (proyecto actualmente en desarrollo)

### Demo ###
http://firewatch-bucket.s3-website-us-east-1.amazonaws.com

**Nota:** Para acceder al panel web se deben usar las credenciales:
- email: demo@demo.com
- password: 123456


### Componentes del prototipo
El sistema se compone de tres elementos principales:

1. Aplicación web desde donde se pueden visualizar los eventos de alertas de incendios. La misma está desarrollada con React y puede ser encontrada en el subdirectorio `app`.
2. API REST y gRPC, desarrollada con el lenguaje Go. Se puede encontrar bajo el directorio `api`.
3. Red neuronal desarrollada con Tensorflow (Python). Se puede encontrar bajo el directorio `neuralnet`.
4. Aplicación que corre nuestra cámara inteligente, donde se carga el modelo de red neuronal y se ejecutan predicciones para nuevas imágenes obtenidas por cámara. Se puede encontrar bajo el directorio `smart-cam`.

