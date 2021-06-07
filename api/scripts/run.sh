#!/bin/sh -e
set -x

sh ./scripts/lint.sh
uvicorn app.main:app --reload