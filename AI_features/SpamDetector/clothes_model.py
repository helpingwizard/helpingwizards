import torch
import requests
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification

# --- Model and Processor Loading ---
# We use the same multi-class clothing model.
print("Loading the model and processor... This might take a moment.")
try:
    processor = AutoImageProcessor.from_pretrained("dima806/clothes_image_detection")
    model = AutoModelForImageClassification.from_pretrained("dima806/clothes_image_detection")
    print("Model and processor loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    exit()

def is_image_clothing(image_source: str, confidence_threshold: float = 0.50):
    """
    Determines if an image contains clothing or not by using a confidence threshold.

    Args:
        image_source (str): The URL or local file path of the image.
        confidence_threshold (float): The minimum confidence score (0.0 to 1.0) 
                                      required to classify the image as clothing. 
                                      Defaults to 0.50 (50%).

    Returns:
        dict: A dictionary with the result, the model's top guess, and the confidence score.
    """
    try:
        # 1. Load the image from URL or local file
        if image_source.startswith(('http://', 'https://')):
            image = Image.open(requests.get(image_source, stream=True).raw).convert("RGB")
        else:
            image = Image.open(image_source).convert("RGB")

        # 2. Process the image and make a prediction
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)
        
        logits = outputs.logits
        
        # 3. Get the confidence score of the top prediction
        probabilities = torch.nn.functional.softmax(logits, dim=-1)
        top_prob = probabilities.max().item()
        top_label_id = logits.argmax(-1).item()
        top_label_name = model.config.id2label[top_label_id]

        # 4. Apply the threshold logic
        is_clothing = top_prob >= confidence_threshold

        return {
            "is_clothing": is_clothing,
            "best_guess": top_label_name,
            "confidence": top_prob
        }

    except Exception as e:
        return {"error": str(e)}

# --- Main execution block ---
if __name__ == "__main__":
    # You can adjust this threshold based on your needs.
    # A higher value (e.g., 0.8) is stricter.
    # A lower value (e.g., 0.3) is more lenient.
    DETECTION_THRESHOLD = 0.1

    # --- List of images to test ---
    # Includes both clothing and non-clothing items.
    test_images = {
        "T-shirt (Clothing)": "https://chidiyaa.com/cdn/shop/files/IMG_4365.jpg?v=1746014583&width=3435",
        "Jeans (Clothing)": "https://www.berrylush.com/cdn/shop/files/27-07-2300227_1.jpg?v=1750066628",
        "Car (Not Clothing)": "https://www.shutterstock.com/shutterstock/photos/147766070/display_1500/stock-photo-portrait-of-a-laughing-man-147766070.jpg",
        "Dog (Not Clothing)": "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
        "Food (Not Clothing)": "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
    }

    print(f"\n--- Running detection with a threshold of {DETECTION_THRESHOLD:.0%} ---")

    for name, source in test_images.items():
        print(f"\nProcessing: {name}")
        result = is_image_clothing(source, confidence_threshold=DETECTION_THRESHOLD)

        if "error" in result:
            print(f"  -> Error: {result['error']}")
        else:
            if result["is_clothing"]:
                print(f"  ✅ Result: This IS clothing.")
            else:
                print(f"  ❌ Result: This is NOT clothing.")
            
            # Print details to show why the decision was made
            print(f"     (Model's best guess was '{result['best_guess']}' with {result['confidence']:.2%} confidence)")