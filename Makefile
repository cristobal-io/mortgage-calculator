SHELL = /bin/bash
MAKEFLAGS += --no-print-directory --silent
export PATH := ./node_modules/.bin:$(PATH):./bin
LINT_DIR = $(wildcard *.js test/*.js lib/*.js test/**/*.json spikes/*)

setup:
	npm install

grunt-server:
	grunt server

path:
	echo $$PATH

which:
	which grunt

# run test with dependencies lint and jscs
test: setup lint style
	echo "Test started"
	mocha test/

# Dev mode for continuous testing
dev:
	mocha --watch test

lint:
	echo "Linting started..."
	jshint $(LINT_DIR)
	echo "Linting finished without errors"
	echo

style:
	echo "Checking style..."
	jscs $(LINT_DIR)
	echo

# Continuous Integration Test Runner
ci: lint style test
	echo "1. Make sure 'git status' is clean."
	echo "2. Build on the integration box."
	echo "3. 'git checkout integration'"
	echo "4. 'git merge branch_desired_to_bring_to_integration --no-ff --log'"
	echo "5. 'git checkout master'"

test-coverage-report:
	echo "Generating coverage report, please stand by"
	test -d node_modules/nyc/ || npm install nyc
	nyc mocha && nyc report --reporter=html


.PHONY: test