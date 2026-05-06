"""
Quick test script to verify Firebase Admin SDK connection
"""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_firebase_connection():
    """Test Firebase Admin SDK connection"""
    print("Testing Firebase Admin SDK Connection...")
    print("-" * 60)
    
    try:
        # Initialize Firebase
        cred_dict = {
            "type": "service_account",
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            "token_uri": "https://oauth2.googleapis.com/token",
        }
        
        print(f"Project ID: {cred_dict['project_id']}")
        print(f"Client Email: {cred_dict['client_email']}")
        print()
        
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        print("[OK] Firebase Admin SDK initialized successfully")
        
        # Test Firestore connection
        db = firestore.client()
        print("[OK] Firestore client created successfully")
        
        # Try to write a test document
        test_ref = db.collection('_test').document('connection_test')
        test_ref.set({
            'test': True,
            'message': 'Firebase Admin SDK is working!',
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        print("[OK] Successfully wrote test document to Firestore")
        
        # Read it back
        doc = test_ref.get()
        if doc.exists:
            print(f"[OK] Successfully read test document from Firestore")
            print(f"  Data: {doc.to_dict()}")
        
        # Delete test document
        test_ref.delete()
        print("[OK] Cleaned up test document")
        
        print()
        print("=" * 60)
        print("[SUCCESS] All tests passed! Firebase Admin SDK is working!")
        print("=" * 60)
        
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    test_firebase_connection()
