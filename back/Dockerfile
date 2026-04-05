FROM node:20 
#pega a lib node
WORKDIR /app
#cria a pasta app e seta ela como pasta de trabalho
COPY package*.json ./
#copia o package.json e o package-lock.json para a pasta de trabalho
RUN npm install
#instala as dependencias do projeto
COPY . .
# copia o resto dos arquivos e nao precisa ficar dando npm install toda vez; otimiza o processo
EXPOSE 3001
#porta 3000 original, aqui é pra n dar conflito com alguma coisa; isso n ocorre no front pq vite é porta 5173 especifico
CMD ["npm", "start"]
#comando de startar o server quando iniciar o container

#docker build -t docker_estagio .
#docker images

#docker run -it -p 3001:3001 docker_estagio (falta rodar)