#!/usr/bin/env python3
"""
Simple test script to check backend functionality and create sample data
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_backend():
    print("Testing backend connection...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Root endpoint: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Error connecting to backend: {e}")
        return False
    
    # Test user registration
    print("\n1. Testing user registration...")
    user_data = {
        "email": "test@example.com",
        "password": "testpass123",
        "name": "Test User",
        "location": "San Francisco, CA"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
        print(f"Registration: {response.status_code}")
        if response.status_code == 200:
            print(f"User created: {response.json()}")
            user_id = response.json()["id"]
        else:
            print(f"Registration failed: {response.json()}")
            return False
    except Exception as e:
        print(f"Registration error: {e}")
        return False
    
    # Test user login
    print("\n2. Testing user login...")
    login_data = {
        "username": "test@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
        print(f"Login: {response.status_code}")
        if response.status_code == 200:
            token_data = response.json()
            token = token_data["access_token"]
            print(f"Login successful, token: {token[:20]}...")
        else:
            print(f"Login failed: {response.json()}")
            return False
    except Exception as e:
        print(f"Login error: {e}")
        return False
    
    # Test authenticated endpoints
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test get current user
    print("\n3. Testing get current user...")
    try:
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        print(f"Get user: {response.status_code}")
        if response.status_code == 200:
            print(f"User info: {response.json()}")
        else:
            print(f"Get user failed: {response.json()}")
    except Exception as e:
        print(f"Get user error: {e}")
    
    # Test create item
    print("\n4. Testing create item...")
    item_data = {
        "title": "Test Vintage Jacket",
        "description": "A beautiful vintage denim jacket in excellent condition",
        "category": "Outerwear",
        "size": "M",
        "condition": "Excellent",
        "tags": "vintage,denim,jacket",
        "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
        "location": "San Francisco, CA",
        "points": 35
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/items", json=item_data, headers=headers)
        print(f"Create item: {response.status_code}")
        if response.status_code == 200:
            item = response.json()
            print(f"Item created: {item}")
            item_id = item["id"]
        else:
            print(f"Create item failed: {response.json()}")
            return False
    except Exception as e:
        print(f"Create item error: {e}")
        return False
    
    # Test get all items
    print("\n5. Testing get all items...")
    try:
        response = requests.get(f"{BASE_URL}/api/items")
        print(f"Get items: {response.status_code}")
        if response.status_code == 200:
            items = response.json()
            print(f"Found {len(items)} items")
            for item in items:
                print(f"  - {item['title']} (ID: {item['id']})")
        else:
            print(f"Get items failed: {response.json()}")
    except Exception as e:
        print(f"Get items error: {e}")
    
    print("\n✅ Backend test completed successfully!")
    return True

if __name__ == "__main__":
    test_backend() 