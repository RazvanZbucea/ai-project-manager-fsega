# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiem doar fisierele necesare pentru rezolvarea dependentelor (optimizeaza layer caching-ul Docker)
COPY pom.xml .
COPY src ./src

# Executam build-ul fortand setarile de proxy specifice retelei tale corporate
RUN mvn clean package -DskipTests

# Stage 2: Runtime Minimal
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiem doar executabilul final, lasand in urma tot overhead-ul de Maven (securitate + imagine mica)
COPY --from=build /app/target/ai-project-manager-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8089
ENTRYPOINT ["java", "-jar", "app.jar"]