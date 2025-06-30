#!/usr/bin/env python3
import requests
import json
import uuid
import time
import sys
import random
import string
from datetime import datetime, timedelta

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://524b6883-1ca3-4c10-9f11-a214df9e27a0.preview.emergentagent.com"
API_BASE_URL = f"{BACKEND_URL}/api"

# Test user data
TEST_USER = {
    "email": f"test.user.{uuid.uuid4()}@example.com",
    "password": "SecurePassword123!",
    "full_name": "Test User",
    "company": "Test Company Inc.",
    "phone": "+1234567890"
}

# Global variables to store test data
access_token = None
user_id = None
workflow_id = None
workflow_step_id = None
task_id = None

def test_root_endpoint():
    """Test the root endpoint GET /api/ to ensure it returns 'Hello World'"""
    print("\n🔍 Testing root endpoint GET /api/...")
    try:
        response = requests.get(f"{API_BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ Root endpoint test passed! Received 'Hello World' message.")
                return True
            else:
                print(f"❌ Root endpoint test failed! Expected 'Hello World' but got: {data}")
                return False
        else:
            print(f"❌ Root endpoint test failed! Status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Root endpoint test failed with exception: {str(e)}")
        return False

def test_create_status_check():
    """Test POST /api/status endpoint to create status checks"""
    print("\n🔍 Testing POST /api/status endpoint...")
    try:
        client_name = f"test_client_{uuid.uuid4()}"
        payload = {"client_name": client_name}
        
        response = requests.post(f"{API_BASE_URL}/status", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("client_name") == client_name and "id" in data and "timestamp" in data:
                print(f"✅ Create status check test passed! Created status check with ID: {data['id']}")
                return True, data
            else:
                print(f"❌ Create status check test failed! Unexpected response data: {data}")
                return False, None
        else:
            print(f"❌ Create status check test failed! Status code: {response.status_code}")
            return False, None
    except Exception as e:
        print(f"❌ Create status check test failed with exception: {str(e)}")
        return False, None

def test_get_status_checks(expected_id=None, expected_client_name=None):
    """Test GET /api/status endpoint to retrieve status checks"""
    print("\n🔍 Testing GET /api/status endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/status")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ Get status checks test passed! Retrieved {len(data)} status checks.")
                
                # If we have an expected ID and client name, verify they exist in the response
                if expected_id and expected_client_name:
                    found = False
                    for status in data:
                        if status.get("id") == expected_id and status.get("client_name") == expected_client_name:
                            found = True
                            break
                    
                    if found:
                        print(f"✅ Successfully found the previously created status check with ID: {expected_id}")
                    else:
                        print(f"❌ Could not find the previously created status check with ID: {expected_id}")
                        return False
                
                return True
            else:
                print(f"❌ Get status checks test failed! Expected a list but got: {data}")
                return False
        else:
            print(f"❌ Get status checks test failed! Status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Get status checks test failed with exception: {str(e)}")
        return False

def test_mongodb_connection():
    """Verify MongoDB connection is working by creating and retrieving a status check"""
    print("\n🔍 Testing MongoDB connection...")
    
    # First create a status check
    success, data = test_create_status_check()
    if not success:
        print("❌ MongoDB connection test failed! Could not create a status check.")
        return False
    
    # Wait a moment to ensure data is saved
    time.sleep(1)
    
    # Then retrieve status checks and verify the one we created exists
    if test_get_status_checks(data.get("id"), data.get("client_name")):
        print("✅ MongoDB connection test passed! Successfully created and retrieved data.")
        return True
    else:
        print("❌ MongoDB connection test failed! Could not retrieve the created status check.")
        return False

# ============ AUTHENTICATION TESTS ============

def test_user_registration():
    """Test POST /api/auth/register endpoint for user registration"""
    print("\n🔍 Testing user registration POST /api/auth/register...")
    try:
        response = requests.post(f"{API_BASE_URL}/auth/register", json=TEST_USER)
        
        if response.status_code == 200:
            data = response.json()
            if (data.get("access_token") and 
                data.get("token_type") == "bearer" and 
                data.get("user", {}).get("email") == TEST_USER["email"]):
                
                # Store token and user ID for subsequent tests
                global access_token, user_id
                access_token = data.get("access_token")
                user_id = data.get("user", {}).get("id")
                
                print(f"✅ User registration test passed! User created with ID: {user_id}")
                return True
            else:
                print(f"❌ User registration test failed! Unexpected response data: {data}")
                return False
        else:
            print(f"❌ User registration test failed! Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ User registration test failed with exception: {str(e)}")
        return False

def test_duplicate_registration():
    """Test duplicate email registration handling"""
    print("\n🔍 Testing duplicate email registration...")
    try:
        # Try to register with the same email
        response = requests.post(f"{API_BASE_URL}/auth/register", json=TEST_USER)
        
        if response.status_code == 400:
            data = response.json()
            if "detail" in data and "already registered" in data["detail"].lower():
                print("✅ Duplicate registration test passed! Server correctly rejected duplicate email.")
                return True
            else:
                print(f"❌ Duplicate registration test failed! Unexpected error message: {data}")
                return False
        else:
            print(f"❌ Duplicate registration test failed! Expected status code 400, got: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Duplicate registration test failed with exception: {str(e)}")
        return False

def test_user_login():
    """Test POST /api/auth/login endpoint for user login"""
    print("\n🔍 Testing user login POST /api/auth/login...")
    try:
        login_data = {
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        }
        
        response = requests.post(f"{API_BASE_URL}/auth/login", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            if (data.get("access_token") and 
                data.get("token_type") == "bearer" and 
                data.get("user", {}).get("email") == TEST_USER["email"]):
                
                # Update token for subsequent tests
                global access_token
                access_token = data.get("access_token")
                
                print("✅ User login test passed! Successfully logged in and received token.")
                return True
            else:
                print(f"❌ User login test failed! Unexpected response data: {data}")
                return False
        else:
            print(f"❌ User login test failed! Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ User login test failed with exception: {str(e)}")
        return False

def test_invalid_login():
    """Test login with invalid credentials"""
    print("\n🔍 Testing login with invalid credentials...")
    try:
        # Try to login with wrong password
        login_data = {
            "email": TEST_USER["email"],
            "password": "WrongPassword123!"
        }
        
        response = requests.post(f"{API_BASE_URL}/auth/login", json=login_data)
        
        if response.status_code == 401:
            data = response.json()
            if "detail" in data and "invalid" in data["detail"].lower():
                print("✅ Invalid login test passed! Server correctly rejected invalid credentials.")
                return True
            else:
                print(f"❌ Invalid login test failed! Unexpected error message: {data}")
                return False
        else:
            print(f"❌ Invalid login test failed! Expected status code 401, got: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Invalid login test failed with exception: {str(e)}")
        return False

def test_get_current_user():
    """Test GET /api/auth/me endpoint to get current user profile"""
    print("\n🔍 Testing GET /api/auth/me endpoint...")
    try:
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(f"{API_BASE_URL}/auth/me", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if (data.get("email") == TEST_USER["email"] and 
                data.get("full_name") == TEST_USER["full_name"] and
                data.get("company") == TEST_USER["company"] and
                data.get("phone") == TEST_USER["phone"]):
                
                print("✅ Get current user test passed! Successfully retrieved user profile.")
                return True
            else:
                print(f"❌ Get current user test failed! Unexpected user data: {data}")
                return False
        else:
            print(f"❌ Get current user test failed! Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Get current user test failed with exception: {str(e)}")
        return False

def test_update_user_profile():
    """Test PUT /api/auth/me endpoint to update user profile"""
    print("\n🔍 Testing PUT /api/auth/me endpoint...")
    try:
        # Generate updated profile data
        updated_data = {
            "full_name": f"Updated User {uuid.uuid4().hex[:8]}",
            "company": f"Updated Company {uuid.uuid4().hex[:8]}",
            "phone": f"+1987{random.randint(1000000, 9999999)}"
        }
        
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.put(f"{API_BASE_URL}/auth/me", json=updated_data, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if (data.get("full_name") == updated_data["full_name"] and
                data.get("company") == updated_data["company"] and
                data.get("phone") == updated_data["phone"]):
                
                print("✅ Update user profile test passed! Successfully updated user data.")
                return True
            else:
                print(f"❌ Update user profile test failed! Profile not updated correctly: {data}")
                return False
        else:
            print(f"❌ Update user profile test failed! Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Update user profile test failed with exception: {str(e)}")
        return False

def test_protected_endpoint():
    """Test GET /api/protected/dashboard endpoint that requires authentication"""
    print("\n🔍 Testing protected endpoint GET /api/protected/dashboard...")
    try:
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(f"{API_BASE_URL}/protected/dashboard", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "stats" in data:
                print("✅ Protected endpoint test passed! Successfully accessed protected resource.")
                return True
            else:
                print(f"❌ Protected endpoint test failed! Unexpected response data: {data}")
                return False
        else:
            print(f"❌ Protected endpoint test failed! Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Protected endpoint test failed with exception: {str(e)}")
        return False

def test_protected_endpoint_without_token():
    """Test protected endpoint access without a valid token"""
    print("\n🔍 Testing protected endpoint without token...")
    try:
        # Try to access protected endpoint without token
        response = requests.get(f"{API_BASE_URL}/protected/dashboard")
        
        # Accept either 401 Unauthorized or 403 Forbidden as valid responses
        if response.status_code in [401, 403]:
            data = response.json()
            if "detail" in data:
                print("✅ Protected endpoint without token test passed! Server correctly rejected unauthorized access.")
                return True
            else:
                print(f"❌ Protected endpoint without token test failed! Unexpected error message: {data}")
                return False
        else:
            print(f"❌ Protected endpoint without token test failed! Expected status code 401 or 403, got: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Protected endpoint without token test failed with exception: {str(e)}")
        return False

def test_protected_endpoint_with_invalid_token():
    """Test protected endpoint access with an invalid token"""
    print("\n🔍 Testing protected endpoint with invalid token...")
    try:
        # Try to access protected endpoint with invalid token
        headers = {"Authorization": "Bearer invalidtoken123"}
        response = requests.get(f"{API_BASE_URL}/protected/dashboard", headers=headers)
        
        if response.status_code == 401:
            data = response.json()
            if "detail" in data and "credentials" in data["detail"].lower():
                print("✅ Protected endpoint with invalid token test passed! Server correctly rejected invalid token.")
                return True
            else:
                print(f"❌ Protected endpoint with invalid token test failed! Unexpected error message: {data}")
                return False
        else:
            print(f"❌ Protected endpoint with invalid token test failed! Expected status code 401, got: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Protected endpoint with invalid token test failed with exception: {str(e)}")
        return False

def test_user_logout():
    """Test POST /api/auth/logout endpoint"""
    print("\n🔍 Testing user logout POST /api/auth/logout...")
    try:
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.post(f"{API_BASE_URL}/auth/logout", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "logged out" in data["message"].lower():
                print("✅ User logout test passed! Successfully logged out.")
                return True
            else:
                print(f"❌ User logout test failed! Unexpected response data: {data}")
                return False
        else:
            print(f"❌ User logout test failed! Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ User logout test failed with exception: {str(e)}")
        return False

def run_all_tests():
    """Run all tests and return overall success status"""
    print("🚀 Starting backend API tests...")
    
    tests = [
        ("Root Endpoint", test_root_endpoint),
        ("MongoDB Connection", test_mongodb_connection),
        ("User Registration", test_user_registration),
        ("Duplicate Registration", test_duplicate_registration),
        ("User Login", test_user_login),
        ("Invalid Login", test_invalid_login),
        ("Get Current User", test_get_current_user),
        ("Update User Profile", test_update_user_profile),
        ("Protected Endpoint Access", test_protected_endpoint),
        ("Protected Endpoint Without Token", test_protected_endpoint_without_token),
        ("Protected Endpoint With Invalid Token", test_protected_endpoint_with_invalid_token),
        ("User Logout", test_user_logout)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"Running test: {test_name}")
        print(f"{'='*50}")
        result = test_func()
        results.append(result)
        print(f"Test result: {'✅ PASSED' if result else '❌ FAILED'}")
    
    # Print summary
    print("\n" + "="*50)
    print("TEST SUMMARY")
    print("="*50)
    
    all_passed = all(results)
    for i, (test_name, _) in enumerate(tests):
        status = "✅ PASSED" if results[i] else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    print("\nOverall result:", "✅ ALL TESTS PASSED" if all_passed else "❌ SOME TESTS FAILED")
    return all_passed

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)