.PHONY: install run check-venv

# Check virtual environment

check-venv:
	@if [ -z "$$VIRTUAL_ENV" ]; then \
		echo ""; \
		echo "⚠️  WARNING: Python virtual environment is NOT activated!"; \
		echo ""; \
		echo "Please activate your virtual environment first:"; \
		echo ""; \
		echo "  On macOS/Linux:"; \
		echo "    source venv/bin/activate"; \
		echo ""; \
		echo "  On Windows:"; \
		echo "    venv\\Scripts\\activate"; \
		echo ""; \
		echo "Then run 'make install' again."; \
		echo ""; \
		exit 1; \
	fi

# Setup both the environments

install: check-venv
	@echo "✅ Virtual environment detected!"
	@echo ""
	@echo "Installing Frontend Dependencies..."
	cd frontend && npm install
	@echo ""
	@echo "Installing Backend Dependencies..."
	cd backend && pip install -r requirements.txt
	@echo ""
	@echo "✅ All dependencies installed successfully!"

# Run both servers simultaneously

run:
	@echo "🚀 Starting Backend (FastAPI) and Frontend (React)..."
	@echo ""
	@echo "Backend running at: http://localhost:8000"
	@echo "Frontend running at: http://localhost:5173 (or similar)"
	@echo ""
	@echo "⏹️  To stop both servers, press CTRL+C"
	@echo ""
	@cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 & \
	cd frontend && npm run dev
