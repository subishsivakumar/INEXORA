# Apple Product — Independent Apple Products Shopping Experience

This repository contains the complete full-stack **Apple Product** e-commerce application.

> **Disclaimer:** *Apple Product is an independent demonstration e-commerce store created for educational and architectural demonstration purposes. This website is not affiliated with, sponsored by, or endorsed by Apple Inc.*

## Quick Links
- Project Root: [apple-product/](file:///c:/Users/MOHAMMED%20ASLAM%20M/apple/apple-product)
- Detailed Documentation: [apple-product/README.md](file:///c:/Users/MOHAMMED%20ASLAM%20M/apple/apple-product/README.md)
- Frontend Application: [apple-product/frontend/](file:///c:/Users/MOHAMMED%20ASLAM%20M/apple/apple-product/frontend) (`http://localhost:5173`)
- Spring Boot Backend: [apple-product/backend/](file:///c:/Users/MOHAMMED%20ASLAM%20M/apple/apple-product/backend) (`http://localhost:8080`)
- Swagger UI / API Docs: `http://localhost:8080/swagger-ui.html`
- Database Schema & Seed Data: [apple-product/database/](file:///c:/Users/MOHAMMED%20ASLAM%20M/apple/apple-product/database)

## Local Startup
1. **Database:** Ensure MySQL / MariaDB is running on port 3306 (`apple_product` database).
2. **Backend:**
   ```powershell
   cd apple-product\backend
   .\mvnw.cmd spring-boot:run
   ```
3. **Frontend:**
   ```powershell
   cd apple-product\frontend
   npm install
   npm run dev
   ```
4. **Run Verification Suite:**
   ```powershell
   cd apple-product
   node verify_system.js
   ```
