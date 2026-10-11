# Build stage using official Maven + Temurin 21 image
FROM maven:3.9-eclipse-temurin-21-jammy AS build
WORKDIR /app

# Copy pom.xml and source code
COPY backend/pom.xml ./pom.xml
COPY backend/src ./src

# Package application jar
RUN mvn clean package -DskipTests

# Run stage with lightweight JRE 21
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/apple-product-backend-1.0.0.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
