FROM php:7.4-cli

# Install common dependencies
RUN apt-get update -qq \
  && DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
    build-essential \
    gnupg2 \
    curl \
    less \
    git \
    wget \
    unzip \
  && apt-get clean \
  && rm -rf /var/cache/apt/archives/* \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && truncate -s 0 /var/log/*log

# Install needed PHP extensions
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions \
  && install-php-extensions zip pdo_mysql sysvsem

# Install MySQL dependencies
RUN apt-get update -qq \
  && DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
    mariadb-client \
  && apt-get clean \
  && rm -rf /var/cache/apt/archives/* \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && truncate -s 0 /var/log/*log

# Install Composer
COPY install-composer.sh .
RUN sh install-composer.sh \
  && rm install-composer.sh

# Install Symfony CLI
RUN wget -q https://github.com/symfony/cli/releases/download/v4.26.6/symfony_linux_amd64.gz \
    && gzip -d symfony_linux_amd64.gz \
    && chmod +x symfony_linux_amd64 \
    && mv symfony_linux_amd64 /usr/local/bin/symfony

# Create a directory for the app code
RUN mkdir -p /app
WORKDIR /app

# Document that we're going to expose port 8000
EXPOSE 8000
# Use Bash as the default command
CMD ["/usr/bin/bash"]
