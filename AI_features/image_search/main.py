from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker
from pgvector.sqlalchemy import Vector
from sqlalchemy import text
import torch
from torchvision import transforms
from PIL import Image
import requests
from io import BytesIO

# CONFIG
DATABASE_URL = "postgresql+psycopg2://postgres:8855@localhost:5426/postgres"

# DB SETUP
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# PGVECTOR MODEL
class ClothingItem(Base):
    __tablename__ = "clothing_items"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=False)
    embedding = Column(Vector(dim=1000), nullable=False)

# FastAPI app
app = FastAPI()

# Pydantic Schemas
class UploadRequest(BaseModel):
    image_url: str

class SearchResponse(BaseModel):
    id: int
    image_url: str
    similarity: float

# Example image embedding function using ResNet18
model = torch.hub.load('pytorch/vision', 'resnet18', pretrained=True)
model.eval()
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def generate_embedding(image_url: str) -> List[float]:
    # Download image
    response = requests.get(image_url)
    if response.status_code != 200:
        raise ValueError(f"Failed to download image: {response.status_code}")
    
    # Try to open image safely
    try:
        img = Image.open(BytesIO(response.content)).convert('RGB')
    except:
        raise ValueError(f"Invalid image data at URL: {image_url}")
    img_tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        embedding = model(img_tensor).squeeze().numpy()
    embedding = embedding / torch.linalg.norm(torch.tensor(embedding))  # normalize
    return embedding.tolist()

# Create DB tables (for quick demo)
Base.metadata.create_all(bind=engine)

# ROUTES

@app.post("/upload")
def upload_item(data: UploadRequest):
    db = SessionLocal()
    try:
        embedding = generate_embedding(data.image_url)
        item = ClothingItem(image_url=data.image_url, embedding=embedding)
        db.add(item)
        db.commit()
        db.refresh(item)
        return {"id": item.id, "message": "Item uploaded!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.post("/search", response_model=List[SearchResponse])
def search_item(data: UploadRequest):
    db = SessionLocal()
    try:
        embedding = generate_embedding(data.image_url)
        # pgvector similarity operator: <-> means cosine distance
        embedding_literal = "[" + ", ".join([str(x) for x in embedding]) + "]"

        results = db.execute(
            text(f"""
            SELECT id, image_url, embedding <-> '{embedding_literal}'::vector AS similarity
            FROM clothing_items
            ORDER BY embedding <-> '{embedding_literal}'::vector
            LIMIT 5
        """),
            {"embedding": embedding}
        ).fetchall()
        return [{"id": r[0], "image_url": r[1], "similarity": r[2]} for r in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
