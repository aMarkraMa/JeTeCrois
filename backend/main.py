"""
Backend API pour Are You Safe
Système de signalement visuel de harcèlement scolaire
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

from mapping import (
    map_location_id,
    map_emotion_id,
    map_safety_thermometer_id,
    map_frequency_index_id,
    map_body_part_id,
)


app = FastAPI(title="Are You Safe API", version="1.0.0")

# Configuration CORS pour permettre les requêtes depuis le frontend
import os
import re

# Get CORS origins from environment variable
CORS_ORIGINS_STR = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_STR.split(",") if origin.strip()]

# Check if we need to allow Vercel preview URLs
ALLOW_VERCEL_PREVIEW = any("vercel.app" in origin for origin in CORS_ORIGINS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app" if ALLOW_VERCEL_PREVIEW else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from supabase_client import supabase
from mapping import (
    map_location_id,
    map_emotion_id,
    map_safety_thermometer_id,
    map_frequency_index_id,
)


# Modèles de données
class SymbolSelection(BaseModel):
    """Sélection de symbole pour le signalement"""
    id: str
    label: str
    category: str  # "physical", "verbal", "social", "cyber"

class BodyMapSelection(BaseModel):
    """Sélection sur la carte corporelle"""
    x: float
    y: float
    bodyPart: str

class EmotionScale(BaseModel):
    """Échelle émotionnelle"""
    level: int  # 1-5
    color: str  # "green", "yellow", "orange", "red", "dark-red"

class Location(BaseModel):
    """Localisation dans l'école"""
    id: str
    name: str
    icon: str

class Frequency(BaseModel):
    """Fréquence du harcèlement"""
    value: str  # "once", "sometimes", "often", "always"

class SafetyThermometer(BaseModel):
    """Thermomètre de sécurité"""
    level: int  # 1-5
    feeling: str  # "very_safe", "safe", "neutral", "unsafe", "very_unsafe"

class Report(BaseModel):
    """Modèle complet d'un signalement"""
    id: Optional[str] = None
    studentId: str
    studentName: str
    timestamp: Optional[datetime] = None
    symbols: List[SymbolSelection]
    bodyMap: Optional[List[BodyMapSelection]] = None
    emotion: EmotionScale
    location: Location
    frequency: Frequency
    safety: SafetyThermometer
    status: str = "pending"  # "pending", "reviewed", "resolved"
    teacherNotes: Optional[str] = None

class ReportCreate(BaseModel):
    """Modèle pour créer un signalement"""
    studentId: str
    studentName: str
    symbols: List[SymbolSelection]
    bodyMap: Optional[List[BodyMapSelection]] = None
    emotion: EmotionScale
    location: Location
    frequency: Frequency
    safety: SafetyThermometer

# Base de données en mémoire (à remplacer par une vraie DB en production)
reports_db: List[Report] = []

# Données de référence pour les symboles
SYMBOLS_DATA = [
    {"id": "everything_fine", "label": "Everything is fine", "category": "general"},
    {"id": "push", "label": "Pousser", "category": "physical"},
    {"id": "hit", "label": "Frapper", "category": "physical"},
    {"id": "kick", "label": "Donner un coup de pied", "category": "physical"},
    {"id": "pull", "label": "Tirer", "category": "physical"},
    {"id": "insult", "label": "Insulter", "category": "verbal"},
    {"id": "mock", "label": "Se moquer", "category": "verbal"},
    {"id": "threat", "label": "Menacer", "category": "verbal"},
    {"id": "exclude", "label": "Exclure", "category": "social"},
    {"id": "ignore", "label": "Ignorer", "category": "social"},
    {"id": "rumor", "label": "Rumeurs", "category": "social"},
    {"id": "online", "label": "Harcèlement en ligne", "category": "cyber"},
    {"id": "photo", "label": "Photo partagée", "category": "cyber"},
]

