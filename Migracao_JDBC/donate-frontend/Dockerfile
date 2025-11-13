# Etapa 1: Build da aplicação Angular
FROM node:20 AS build
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Faz o build de produção
RUN npm run build -- --configuration production

# Etapa 2: Servidor NGINX para servir o app
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove o conteúdo padrão do nginx
RUN rm -rf ./*

# Copia os arquivos do build Angular
COPY --from=build /app/dist/donate-frontend/browser ./

# Copia configuração customizada do NGINX (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta padrão do NGINX
EXPOSE 80

# Inicia o servidor
CMD ["nginx", "-g", "daemon off;"]
