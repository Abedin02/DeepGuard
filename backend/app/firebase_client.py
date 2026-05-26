"""
Firebase / Firestore client + Firebase Auth token verifier.

Set FIREBASE_SERVICE_ACCOUNT_INLINE or FIREBASE_SERVICE_ACCOUNT_JSON to the raw
service-account JSON string, set individual FIREBASE_* service-account fields,
or use Application Default Credentials on Cloud Run.
"""

import os
import json
from dotenv import load_dotenv
load_dotenv(override=True)

import firebase_admin
from firebase_admin import credentials, firestore, auth as firebase_auth
from fastapi import HTTPException, Header
from typing import Optional


def _service_account_from_env() -> Optional[dict]:
    """Build a Firebase service-account dict from .env variables when present."""
    project_id = os.environ.get("FIREBASE_PROJECT_ID")
    private_key = os.environ.get("FIREBASE_PRIVATE_KEY")
    client_email = os.environ.get("FIREBASE_CLIENT_EMAIL")

    if not project_id or not private_key or not client_email:
        return None

    return {
        "type": os.environ.get("FIREBASE_TYPE", "service_account"),
        "project_id": project_id,
        "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": private_key.replace("\\n", "\n"),
        "client_email": client_email,
        "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
        "auth_uri": os.environ.get("FIREBASE_AUTH_URI", "https://accounts.google.com/o/oauth2/auth"),
        "token_uri": os.environ.get("FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token"),
        "auth_provider_x509_cert_url": os.environ.get(
            "FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
            "https://www.googleapis.com/oauth2/v1/certs",
        ),
        "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_X509_CERT_URL"),
        "universe_domain": os.environ.get("FIREBASE_UNIVERSE_DOMAIN", "googleapis.com"),
    }


def _json_from_env(value: str) -> dict:
    service_account_info = json.loads(value)
    if "private_key" in service_account_info:
        service_account_info["private_key"] = service_account_info["private_key"].replace("\\n", "\n")
    return service_account_info

# ──────────────────────────────────────────────
# Initialise Firebase Admin SDK (once)
# ──────────────────────────────────────────────
def _init_firebase() -> None:
    if firebase_admin._apps:
        return  # already initialised

    # Prefer inline JSON (env var contains the JSON string directly)
    inline = os.environ.get("FIREBASE_SERVICE_ACCOUNT_INLINE")
    path   = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
    project_id = os.environ.get("FIREBASE_PROJECT_ID") or os.environ.get("GOOGLE_CLOUD_PROJECT")

    if inline:
        service_account_info = _json_from_env(inline)
        cred = credentials.Certificate(service_account_info)
        project_id = project_id or service_account_info.get("project_id")
    elif path and path.strip().startswith("{"):
        service_account_info = _json_from_env(path)
        cred = credentials.Certificate(service_account_info)
        project_id = project_id or service_account_info.get("project_id")
    elif service_account_info := _service_account_from_env():
        cred = credentials.Certificate(service_account_info)
        project_id = project_id or service_account_info.get("project_id")
    elif path:
        if not os.path.exists(path):
            raise RuntimeError(
                f"Firebase service-account file not found: {path}. "
                "Set FIREBASE_SERVICE_ACCOUNT_INLINE to the JSON from your .env, "
                "or set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL."
            )
        cred = credentials.Certificate(path)
        with open(path, "r", encoding="utf-8") as service_account_file:
            project_id = project_id or json.load(service_account_file).get("project_id")
    else:
        cred = credentials.ApplicationDefault()

    options = {"projectId": project_id} if project_id else None
    firebase_admin.initialize_app(cred, options)


_init_firebase()

# Firestore database handle — used across the app
db: firestore.Client = firestore.client(
    database_id=os.environ.get("FIRESTORE_DATABASE_ID", "deepguard")
)


# ──────────────────────────────────────────────
# Auth dependency  — verifies Firebase ID tokens
# ──────────────────────────────────────────────
async def verify_token(authorization: Optional[str] = Header(None)) -> dict:
    """
    FastAPI dependency.  Expects:  Authorization: Bearer <firebase_id_token>

    Returns the decoded token dict (contains uid, email, etc.).
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or malformed Authorization header.")

    id_token = authorization.split("Bearer ", 1)[1].strip()

    try:
        decoded = firebase_auth.verify_id_token(id_token)
        return decoded
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expired. Please sign in again.")
    except firebase_auth.InvalidIdTokenError as exc:
        raise HTTPException(status_code=401, detail=f"Invalid token: {exc}")
    except Exception as exc:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {exc}")
