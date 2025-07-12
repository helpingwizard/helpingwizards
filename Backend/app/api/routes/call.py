from fastapi import APIRouter, HTTPException
from twilio.rest import Client
from typing import Dict
from app.core.config import settings

router = APIRouter(
    prefix="/api/call",
    tags=["call"]
)

@router.post("/make-call")
async def make_call() -> Dict[str, str]:
    """Make a call using Twilio API"""
    try:
        # Get Twilio credentials from settings
        account_sid = settings.TWILIO_ACCOUNT_SID
        auth_token = settings.TWILIO_AUTH_TOKEN
        
        # Initialize Twilio client
        client = Client(account_sid, auth_token)
        
        # Make the call
        call = client.calls.create(
            from_="+17657664169",  # Your Twilio number
            to="+918468976955",     # Destination number
            url="https://e174344c2a61.ngrok-free.app/voice"  # TwiML instructions
        )
        
        return {
            "success": True,
            "message": "Call initiated successfully",
            "call_sid": call.sid
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to make call: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"} 