FROM python:3.9-slim-bullseye
ENV PYTHONUNBUFFERED 1

ENV SHELL /bin/bash

ARG REQUIREMENTS

WORKDIR /project

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .


CMD gunicorn app.app:app \
    --name web \
    --bind 0.0.0.0:${PORT:-5000} \
    --workers ${GUNICORN_WORKERS:-2} \
    --threads ${GUNICORN_THREADS:-2}  \
    --timeout ${GUNICORN_TIMEOUT:-60} \
    --capture-output \
    --enable-stdio-inheritance \
    --max-requests 500  \
    --max-requests-jitter 100 \
    --keep-alive ${GUNICORN_TIMEOUT:-60} \
    --preload \
    ${GUNICORN_EXTRA_ARGS} \
    --log-level debug
