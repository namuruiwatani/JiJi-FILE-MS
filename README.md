# JiJi-FILE-MS

# Project Setup Instructions

To set up and run the project, follow these steps:

## 1. Configure the Backend
1. Navigate to the backend directory:
   ```bash
   cd jiji-backend
   ```
2. Set up the `.env` file with your database details:
   ```plaintext
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE= # YOUR database name
   DB_USERNAME=  # YOUR username
   DB_PASSWORD=  # YOUR password
   ```
3. Run the database migrations:
   ```bash
   php artisan migrate
   ```
4. Start the backend server:
   ```bash
   php artisan serve
   ```

## 2. Start the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd jiji-frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

Your project should now be running! 🚀
