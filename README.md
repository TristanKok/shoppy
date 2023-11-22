# Shoppy

Welcome to Shoppy! This application allows you to manage your shopping lists and items.

## Requirements

- Node.js v18
- Prisma

## Setup

1. **Node.js:** Make sure you have Node.js installed.

2. **Install dependencies:** 

    ```bash
    npm install
    ```

3. **Environment Variables**

    Create a `.env` file with the following (this is only for local development):
   
    ```
    DATABASE_URL="file:./dev.db"
    ```

4. **Database Setup:** Here we are using SQLite with Prisma. Prisma is a server-side library that helps developers read and write data to a database in an intuitive, efficient, and safe way.
   
   - Configure your database connection in the `prisma/.env` file.
   - Run the following commands to create and migrate the database:

    ```bash
    npm run db
    ```

## Running the App

1. Start the application:

    ```bash
    npm run start
    ```

2. Follow the on-screen instructions to navigate through the app.

## Usage

- **View Shopping Lists:** Choose option 1 to view existing shopping lists. Once you select a shopping list you will be shown the options available to each.
- **Add New Shopping List:** Choose option 2 to add a new shopping list.
- **Exit:** Choose option 3 to exit the application.
