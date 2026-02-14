

# 🍀CloverConvert🍀

CloverConvert is a webapp for document conversion. It provides APIs to convert and process files such as PDFs, images, and Word documents. The system is designed to be reliable, scalable, and fully containerized using Docker.

All document processing tools run inside Docker containers, so no local system dependencies are required.

---

## Features

- JPG to PDF conversion
- PDF to JPG conversion (ZIP output)
- PDF compression
- Word to PDF conversion
- PDF to Word conversion
- Worker-based architecture for heavy processing
- Fully Dockerized environment

---

## Technology Stack

- Node.js (API and worker orchestration)
- React.Js
- Tanstack ReactQuery
- TypeScript
- Python (document processing tools)
- pdf2docx (PDF to Word conversion)
- LibreOffice (Word to PDF conversion)
- Poppler (PDF to image conversion)
- Ghostscript (PDF compression)
- Docker

---

## Architecture Overview

- The API server handles file uploads and job requests.
- Heavy file processing runs in isolated worker threads.
- Python-based tools are executed from Node workers.
- All dependencies are installed inside Docker containers.
- No system-level installations are required on the host machine.

---

## Requirements

- Docker
- Docker Compose (optional)

No other dependencies are required.

---

## Running the Project

```bash
git clone https://github.com/Sanskar-Rijal/CloverConvert
```
Go to the CloverConvert Directory
```bash
cd CloverConvert
```

Run Docker command
```bash
docker-compose -f docker-compose.yaml up  -d --build
```
