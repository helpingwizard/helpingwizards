from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    PROJECT_NAME: str = "ReWear"
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Twilio Settings
    TWILIO_ACCOUNT_SID: str
    TWILIO_AUTH_TOKEN: str

    class Config:
        env_file = ".env"

settings = Settings()