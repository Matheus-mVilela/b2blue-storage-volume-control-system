build:
	@[ -f .env ] || cp .env.example .env
	@docker-compose build

format: up ## Style code
	@docker-compose exec backend /bin/bash -c 'isort . && blue . && flake8 .'

test: up ## Run tests
	@docker-compose exec backend /bin/bash -c './manage.py test app'

restart: ## Restart the container
	@docker-compose restart backend

cmd: up ## Access bash
	@docker-compose exec backend /bin/bash

shell: up ## Access django shell
	@docker-compose exec backend /bin/bash -c './manage.py shell'

up:
	@docker-compose up backend -d 

up-backend: up 
	@docker-compose exec backend /bin/bash -c './manage.py runserver 0.0.0.0:8000'

logs: 
	@docker-compose logs backend -f 

down: 
	@docker-compose down || true

makemigrations: up
	@docker-compose exec backend /bin/bash -c './manage.py makemigrations'

migrate: up
	@docker-compose exec backend /bin/bash -c './manage.py migrate'

createsuperuser: up
	@docker-compose exec backend /bin/bash -c './manage.py createsuperuser'

up-frontend:
	@docker-compose up frontend -d