LOCATIONS_DATA = [
    {"id": "classroom", "name": "Salle de classe", "icon": "🏫"},
    {"id": "playground", "name": "Cour de récréation", "icon": "🏃"},
    {"id": "cafeteria", "name": "Cantine", "icon": "🍽️"},
    {"id": "hallway", "name": "Couloir", "icon": "🚪"},
    {"id": "bathroom", "name": "Toilettes", "icon": "🚻"},
    {"id": "bus", "name": "Bus scolaire", "icon": "🚌"},
    {"id": "online", "name": "En ligne", "icon": "💻"},
]

# Endpoints API

@app.get("/")
def root():
    """Endpoint racine"""
    return {"message": "Are You Safe API", "version": "1.0.0"}

@app.get("/api/symbols")
def get_symbols():
    """Récupérer tous les symboles disponibles"""
    return SYMBOLS_DATA

@app.get("/api/locations")
def get_locations():
    """Récupérer tous les lieux disponibles"""
    return LOCATIONS_DATA

def ensure_user_exists_by_name(report: Report):
    """
    Checks if a user exists in the `users` table based ONLY on the name.
    If not found, create the user.
    """

    # Check if user exists by name
    user_resp = (
        supabase.from_("users")
        .select("*")
        .eq("front_student_id", report.studentId)
        .limit(1)
        .execute()
    )

    if user_resp.data:
        # User already exists -> stop here
        return user_resp.data[0]

    # Create new user
    new_user = {
        "front_student_id": report.studentId,
        "name": report.studentName
    }

    insert_resp = supabase.from_("users").insert(new_user).execute()

    if user_resp.error:
        print("Supabase error:", user_resp.error)

    if insert_resp.error:
        print("Supabase insert error:", insert_resp.error)

    return insert_resp.data


STUDENT_ROLE_TYPE_ID = "1"  # Identifier pour student

def ensure_student_role_id() -> int:
    """Ensure there is a 'student' row in user_role and return its id."""
    # Try to find the role
    resp = (
        supabase.from_("user_role")
        .select("user_role_id")
        .eq("user_role_type_id", STUDENT_ROLE_TYPE_ID)  
        .limit(1)
        .execute()
    )

    rows = resp.data or []
    if rows:
        return rows[0]["user_role_id"]

    # If not found, insert it
    insert_resp = (
        supabase.from_("user_role")
        .insert(
            {
                "user_role_type_id": STUDENT_ROLE_TYPE_ID,  
            }
        )
        .execute()
    )

    if getattr(insert_resp, "error", None):
        print("Supabase error in ensure_student_role_id:", insert_resp.error)
        raise RuntimeError("Failed to create user_role row for student")

    if not insert_resp.data:
        raise RuntimeError("No data returned when inserting user_role")

    return insert_resp.data[0]["user_role_id"]

def ensure_user_account(report: Report) -> int:
    """Get or create a user_acc row for this student and return user_acc_id."""
    # 👇 make sure the role exists and get its id
    student_role_id = ensure_student_role_id()

    # 1) Try to find existing user_acc
    resp = (
        supabase.from_("user_acc")
        .select("user_acc_id")
        .eq("user_role_id", student_role_id)
        .eq("person_affected", report.studentName)
        .limit(1)
        .execute()
    )

    rows = resp.data or []
    if rows:
        return rows[0]["user_acc_id"]

    # 2) If not found, insert user_acc
    insert_data = {
        "user_role_id": student_role_id,
        "person_affected": report.studentName,
    }

    insert_resp = supabase.from_("user_acc").insert(insert_data).execute()

    if getattr(insert_resp, "error", None):
        print("Supabase error in ensure_user_account:", insert_resp.error)
        raise RuntimeError("Failed to create user_acc entry")

    if not insert_resp.data:
        raise RuntimeError("No data returned when inserting user_acc")

    return insert_resp.data[0]["user_acc_id"]


