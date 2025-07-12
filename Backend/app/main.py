from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.routes import auth
from app.api.routes import item
from app.api.routes import user
from app.api.routes import swap
from app.api.routes import admin
from app.api.routes import call

# Load environment variables
load_dotenv()

app = FastAPI(title="ReWear API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router)
app.include_router(swap.router)
app.include_router(auth.router)
app.include_router(item.router)
app.include_router(user.router)
app.include_router(call.router)
@app.get("/")
def root():
    return {"msg": "ReWear API is up!"}