#!/bin/bash

docker run -t --rm linter-eslint $1 master | node ../linter-interpreter/dist/cli.js --linter eslint
