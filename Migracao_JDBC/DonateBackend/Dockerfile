# Etapa 1: build do projeto
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app

# Copia os arquivos do projeto
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

# Empacota o projeto em um .jar
RUN mvn clean package -DskipTests

# Etapa 2: imagem final para rodar
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copia o .jar da etapa anterior
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta padrão do Spring Boot
EXPOSE 8080

# Comando de inicialização
ENTRYPOINT ["java", "-jar", "app.jar"]
