ROOT_DIR := $(shell pwd)

SUBGRAPH_DIR := $(ROOT_DIR)/packages/$(subgraph)

setup-subgraph:
	@if [ -z "$(subgraph)" ]; then \
		echo "Error: Please specify the subgraph package name. Usage: make setup-subgraph subgraph=<subgraph-name>"; \
		exit 1; \
	fi
	@echo "Setting up subgraph package: $(subgraph)"
	@mkdir -p $(SUBGRAPH_DIR)/scripts
	@cp $(ROOT_DIR)/subgraph.template.yaml $(SUBGRAPH_DIR)/subgraph.template.yaml
	@cp $(ROOT_DIR)/.env.example $(SUBGRAPH_DIR)/.env
	@cp $(ROOT_DIR)/docker-compose.yaml $(SUBGRAPH_DIR)/docker-compose.yaml
	@cp -r $(ROOT_DIR)/scripts/* $(SUBGRAPH_DIR)/scripts/
	@echo "Subgraph setup complete in $(SUBGRAPH_DIR)"


	