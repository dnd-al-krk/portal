#!/bin/bash

set -e

devel_web(){
    python manage.py runserver 0.0.0.0:8000
}

prod_web(){
    echo Starting Gunicorn.
    exec gunicorn portal.wsgi:application \
        --bind 0.0.0.0:8000 \
        --workers 3
}

bootstrap(){
    pip install -r requirements/docker.txt
    pip install -r requirements/devel.txt
    export PGPASSWORD=$PORTAL_PROD_DB_PASS
    dropdb -U postgres -h db postgres
    createdb -U postgres -h db postgres
    python manage.py migrate
    if [ -f fixtures.json ]; then
        python manage.py loaddata fixtures.json
    fi
}

$@
