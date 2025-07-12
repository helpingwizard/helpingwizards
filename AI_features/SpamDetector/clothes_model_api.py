
import torch
import requests
from PIL import Image
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from transformers import AutoImageProcessor, AutoModelForImageClassification


app = FastAPI(
    title="Clothing Detection API",
    description="An API to detect if an image contains clothing or not.",
    version="1.0.0",
)


try:
    print("Loading model from Hugging Face... This might take a moment.")
    processor = AutoImageProcessor.from_pretrained("dima806/clothes_image_detection")
    model = AutoModelForImageClassification.from_pretrained("dima806/clothes_image_detection")
    print("Model loaded successfully and is ready to receive requests.")
except Exception as e:
    
    print(f"FATAL: Could not load model. Error: {e}")
    
    model = None
    processor = None


class ImageRequest(BaseModel):
    image_url: HttpUrl


def check_if_clothing(image_source: str, confidence_threshold: float = 0.10):
    """
    The core logic to classify an image and determine if it's clothing.
    """
    if not model or not processor:
        raise RuntimeError("Model is not loaded. The application cannot process requests.")
        
    try:
        
        image = Image.open(requests.get(image_source, stream=True).raw).convert("RGB")

        
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)
        
        logits = outputs.logits
        
        
        probabilities = torch.nn.functional.softmax(logits, dim=-1)
        top_prob = probabilities.max().item()

        
        is_clothing = top_prob >= confidence_threshold

        return {
            "is_clothing": is_clothing,
            "confidence": top_prob
        }
    except requests.exceptions.RequestException as e:
        
        raise HTTPException(status_code=400, detail=f"Could not retrieve image from URL: {e}")
    except Exception as e:
        
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {e}")


@app.post("/detect-clothing/")
async def detect_clothing_endpoint(request: ImageRequest):
    """
    Receives an image URL and returns whether it's clothing or not.
    
    - **image_url**: The public URL of the image to analyze.
    """
    result = check_if_clothing(str(request.image_url)) # Convert HttpUrl to string
    
   
    if result["is_clothing"]:
        response_message = "clothing"
    else:
        response_message = "not clothing"
        
    return {
        "result": response_message,
        "confidence": result["confidence"]
    }

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Welcome to the Clothing Detection API! Go to /docs for more info."}