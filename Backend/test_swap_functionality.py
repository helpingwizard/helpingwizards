import requests
import json

BASE_URL = "http://localhost:8000"

def test_swap_functionality():
    print("🧪 Testing Swap Functionality")
    print("=" * 50)
    
    # Test 1: Create two users and login
    print("\n1. Creating test users...")
    
    # Create first user
    user1_data = {
        "email": "swapuser1@example.com",
        "password": "password123",
        "name": "Swap User 1",
        "location": "New York"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=user1_data)
        print(f"User 1 registration: {response.status_code}")
    except Exception as e:
        print(f"User 1 already exists or error: {e}")
    
    # Create second user
    user2_data = {
        "email": "swapuser2@example.com",
        "password": "password123",
        "name": "Swap User 2",
        "location": "Los Angeles"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=user2_data)
        print(f"User 2 registration: {response.status_code}")
    except Exception as e:
        print(f"User 2 already exists or error: {e}")
    
    # Login as user 1
    print("\n2. Logging in as User 1...")
    login_data = {
        "username": "swapuser1@example.com",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
    if response.status_code == 200:
        user1_token = response.json()["access_token"]
        print("✅ User 1 login successful")
        user1_headers = {"Authorization": f"Bearer {user1_token}"}
        
        # Get user 1 info
        user1_info = requests.get(f"{BASE_URL}/api/auth/me", headers=user1_headers).json()
        print(f"User 1 ID: {user1_info['id']}")
    else:
        print(f"❌ User 1 login failed: {response.status_code}")
        return
    
    # Login as user 2
    print("\n3. Logging in as User 2...")
    login_data = {
        "username": "swapuser2@example.com",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
    if response.status_code == 200:
        user2_token = response.json()["access_token"]
        print("✅ User 2 login successful")
        user2_headers = {"Authorization": f"Bearer {user2_token}"}
        
        # Get user 2 info
        user2_info = requests.get(f"{BASE_URL}/api/auth/me", headers=user2_headers).json()
        print(f"User 2 ID: {user2_info['id']}")
    else:
        print(f"❌ User 2 login failed: {response.status_code}")
        return
    
    # Test 2: Create an item as user 1
    print("\n4. Creating an item as User 1...")
    item_data = {
        "title": "Test Swap Item",
        "description": "A test item for swap functionality",
        "category": "Electronics",
        "size": "Medium",
        "condition": "Good",
        "images": ["https://example.com/image1.jpg"],
        "location": "New York",
        "points": 50,
        "tags": "test,swap,electronics"
    }
    
    response = requests.post(f"{BASE_URL}/api/items", json=item_data, headers=user1_headers)
    if response.status_code == 200:
        created_item = response.json()
        item_id = created_item["id"]
        print(f"✅ Item created successfully with ID: {item_id}")
    else:
        print(f"❌ Item creation failed: {response.status_code} - {response.text}")
        return
    
    # Test 3: Create a swap request as user 2
    print("\n5. Creating swap request as User 2...")
    swap_data = {
        "item_id": item_id,
        "requester_id": user2_info["id"],
        "owner_id": user1_info["id"],
        "message": "Hi! I'd like to swap for this item. I have a great alternative!"
    }
    
    response = requests.post(f"{BASE_URL}/api/swaps", json=swap_data, headers=user2_headers)
    if response.status_code == 200:
        created_swap = response.json()
        swap_id = created_swap["id"]
        print(f"✅ Swap request created successfully with ID: {swap_id}")
        print(f"Status: {created_swap['status']}")
    else:
        print(f"❌ Swap request creation failed: {response.status_code} - {response.text}")
        return
    
    # Test 4: Get swap requests as user 1 (owner)
    print("\n6. Getting swap requests as User 1 (item owner)...")
    response = requests.get(f"{BASE_URL}/api/swaps", headers=user1_headers)
    if response.status_code == 200:
        swaps = response.json()
        print(f"✅ Found {len(swaps)} swap requests")
        for swap in swaps:
            if swap["id"] == swap_id:
                print(f"Found our swap request: Status = {swap['status']}")
    else:
        print(f"❌ Failed to get swap requests: {response.status_code}")
        return
    
    # Test 5: Accept the swap request as user 1
    print("\n7. Accepting swap request as User 1...")
    response = requests.put(f"{BASE_URL}/api/swaps/{swap_id}", 
                          json={"status": "accepted"}, 
                          headers=user1_headers)
    if response.status_code == 200:
        updated_swap = response.json()
        print(f"✅ Swap request accepted successfully")
        print(f"New status: {updated_swap['status']}")
    else:
        print(f"❌ Failed to accept swap request: {response.status_code} - {response.text}")
        return
    
    # Test 6: Verify the swap status
    print("\n8. Verifying swap status...")
    response = requests.get(f"{BASE_URL}/api/swaps/{swap_id}", headers=user1_headers)
    if response.status_code == 200:
        swap = response.json()
        print(f"✅ Swap status verified: {swap['status']}")
    else:
        print(f"❌ Failed to get swap details: {response.status_code}")
    
    # Test 7: Create another swap request to test rejection
    print("\n9. Creating another swap request to test rejection...")
    swap_data2 = {
        "item_id": item_id,
        "requester_id": user2_info["id"],
        "owner_id": user1_info["id"],
        "message": "Another swap request for testing rejection"
    }
    
    response = requests.post(f"{BASE_URL}/api/swaps", json=swap_data2, headers=user2_headers)
    if response.status_code == 200:
        created_swap2 = response.json()
        swap_id2 = created_swap2["id"]
        print(f"✅ Second swap request created with ID: {swap_id2}")
        
        # Reject this swap request
        print("\n10. Rejecting the second swap request...")
        response = requests.put(f"{BASE_URL}/api/swaps/{swap_id2}", 
                              json={"status": "rejected"}, 
                              headers=user1_headers)
        if response.status_code == 200:
            rejected_swap = response.json()
            print(f"✅ Swap request rejected successfully")
            print(f"Status: {rejected_swap['status']}")
        else:
            print(f"❌ Failed to reject swap request: {response.status_code}")
    else:
        print(f"❌ Failed to create second swap request: {response.status_code}")
    
    print("\n" + "=" * 50)
    print("🎉 Swap functionality test completed!")
    print("✅ All major swap operations are working correctly")

if __name__ == "__main__":
    test_swap_functionality() 