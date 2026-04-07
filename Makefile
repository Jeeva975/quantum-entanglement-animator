.PHONY: install run check-venv

# Check virtual environment

check-venv:
	@if [ -z "$$VIRTUAL_ENV" ]; then \
		echo ""; \
		echo "WARNING: Python virtual environment is NOT activated!"; \
		echo ""; \
		echo "It's recommended to use a virtual environment to isolate dependencies."; \
		echo ""; \
		echo "To activate your virtual environment:"; \
		echo ""; \
		echo "  On GNU/Linux or macOS:"; \
		echo "    source venv/bin/activate"; \
		echo ""; \
		echo "  On Windows:"; \
		echo "    venv\\Scripts\\activate"; \
		echo ""; \
		read -p "Do you want to proceed without activating venv? (y/N): " proceed; \
		if [ "$$proceed" = "y" ] || [ "$$proceed" = "Y" ]; then \
			echo ""; \
			echo "Proceeding without virtual environment..."; \
			echo ""; \
		else \
			echo ""; \
			echo "Installation cancelled. Please activate your venv and try again."; \
			echo ""; \
			exit 1; \
		fi; \
	fi

# Setup both environments

install: check-venv
	@echo "Installing Frontend Dependencies..."
	cd frontend && npm install
	@echo ""
	@echo "Installing Backend Dependencies..."
	cd backend && pip install -r requirements.txt
	@echo ""
	@echo "All dependencies installed successfully!"

# Run both servers simultaneously

run:
	@echo "Starting Backend (FastAPI) and Frontend (React)..."
	@echo ""
	@echo "Backend running at: http://localhost:8000"
	@echo "Frontend running at: http://localhost:5173 (or similar)"
	@echo ""
	@echo "To stop both servers, press CTRL+C"
	@echo ""
	@cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 & \
	cd frontend && npm run dev
