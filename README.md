# Aplicación de chat con WebSockets

Con este programa se levantan dos servidores, uno de ellos ofrecerá los métodos necesarios para interactuar con el chat, y el otro proporcionará la interfaz de usuario para interactuar con facilidad con el primer servidor.

# Prerrequisitos

Para correr este programa solo es necesario tener instalado Docker Compose. Con esta herramienta podremos dockers (semejantes a máquinas virtuales) sin necesidad de descargar ningún software adicional. Para la instalación se necesitan llevar a cabo los siguientes pasos, sigiuendo la guía oficial:

1. Update the apt package index and install packages to allow apt to use a repository over HTTPS:

```
$ sudo apt-get update

$ sudo apt-get install ca-certificates curl gnupg
```

2. Add Docker’s official GPG key:

```
$ sudo install -m 0755 -d /etc/apt/keyrings

$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

$ sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

3. Use the following command to set up the repository:

```
$ echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

```

4. Install the latest version:

```
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-compose
```

# Run it

Antes de nada, es necesario especificar la IP privada del ordenador en el que se va a ejecutar el código en la variable "yourIP", en la línea 6 del archivo front/src/utils/apolloclient.ts.

Para correr el programa simplemente se deberá correr el siguiente comando:

```
$ docker-compose up --build
```

La primera vez que se ejecute, se descargarán las imágenes especificadas en el archivo docker-compose.yml.

# Acceso a los servidores

Lo ideal es que el usuario acceda úincamente al servidor de Next.js, que ofrece la interfaz de usuario y facilita las conexiones necesarias con el otro servidor. Dicho servidor estará corriendo en el puerto 3000 del ordenador en el que se está ejecutando.

En caso de querer acceder directamente al servidor de Node.js, encargado de gestionar el chat directamente, se puede acceder a este mediante el puerto 4000, añadiendo "/graphql" al final de la petición.

# Aviso

Es posible que su navegador bloquee las conexiones de WebSocket con el servidor, pues no son seguras. Para permitir la conexión, se tendrá que acceder a la configuración del navegador y habilitar las conexiones con sitios inseguros.
