from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from pathlib import Path
from passlib.context import CryptContext
from dotenv import load_dotenv
import uuid, os, jwt, base64, logging

# Load environment
ROOT_DIR = Path(__file__).resolve().parent
load_dotenv(ROOT_DIR / ".env")

# Database
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Auth
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-this-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# App setup
app = FastAPI(title="neokatalyst API", description="Digital Transformation Platform API")
api_router = APIRouter(prefix="/api")

# CORS config
origins = [
    "https://neokatalyst-platform-production.up.railway.app",
    "https://neokatalyst-platform2.vercel.app",
    "http://localhost",
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class UserRole(BaseModel):
    admin: bool = False
    client: bool = True
    user: bool = True

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    company: Optional[str] = None
    phone: Optional[str] = None
    role: UserRole = Field(default_factory=UserRole)
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    company: Optional[str]
    phone: Optional[str]
    role: UserRole
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime]

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None

# Auth helpers
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return User(**user)

# Auth routes
@api_router.post("/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        company=user_data.company,
        phone=user_data.phone
    )
    user_dict = user.dict()
    user_dict["password"] = hashed
    await db.users.insert_one(user_dict)
    access_token = create_access_token({"sub": user.id})
    await db.users.update_one({"id": user.id}, {"$set": {"last_login": datetime.utcnow()}})
    return Token(access_token=access_token, token_type="bearer", user=UserResponse(**user.dict()))

@api_router.post("/auth/login", response_model=Token)
async def login_user(login_data: UserLogin):
    user_doc = await db.users.find_one({"email": login_data.email})
    if not user_doc or not verify_password(login_data.password, user_doc["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user_doc.get("is_active", True):
        raise HTTPException(status_code=401, detail="Account is deactivated")
    access_token = create_access_token({"sub": user_doc["id"]})
    await db.users.update_one({"id": user_doc["id"]}, {"$set": {"last_login": datetime.utcnow()}})
    return Token(access_token=access_token, token_type="bearer", user=UserResponse(**User(**user_doc).dict()))

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.dict())

@api_router.put("/auth/me", response_model=UserResponse)
async def update_current_user(user_update: UserUpdate, current_user: User = Depends(get_current_user)):
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    if update_data:
        await db.users.update_one({"id": current_user.id}, {"$set": update_data})
        updated_user = await db.users.find_one({"id": current_user.id})
        return UserResponse(**User(**updated_user).dict())
    return UserResponse(**current_user.dict())

@api_router.post("/auth/logout")
async def logout_user():
    return {"message": "Successfully logged out"}

# Health check
@api_router.get("/")
async def root():
    return {"message": "API is up and running"}

# Router registration
app.include_router(api_router)

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