def create_user_acc_history(report: Report) -> None:
    """Insert one row in user_acc_history per body part in bodyMap.

    If bodyMap is empty/None, we still insert a single generic row.
    """
    user_acc_id = ensure_user_account(report)
    event_time = report.timestamp or datetime.utcnow()

    # Shared info across all rows for this report
    base_description = ", ".join([s.label for s in report.symbols])
    base_data = {
        "event_time": event_time.isoformat(),
        "event_location_id": map_location_id(report.location.id),
        "emotion_id": map_emotion_id(report.emotion.level),
        "user_acc_id": user_acc_id,
       # "safety_thermometer_id": map_safety_thermometer_id(
       #     report.safety.feeling, report.safety.level
       # ),
        "frequency_index_id": map_frequency_index_id(report.frequency.value),
    }

    # Case 1: there *are* body parts selected -> one row per bodyMap entry
    if report.bodyMap:
        rows_to_insert = []
        for bm in report.bodyMap:
            body_part_id = map_body_part_id(bm.bodyPart)
            event_description = f"{base_description} - {bm.bodyPart}"

            row = {
                **base_data,
                "event_description": event_description,
            }

            # Only include body_part_id if that column exists in your table
            # If you don't have this column yet, remove this line:
            row["body_part_id"] = body_part_id

            rows_to_insert.append(row)

        supabase.from_("user_acc_history").insert(rows_to_insert).execute()
        return

    # Case 2: no bodyMap -> single generic row (like before)
    history_row = {
        **base_data,
        "event_description": base_description,
        # "body_part_id": None  
    }

    supabase.from_("user_acc_history").insert(history_row).execute()
    
@app.post("/api/reports", response_model=Report)
def create_report(report_data: ReportCreate):
    """Créer un nouveau signalement"""
    new_report = Report(
        id=str(uuid.uuid4()),
        studentId=report_data.studentId,
        studentName=report_data.studentName,
        timestamp=datetime.now(),
        symbols=report_data.symbols,
        bodyMap=report_data.bodyMap,
        emotion=report_data.emotion,
        location=report_data.location,
        frequency=report_data.frequency,
        safety=report_data.safety,
        status="pending"
    )
    reports_db.append(new_report)
    ensure_user_exists_by_name(new_report)
    create_user_acc_history(new_report)
    return new_report
    
    
@app.post("/api/from-latest-report")  # FK
def create_user_from_latest_report():
    """Insert studentId + studentName from the latest report"""

    #Check latest report from memory endpoint
    if not reports_db:
        raise HTTPException(status_code=404, detail="Aucun signalement trouvé")

    latest_report = max(reports_db, key=lambda x: x.timestamp or datetime.min)

    #Prepare payload for the 'users' table
    user_payload = {
        "front_student_id": latest_report.studentId,
        "name": latest_report.studentName
    }


    #Insert / upsert in Supabase
    resp = supabase.from_("users").upsert(
        user_payload,
        on_conflict="front_student_id"
    ).execute()

    if getattr(resp, "error", None):
        print("Supabase error:", resp.error)
        raise HTTPException(status_code=500, detail="Erreur lors de l'insertion utilisateur")

    # Return confirmation
    return {
        "message": "Utilisateur inséré depuis le dernier signalement",
        "latest_report_id": latest_report.id,
        "user": resp.data[0]
    }

@app.get("/api/reports", response_model=List[Report])
def get_reports():
    """Récupérer tous les signalements (pour les enseignants)"""
    return sorted(reports_db, key=lambda x: x.timestamp or datetime.min, reverse=True)

@app.get("/api/reports/{report_id}", response_model=Report)
def get_report(report_id: str):
    """Récupérer un signalement spécifique"""
    report = next((r for r in reports_db if r.id == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Signalement non trouvé")
    return report

@app.put("/api/reports/{report_id}", response_model=Report)
def update_report(report_id: str, status: Optional[str] = None, teacherNotes: Optional[str] = None):
    """Mettre à jour un signalement (changer le statut, ajouter des notes)"""
    report = next((r for r in reports_db if r.id == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Signalement non trouvé")
    
    if status:
        report.status = status
    if teacherNotes is not None:
        report.teacherNotes = teacherNotes
    
    return report

@app.get("/api/reports/student/{student_id}", response_model=List[Report])
def get_student_reports(student_id: str):
    """Récupérer les signalements d'un étudiant spécifique"""
    return [r for r in reports_db if r.studentId == student_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

