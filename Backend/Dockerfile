FROM node:20-bullseye

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    libreoffice \
    poppler-utils \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

# Install Python tools
RUN pip3 install --no-cache-dir \
    pdf2docx==0.5.8 \
    PyMuPDF==1.23.7

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy rest of the backend
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose API port
EXPOSE 3000

# Start server from built files
CMD ["npm", "start"]
