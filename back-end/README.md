# maploops-backend
maploops-backend

## Setup Guide

### Prerequisites

- PHP 8.2+
- Composer 2.8.9

### Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/octoplusit/maploops-backend.git
   cd maploops-backend
   ```

2. **Copy environment file:**
   ```
   cp .env.example .env
   ```
   Edit `.env` as needed. Change the DB and relavant configurations as needed
   🚨 **Warning:** Do not delelete .env.example

3. **Install PHP dependencies:**
   ```
   composer install
   ```

5. **Generate application key:**
   ```
   php artisan key:generate
   ```

6. **Run database migrations:** ( Only if database not available )
   ```
   php artisan migrate
   ```
