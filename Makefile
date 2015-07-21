SHELL = /bin/bash
MAKEFLAGS += --no-print-directory --silent
export PATH := ./node_modules/.bin:$(PATH):./bin
LINT_DIR = $(wildcard *.js test/*.js lib/*.js test/**/*.json spikes/*)

setup:
	npm install

# the default will run lint jscs and test
default: ci

path:
	echo $$PATH

# run test with dependencies lint and jscs
test: setup lint style
	echo "Test started"
	mocha test/


test-coveralls:
	./node_modules/.bin/jscoverage lib lib-cov
	./node_modules/.bin/mocha YOUR_TESTS/**.js -R mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
	# @NODE_ENV=test ./node_modules/.bin/istanbul cover \
	# ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && \
	# 	cat ./coverage/lcov.info | ./bin/coveralls.js --verbose

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
	echo "2. 'git checkout -b (release-x.x.x || hotfix-x.x.x) master"
	echo "3. 'git merge development --no-ff --log'"
	echo "4. 'Make release'"

release: lint style test
	echo "1. 'git checkout master'"
	echo "2. 'git merge (release-x.x.x || hotfix-x.x.x) --no-ff --log'"
	echo "3. 'release-it'"
	echo "4. 'git checkout development'"
	echo "5. 'git merge (release-x.x.x || hotfix-x.x.x) --no-ff --log'"
	echo "6. 'git branch -d (release-x.x.x || hotfix-x.x.x)'"

test-coverage-report:
	echo "Generating coverage report, please stand by"
	test -d node_modules/nyc/ || npm install nyc
	nyc mocha && nyc report --reporter=html


.PHONY: test ci