FROM php:8.2-apache

RUN apt-get update && \
    apt-get install -y vim zip unzip curl openssl gettext-base cron

# Install common PHP extension dependencies
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    zlib1g-dev \
    libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_mysql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && sed -i 's#;error_log = php_errors.log#error_log = /dev/stderr#g' "$PHP_INI_DIR/php.ini"

# Set up Node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sLo /usr/local/bin/composer https://getcomposer.org/download/2.8.9/composer.phar && \
    chmod +x /usr/local/bin/composer

RUN a2enmod rewrite

COPY ./docker/000-default.conf /etc/apache2/sites-available/000-default.conf

COPY composer.* ./

RUN composer install --no-scripts

COPY . .

COPY ./docker/laravel-bootstrap.sh /usr/local/bin/laravel-bootstrap.sh
RUN chmod +x /usr/local/bin/laravel-bootstrap.sh
RUN sed -i '$ i\/usr/local/bin/laravel-bootstrap.sh' /usr/local/bin/docker-php-entrypoint

RUN chown -R www-data:www-data /var/www/html/storage
RUN chown -R www-data:www-data /var/www/html/public
RUN chown -R www-data:www-data /var/www/html/bootstrap/cache

EXPOSE 80
