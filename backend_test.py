#!/usr/bin/env python3
import requests
import json
import uuid
import time
import sys
from datetime import datetime

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://524b6883-1ca3-4c10-9f11-a214df9e27a0.preview.emergentagent.com"
API_BASE_URL = f"{BACKEND_URL}/api"

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

def run_all_tests():
    """Run all tests and return overall success status"""
    print("🚀 Starting backend API tests...")
    
    tests = [
        ("Root Endpoint", test_root_endpoint),
        ("MongoDB Connection", test_mongodb_connection)
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