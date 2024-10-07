Template for website with user authentication made with Express server and PostgreSQL database

- Insert database connection string into a file named .env in the project directory like so: DATABASE_URL=""
- add .env into .gitignore
- Update prisma/schema.prisma and run npx prisma db push to set up the database
- Run "node --watch app.js" to test
- Deploy to PaaS, such as railway, when ready