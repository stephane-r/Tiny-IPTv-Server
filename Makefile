DOCKERCOMPO = docker-compose
DOCKERCOMPORUN = $(DOCKERCOMPO) run --rm --service-ports tiny_iptv
DOCKERNPM = $(DOCKERCOMPORUN) npm

# Help
.SILENT:
.PHONY: help

help: ## Display this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

##########
# Docker #
##########
docker-build:
	@echo "--> Build docker image"
	docker-compose build
docker-up:
	@echo "--> Start docker services"
	$(DOCKERCOMPO) run -d --rm --service-ports tiny_iptv npm start
docker-down:
	@echo "--> Stop docker services"
	$(DOCKERCOMPO) down
docker-restart:
	@echo "--> Restart docker services"
	make docker-down
	make docker-up

#######
# NPM #
#######
npm-install:
	@echo "--> Install dependencies"
	$(DOCKERNPM) install
npm-start:
	@echo "--> Install dependencies"
	$(DOCKERNPM) start
npm-dev:
	@echo "--> Install dependencies"
	$(DOCKERNPM) run dev