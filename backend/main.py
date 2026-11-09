import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, tables, menu, reservations, users, ai

app = FastAPI(
    title="Pam Coffee & Tea API (FastAPI Backend)",
    description="Hệ thống Backend RESTful API cho ứng dụng di động đặt bàn cà phê Pam Coffee & Tea",
    version="1.0.0"
)

# Enable CORS for Mobile App and Web
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(tables.router)
app.include_router(menu.router)
app.include_router(reservations.router)
app.include_router(users.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Pam Coffee & Tea FastAPI Backend",
        "docs": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)

