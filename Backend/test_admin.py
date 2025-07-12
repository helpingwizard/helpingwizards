#!/usr/bin/env python3
"""
Test script to verify admin functionality
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_admin_functionality():
    print("🔑 Testing Admin Functionality")
    print("=" * 50)
    
    # Test 1: Admin Login
    print("\n1. Testing admin login...")
    login_data = {
        "username": "admin",
        "password": "admin"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
        print(f"Admin login: {response.status_code}")
        if response.status_code == 200:
            token_data = response.json()
            admin_token = token_data["access_token"]
            print("✅ Admin login successful")
            admin_headers = {"Authorization": f"Bearer {admin_token}"}
        else:
            print(f"❌ Admin login failed: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Admin login error: {e}")
        return False
    
    # Test 2: Get admin user info
    print("\n2. Testing admin user info...")
    try:
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=admin_headers)
        print(f"Admin user info: {response.status_code}")
        if response.status_code == 200:
            admin_user = response.json()
            print(f"✅ Admin user: {admin_user['name']}, is_admin: {admin_user['is_admin']}")
            if not admin_user['is_admin']:
                print("❌ User is not admin!")
                return False
        else:
            print(f"❌ Get admin user failed: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Get admin user error: {e}")
        return False
    
    # Test 3: Test admin routes
    print("\n3. Testing admin routes...")
    
    # Test admin stats
    try:
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers)
        print(f"Admin stats: {response.status_code}")
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ Admin stats: {stats}")
        else:
            print(f"❌ Admin stats failed: {response.json()}")
    except Exception as e:
        print(f"❌ Admin stats error: {e}")
    
    # Test get all items
    try:
        response = requests.get(f"{BASE_URL}/api/admin/items", headers=admin_headers)
        print(f"Admin items: {response.status_code}")
        if response.status_code == 200:
            items = response.json()
            print(f"✅ Admin items: {len(items)} items found")
        else:
            print(f"❌ Admin items failed: {response.json()}")
    except Exception as e:
        print(f"❌ Admin items error: {e}")
    
    # Test get pending items
    try:
        response = requests.get(f"{BASE_URL}/api/admin/items/pending", headers=admin_headers)
        print(f"Admin pending items: {response.status_code}")
        if response.status_code == 200:
            pending_items = response.json()
            print(f"✅ Admin pending items: {len(pending_items)} items found")
        else:
            print(f"❌ Admin pending items failed: {response.json()}")
    except Exception as e:
        print(f"❌ Admin pending items error: {e}")
    
    # Test get all users
    try:
        response = requests.get(f"{BASE_URL}/api/admin/users", headers=admin_headers)
        print(f"Admin users: {response.status_code}")
        if response.status_code == 200:
            users = response.json()
            print(f"✅ Admin users: {len(users)} users found")
        else:
            print(f"❌ Admin users failed: {response.json()}")
    except Exception as e:
        print(f"❌ Admin users error: {e}")
    
    # Test 4: Test non-admin user access
    print("\n4. Testing non-admin user access...")
    
    # Create a regular user
    regular_user_data = {
        "email": "regular@example.com",
        "password": "password123",
        "name": "Regular User",
        "location": "Regular Location"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=regular_user_data)
        print(f"Regular user registration: {response.status_code}")
    except Exception as e:
        print(f"Regular user already exists or error: {e}")
    
    # Login as regular user
    regular_login_data = {
        "username": "regular@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", data=regular_login_data)
        if response.status_code == 200:
            regular_token = response.json()["access_token"]
            regular_headers = {"Authorization": f"Bearer {regular_token}"}
            
            # Try to access admin routes with regular user
            response = requests.get(f"{BASE_URL}/api/admin/stats", headers=regular_headers)
            print(f"Regular user accessing admin stats: {response.status_code}")
            if response.status_code == 403:
                print("✅ Regular user correctly denied access to admin routes")
            else:
                print(f"❌ Regular user should not have access to admin routes: {response.json()}")
        else:
            print(f"❌ Regular user login failed: {response.json()}")
    except Exception as e:
        print(f"❌ Regular user test error: {e}")
    
    print("\n🎉 Admin functionality testing completed!")
    return True

if __name__ == "__main__":
    test_admin_functionality() 