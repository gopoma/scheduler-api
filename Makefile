dev:
	docker-compose up -d
prod:
	docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
