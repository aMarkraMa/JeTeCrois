# backend/mapping.py

LOCATION_ID_MAP = {
    "playground": 1,  # PLA
    "classroom": 2,   # CLR
    "library": 3,     # LIB
    "gymnasium": 4,   # GYM
    "gym": 4,
    "cafeteria": 5,   # CAF
    "canteen": 5,
    "bus": 6,         # BUS
}

FREQUENCY_VALUE_TO_ID = {
    "once": 1,        # ONC
    "sometimes": 2,   # TWI
    "often": 3,       # MUL
    "always": 3,      # MUL (multiple)
}

SAFETY_FEELING_TO_ID = {
    "very_safe": 1,
    "safe": 2,
    "neutral": 3,
    "unsafe": 4,
    "very_unsafe": 5,
}

BODY_PART_ID_MAP = {
    "head": 1,      
    "face": 2,
    "chest": 18,     
    "arm": 27,
    "hand": 30,
    "abdomen": 40,
    "back": 41,
    "legs": 48,
    "feet": 52,
}

def map_location_id(location_id: str) -> int:
    return LOCATION_ID_MAP.get(location_id, 99)  # 0 = unknown

def map_emotion_id(level: int) -> int:
    return level  # assuming 1–5 matches your emotion table

def map_safety_thermometer_id(feeling: str, level: int) -> int:
    return SAFETY_FEELING_TO_ID.get(feeling, level)

def map_frequency_index_id(value: str) -> int:
    return FREQUENCY_VALUE_TO_ID.get(value, 3)

def map_body_part_id(body_part: str) -> int:
    # bodyPart from frontend is a lowercase string like "chest", "legs", etc.
    return BODY_PART_ID_MAP.get(body_part.lower(), 99)  # 99 = unknown
