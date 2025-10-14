from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, league, lines, bets

app = FastAPI(
    title="BetLeague API",
    description="Backend API for BetLeague",
    version="1.0.0",
    openapi_tags=[
        {"name": "Auth", "description": "Authentication routes"},
        {"name": "Leagues", "description": "League management"},
        {"name": "Lines", "description": "NFL betting lines"},
        {"name": "Bets", "description": "App point bet routes"},
    ],
    openapi_kwargs={
        "components": {
            "securitySchemes": {
                "HTTPBearer": {
                    "type": "http",
                    "scheme": "bearer"
                }
            }
        },
        "security": [{"HTTPBearer": []}],
    },
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(league.router)
app.include_router(lines.router)
app.include_router(bets.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to BetLeague backend!"}