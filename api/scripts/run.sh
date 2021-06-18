#!/bin/sh -e
set -x

sh ./scripts/lint.sh
uvicorn app.main:app --host=0.0.0.0 --reload