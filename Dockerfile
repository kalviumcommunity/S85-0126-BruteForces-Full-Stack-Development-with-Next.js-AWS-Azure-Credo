FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client with a dummy URL (just for type definitions)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Expose the Next.js port
EXPOSE 3000

# Use 'npm run dev' instead of 'npm start'
CMD ["npm", "run", "dev"]