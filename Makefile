build:
	@[ -f .env ] || cp template.env .env
	@docker-compose build

format: up ## Style code
	@docker-compose exec backend /bin/bash -c 'isort . && black -l 79 . && flake8 .'

test: up ## Run tests
	@docker-compose exec backend /bin/bash -c './backend/manage.py test app'

restart: ## Restart the container
	@docker-compose restart backend

cmd: up ## Access bash
	@docker-compose exec backend /bin/bash

shell: up ## Access django shell
	@docker-compose exec backend /bin/bash -c './backend/manage.py shell'

up:
	@docker-compose up backend -d 

up-api: up 
	@docker-compose exec backend /bin/bash -c './backend/manage.py runserver 0.0.0.0:8000'

log: 
	@docker-compose logs backend -f 

down: 
	@docker-compose down || true

makemigrations: up
	@docker-compose exec backend /bin/bash -c './backend/manage.py makemigrations'

migrate: up
	@docker-compose exec backend /bin/bash -c './backend/manage.py migrate'

createsuperuser: up
	@docker-compose exec backend /bin/bash -c './backend/manage.py createsuperuser'
