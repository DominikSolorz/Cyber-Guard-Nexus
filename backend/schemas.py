"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ========================================
# AUTH SCHEMAS
# ========================================

class UserRegister(BaseModel):
    """User registration request"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    """User login request"""
    username: str
    password: str


class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    """User response"""
    id: int
    email: str
    username: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ========================================
# FILE SCHEMAS
# ========================================

class FileResponse(BaseModel):
    """File response"""
    id: int
    filename: str
    original_filename: str
    file_size: int
    mime_type: str
    upload_date: datetime
    folder_id: Optional[int]
    
    class Config:
        from_attributes = True


# ========================================
# FOLDER SCHEMAS
# ========================================

class FolderCreate(BaseModel):
    """Folder creation request"""
    name: str = Field(..., min_length=1, max_length=255)
    parent_id: Optional[int] = None
    color: Optional[str] = "#1976d2"
    icon: Optional[str] = "folder"


class FolderResponse(BaseModel):
    """Folder response"""
    id: int
    name: str
    parent_id: Optional[int]
    color: str
    icon: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ========================================
# AI CHAT SCHEMAS
# ========================================

class ChatCreate(BaseModel):
    """Create new chat"""
    file_ids: Optional[list[int]] = []


class MessageCreate(BaseModel):
    """Send message in chat"""
    message: str


class MessageResponse(BaseModel):
    """Chat message response"""
    id: int
    role: str
    content: str
    timestamp: datetime
    
    class Config:
        from_attributes = True


class ChatResponse(BaseModel):
    """Chat response"""
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ========================================
# EMAIL SCHEMAS
# ========================================

class EmailSend(BaseModel):
    """Send email request"""
    to: str
    subject: str
    body: str
    file_ids: Optional[list[int]] = []


class EmailResponse(BaseModel):
    """Email response"""
    id: int
    subject: str
    sender: str
    recipient: str
    status: str
    sent_at: Optional[datetime]
    
    class Config:
        from_attributes = True
