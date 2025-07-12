from fastapi import FastAPI
from app.api.routes import auth
from app.api.routes import item
from app.api.routes import user
from app.api.routes import swap
from app.api.routes import admin
app = FastAPI(title="ReWear API")
app.include_router(admin.router)
app.include_router(swap.router)
app.include_router(auth.router)
app.include_router(item.router)
app.include_router(user.router)
@app.get("/")
def root():
    return {"msg": "ReWear API is up!"}