"""
Script to create test users with roles for MedField OS
"""
import os
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

import firebase_admin
from firebase_admin import credentials, auth, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Check if already initialized
        firebase_admin.get_app()
        print("[OK] Firebase already initialized")
    except ValueError:
        # Initialize with credentials from environment
        cred_dict = {
            "type": "service_account",
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            "token_uri": "https://oauth2.googleapis.com/token",
        }
        
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        print("[OK] Firebase Admin SDK initialized")

def create_test_users():
    """Create test users with roles"""
    
    test_users = [
        {
            'email': 'worker@test.com',
            'password': 'Test@123',
            'role': 'worker',
            'name': 'Priya Sharma',
            'phone': '+919876543210'
        },
        {
            'email': 'doctor@test.com',
            'password': 'Test@123',
            'role': 'doctor',
            'name': 'Dr. Rajesh Kumar',
            'phone': '+919876543211'
        },
        {
            'email': 'patient@test.com',
            'password': 'Test@123',
            'role': 'patient',
            'name': 'Ramesh Singh',
            'phone': '+919876543212'
        }
    ]
    
    db = firestore.client()
    
    for user_data in test_users:
        try:
            # Try to get existing user first
            try:
                existing_user = auth.get_user_by_email(user_data['email'])
                print(f"[WARN] User {user_data['email']} already exists (UID: {existing_user.uid})")
                
                # Update custom claims if needed
                auth.set_custom_user_claims(existing_user.uid, {'role': user_data['role']})
                print(f"   [OK] Updated role to: {user_data['role']}")
                
                # Update Firestore document
                db.collection('users').document(existing_user.uid).set({
                    'email': user_data['email'],
                    'name': user_data['name'],
                    'role': user_data['role'],
                    'phone': user_data['phone'],
                    'updatedAt': firestore.SERVER_TIMESTAMP
                }, merge=True)
                print(f"   [OK] Updated Firestore document")
                
            except auth.UserNotFoundError:
                # Create new user
                user = auth.create_user(
                    email=user_data['email'],
                    password=user_data['password'],
                    display_name=user_data['name'],
                    phone_number=user_data['phone']
                )
                
                # Set custom claims for role-based access
                auth.set_custom_user_claims(user.uid, {'role': user_data['role']})
                
                # Create user document in Firestore
                db.collection('users').document(user.uid).set({
                    'uid': user.uid,
                    'email': user_data['email'],
                    'name': user_data['name'],
                    'role': user_data['role'],
                    'phone': user_data['phone'],
                    'createdAt': firestore.SERVER_TIMESTAMP
                })
                
                print(f"[OK] Created {user_data['role']}: {user_data['email']} (UID: {user.uid})")
                print(f"  Password: {user_data['password']}")
                
        except Exception as e:
            print(f"[ERROR] Error with {user_data['email']}: {str(e)}")

def main():
    """Main function"""
    print("=" * 60)
    print("MedField OS - Test Users Setup")
    print("=" * 60)
    print()
    
    try:
        # Initialize Firebase
        initialize_firebase()
        print()
        
        # Create test users
        print("Creating test users...")
        print("-" * 60)
        create_test_users()
        print("-" * 60)
        print()
        
        print("[SUCCESS] Setup complete!")
        print()
        print("Test Users Created:")
        print("  Worker: worker@test.com / Test@123")
        print("  Doctor: doctor@test.com / Test@123")
        print("  Patient: patient@test.com / Test@123")
        print()
        
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
