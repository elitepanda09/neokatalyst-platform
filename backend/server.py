from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import bcrypt
import jwt
from passlib.context import CryptContext
import base64
from enum import Enum
import json

import os
print("Loaded MongoDB URI:", os.environ.get("MONGO_URL", "[MONGO_URL not found]"))


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-this-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI(title="neokatalyst API", description="Digital Transformation Platform API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ ENUMS ============

class WorkflowStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"

class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"

class ProductStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"

class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class MessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    FILE = "file"

# ============ EXISTING MODELS ============

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# User Models
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
    company: Optional[str] = None
    phone: Optional[str] = None
    role: UserRole
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None

# ============ PHASE 3: BUSINESS PROCESS AUTOMATION MODELS ============

class WorkflowStep(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    assignee_id: Optional[str] = None
    required_approvals: int = 1
    order: int

class Workflow(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    steps: List[WorkflowStep]
    status: WorkflowStatus = WorkflowStatus.DRAFT
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = None
    steps: List[WorkflowStep]

class Task(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    workflow_id: str
    step_id: str
    title: str
    description: Optional[str] = None
    assignee_id: str
    status: TaskStatus = TaskStatus.PENDING
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TaskCreate(BaseModel):
    workflow_id: str
    step_id: str
    title: str
    description: Optional[str] = None
    assignee_id: str
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    status: Optional[TaskStatus] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None

# ============ PHASE 4: ANALYTICS MODELS ============

class AnalyticsMetric(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    value: float
    unit: str
    category: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None

class AnalyticsMetricCreate(BaseModel):
    name: str
    value: float
    unit: str
    category: str
    metadata: Optional[Dict[str, Any]] = None

class DashboardWidget(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    type: str  # chart, metric, table, etc.
    config: Dict[str, Any]
    position: Dict[str, int]  # x, y, width, height
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DashboardWidgetCreate(BaseModel):
    title: str
    type: str
    config: Dict[str, Any]
    position: Dict[str, int]

# ============ PHASE 5: DOCUMENT MANAGEMENT MODELS ============

class Document(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    original_filename: str
    content_type: str
    size: int
    file_data: str  # base64 encoded
    uploaded_by: str
    folder_id: Optional[str] = None
    tags: List[str] = []
    version: int = 1
    is_latest: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentCreate(BaseModel):
    filename: str
    content_type: str
    file_data: str  # base64 encoded
    folder_id: Optional[str] = None
    tags: List[str] = []

class DocumentFolder(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    parent_id: Optional[str] = None
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentFolderCreate(BaseModel):
    name: str
    parent_id: Optional[str] = None

# ============ PHASE 6: E-COMMERCE MODELS ============

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None
    image_data: Optional[str] = None  # base64 encoded
    stock_quantity: int = 0
    status: ProductStatus = ProductStatus.DRAFT
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_data: Optional[str] = None
    stock_quantity: int = 0

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_data: Optional[str] = None
    stock_quantity: Optional[int] = None
    status: Optional[ProductStatus] = None

class CartItem(BaseModel):
    product_id: str
    quantity: int
    price: float

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    items: List[CartItem]
    total_amount: float
    status: OrderStatus = OrderStatus.PENDING
    shipping_address: Dict[str, str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    items: List[CartItem]
    shipping_address: Dict[str, str]

# ============ PHASE 7: COMMUNICATION MODELS ============

class ChatRoom(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    participants: List[str]  # user IDs
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChatRoomCreate(BaseModel):
    name: str
    description: Optional[str] = None
    participants: List[str]

class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    room_id: str
    sender_id: str
    content: str
    message_type: MessageType = MessageType.TEXT
    file_data: Optional[str] = None  # base64 for file messages
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MessageCreate(BaseModel):
    room_id: str
    content: str
    message_type: MessageType = MessageType.TEXT
    file_data: Optional[str] = None

# ============ UTILITY FUNCTIONS ============

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return User(**user)

# ============ EXISTING ENDPOINTS ============

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# ============ AUTHENTICATION ENDPOINTS ============

@api_router.post("/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        company=user_data.company,
        phone=user_data.phone
    )
    
    # Store user in database
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    # Update last login
    await db.users.update_one(
        {"id": user.id},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    user_response = UserResponse(**user.dict())
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@api_router.post("/auth/login", response_model=Token)
async def login_user(login_data: UserLogin):
    """Login a user"""
    # Find user
    user_doc = await db.users.find_one({"email": login_data.email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user_doc["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user_doc.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user_doc["id"]})
    
    # Update last login
    await db.users.update_one(
        {"id": user_doc["id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    user = User(**user_doc)
    user_response = UserResponse(**user.dict())
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(**current_user.dict())

@api_router.put("/auth/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update current user information"""
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    if update_data:
        await db.users.update_one(
            {"id": current_user.id},
            {"$set": update_data}
        )
        
        # Get updated user
        updated_user = await db.users.find_one({"id": current_user.id})
        return UserResponse(**User(**updated_user).dict())
    
    return UserResponse(**current_user.dict())

@api_router.post("/auth/logout")
async def logout_user():
    """Logout user (client should remove token)"""
    return {"message": "Successfully logged out"}

# ============ PHASE 3: BUSINESS PROCESS AUTOMATION ENDPOINTS ============

@api_router.post("/workflows", response_model=Workflow)
async def create_workflow(
    workflow_data: WorkflowCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new workflow"""
    workflow = Workflow(
        **workflow_data.dict(),
        created_by=current_user.id
    )
    
    await db.workflows.insert_one(workflow.dict())
    return workflow

@api_router.get("/workflows", response_model=List[Workflow])
async def get_workflows(current_user: User = Depends(get_current_user)):
    """Get all workflows for the current user"""
    workflows = await db.workflows.find().to_list(1000)
    return [Workflow(**workflow) for workflow in workflows]

@api_router.get("/workflows/{workflow_id}", response_model=Workflow)
async def get_workflow(
    workflow_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific workflow"""
    workflow = await db.workflows.find_one({"id": workflow_id})
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return Workflow(**workflow)

@api_router.post("/tasks", response_model=Task)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new task"""
    task = Task(**task_data.dict())
    await db.tasks.insert_one(task.dict())
    return task

@api_router.get("/tasks", response_model=List[Task])
async def get_tasks(current_user: User = Depends(get_current_user)):
    """Get all tasks for the current user"""
    tasks = await db.tasks.find({"assignee_id": current_user.id}).to_list(1000)
    return [Task(**task) for task in tasks]

@api_router.put("/tasks/{task_id}", response_model=Task)
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a task"""
    update_data = {k: v for k, v in task_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    if task_update.status == TaskStatus.COMPLETED:
        update_data["completed_at"] = datetime.utcnow()
    
    await db.tasks.update_one(
        {"id": task_id},
        {"$set": update_data}
    )
    
    updated_task = await db.tasks.find_one({"id": task_id})
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return Task(**updated_task)

# ============ PHASE 4: ANALYTICS ENDPOINTS ============

@api_router.post("/analytics/metrics", response_model=AnalyticsMetric)
async def create_metric(
    metric_data: AnalyticsMetricCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new analytics metric"""
    metric = AnalyticsMetric(**metric_data.dict())
    await db.analytics_metrics.insert_one(metric.dict())
    return metric

@api_router.get("/analytics/metrics", response_model=List[AnalyticsMetric])
async def get_metrics(
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Get analytics metrics"""
    query = {}
    if category:
        query["category"] = category
    
    metrics = await db.analytics_metrics.find(query).sort("timestamp", -1).to_list(1000)
    return [AnalyticsMetric(**metric) for metric in metrics]

@api_router.get("/analytics/dashboard")
async def get_dashboard_analytics(current_user: User = Depends(get_current_user)):
    """Get comprehensive dashboard analytics"""
    # Calculate various metrics
    total_workflows = await db.workflows.count_documents({})
    total_tasks = await db.tasks.count_documents({})
    completed_tasks = await db.tasks.count_documents({"status": TaskStatus.COMPLETED})
    total_documents = await db.documents.count_documents({})
    total_products = await db.products.count_documents({})
    total_orders = await db.orders.count_documents({})
    
    return {
        "overview": {
            "total_workflows": total_workflows,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "completion_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
            "total_documents": total_documents,
            "total_products": total_products,
            "total_orders": total_orders
        },
        "recent_activity": [
            {"action": "New workflow created", "timestamp": datetime.utcnow()},
            {"action": "Task completed", "timestamp": datetime.utcnow()},
            {"action": "Document uploaded", "timestamp": datetime.utcnow()}
        ]
    }

@api_router.post("/analytics/widgets", response_model=DashboardWidget)
async def create_dashboard_widget(
    widget_data: DashboardWidgetCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a dashboard widget"""
    widget = DashboardWidget(
        **widget_data.dict(),
        user_id=current_user.id
    )
    await db.dashboard_widgets.insert_one(widget.dict())
    return widget

@api_router.get("/analytics/widgets", response_model=List[DashboardWidget])
async def get_dashboard_widgets(current_user: User = Depends(get_current_user)):
    """Get user's dashboard widgets"""
    widgets = await db.dashboard_widgets.find({"user_id": current_user.id}).to_list(100)
    return [DashboardWidget(**widget) for widget in widgets]

# ============ PHASE 5: DOCUMENT MANAGEMENT ENDPOINTS ============

@api_router.post("/documents", response_model=Document)
async def upload_document(
    document_data: DocumentCreate,
    current_user: User = Depends(get_current_user)
):
    """Upload a new document"""
    # Calculate file size from base64
    file_size = len(base64.b64decode(document_data.file_data))
    
    document = Document(
        **document_data.dict(),
        original_filename=document_data.filename,
        size=file_size,
        uploaded_by=current_user.id
    )
    
    await db.documents.insert_one(document.dict())
    return document

@api_router.get("/documents", response_model=List[Document])
async def get_documents(
    folder_id: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Get documents"""
    query = {"is_latest": True}
    if folder_id:
        query["folder_id"] = folder_id
    
    documents = await db.documents.find(query).sort("created_at", -1).to_list(1000)
    return [Document(**doc) for doc in documents]

@api_router.get("/documents/{document_id}", response_model=Document)
async def get_document(
    document_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific document"""
    document = await db.documents.find_one({"id": document_id})
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return Document(**document)

@api_router.post("/documents/folders", response_model=DocumentFolder)
async def create_folder(
    folder_data: DocumentFolderCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new folder"""
    folder = DocumentFolder(
        **folder_data.dict(),
        created_by=current_user.id
    )
    await db.document_folders.insert_one(folder.dict())
    return folder

@api_router.get("/documents/folders", response_model=List[DocumentFolder])
async def get_folders(current_user: User = Depends(get_current_user)):
    """Get all folders"""
    folders = await db.document_folders.find().to_list(1000)
    return [DocumentFolder(**folder) for folder in folders]

# ============ PHASE 6: E-COMMERCE ENDPOINTS ============

@api_router.post("/products", response_model=Product)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new product"""
    product = Product(
        **product_data.dict(),
        created_by=current_user.id
    )
    await db.products.insert_one(product.dict())
    return product

@api_router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    status: Optional[ProductStatus] = None,
    current_user: User = Depends(get_current_user)
):
    """Get products"""
    query = {}
    if category:
        query["category"] = category
    if status:
        query["status"] = status
    
    products = await db.products.find(query).sort("created_at", -1).to_list(1000)
    return [Product(**product) for product in products]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(
    product_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific product"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a product"""
    update_data = {k: v for k, v in product_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.products.update_one(
        {"id": product_id},
        {"$set": update_data}
    )
    
    updated_product = await db.products.find_one({"id": product_id})
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return Product(**updated_product)

@api_router.post("/orders", response_model=Order)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new order"""
    # Calculate total amount
    total_amount = sum(item.price * item.quantity for item in order_data.items)
    
    order = Order(
        **order_data.dict(),
        customer_id=current_user.id,
        total_amount=total_amount
    )
    
    await db.orders.insert_one(order.dict())
    return order

@api_router.get("/orders", response_model=List[Order])
async def get_orders(current_user: User = Depends(get_current_user)):
    """Get user's orders"""
    orders = await db.orders.find({"customer_id": current_user.id}).sort("created_at", -1).to_list(1000)
    return [Order(**order) for order in orders]

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific order"""
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**order)

# ============ PHASE 7: COMMUNICATION ENDPOINTS ============

@api_router.post("/chat/rooms", response_model=ChatRoom)
async def create_chat_room(
    room_data: ChatRoomCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new chat room"""
    # Add current user to participants if not already included
    participants = room_data.participants
    if current_user.id not in participants:
        participants.append(current_user.id)
    
    room = ChatRoom(
        **room_data.dict(),
        participants=participants,
        created_by=current_user.id
    )
    
    await db.chat_rooms.insert_one(room.dict())
    return room

@api_router.get("/chat/rooms", response_model=List[ChatRoom])
async def get_chat_rooms(current_user: User = Depends(get_current_user)):
    """Get user's chat rooms"""
    rooms = await db.chat_rooms.find({"participants": current_user.id}).to_list(1000)
    return [ChatRoom(**room) for room in rooms]

@api_router.post("/chat/messages", response_model=Message)
async def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user)
):
    """Send a message to a chat room"""
    # Verify user is in the room
    room = await db.chat_rooms.find_one({"id": message_data.room_id})
    if not room or current_user.id not in room["participants"]:
        raise HTTPException(status_code=403, detail="Not authorized to send messages to this room")
    
    message = Message(
        **message_data.dict(),
        sender_id=current_user.id
    )
    
    await db.messages.insert_one(message.dict())
    return message

@api_router.get("/chat/rooms/{room_id}/messages", response_model=List[Message])
async def get_room_messages(
    room_id: str,
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    """Get messages from a chat room"""
    # Verify user is in the room
    room = await db.chat_rooms.find_one({"id": room_id})
    if not room or current_user.id not in room["participants"]:
        raise HTTPException(status_code=403, detail="Not authorized to view messages in this room")
    
    messages = await db.messages.find({"room_id": room_id}).sort("timestamp", -1).limit(limit).to_list(limit)
    return [Message(**message) for message in reversed(messages)]

# ============ PROTECTED ENDPOINTS ============

@api_router.get("/protected/dashboard")
async def get_dashboard_data(current_user: User = Depends(get_current_user)):
    """Get dashboard data for authenticated user"""
    return {
        "message": f"Welcome to your dashboard, {current_user.full_name}!",
        "user_id": current_user.id,
        "stats": {
            "active_processes": 24,
            "documents_processed": 1247,
            "revenue_generated": 87432,
            "team_members": 156
        }
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://neokatalyst-platform1.vercel.app",
        "http://localhost:3000",  # For local development
        "http://127.0.0.1:3000",  # For local development
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
