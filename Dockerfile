FROM --platform=$BUILDPLATFORM node:24-alpine AS frontend
WORKDIR /build/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build -- --base-href=/aria-demo/

FROM --platform=$BUILDPLATFORM maven:3.9-eclipse-temurin-25 AS backend
WORKDIR /build
COPY backend/pom.xml ./pom.xml
COPY backend/src ./src
COPY --from=frontend /build/frontend/dist/angular-aria-cdk-demo/browser/ ./src/main/resources/static/
RUN mvn -B package -DskipTests

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=backend /build/target/angular-aria-cdk-demo-api-0.0.1-SNAPSHOT.jar ./app.jar
ENV SERVER_SERVLET_CONTEXT_PATH=/aria-demo
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=60"
USER 10001:10001
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
