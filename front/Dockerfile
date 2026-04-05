FROM node:20
# pega imagem com node
WORKDIR /app
# cria o diretório que vai usar arquivo
COPY package*.json ./
# copia os arquivos de dependências
RUN npm install
# instala as bibliotecas do React/Vite
COPY . .
# copia o resto dos arquivos
EXPOSE 5173
# expõe a porta 5173 do vite
CMD ["npm", "run", "dev", "--", "--host"]
# comando para iniciar o servidor e aceitar outras conexões.

#docker build -t front_estagio ./front

#docker run -it -p 5173:5173 front_estagio