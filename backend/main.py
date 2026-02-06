"""
Main FastAPI application - API endpoints
"""
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File as FastAPIFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta
import os

from database import get_db, Base, engine
from models import User, Folder, File, AIChat, AIMessage, Email
from schemas import (
    UserRegister, UserLogin, Token, UserResponse,
    FileResponse, FolderCreate, FolderResponse,
    ChatCreate, MessageCreate, MessageResponse, ChatResponse,
    EmailSend, EmailResponse
)
from auth import (
    get_password_hash, verify_password, create_access_token, 
    get_current_user
)
from services.ai_service import chat_with_ai, generate_chat_title
from services.email_service import email_service
from services.file_service import file_service
from config import get_settings

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize app
app = FastAPI(
    title="Document Manager AI",
    description="Advanced document management system with AI capabilities",
    version="1.0.0"
)

settings = get_settings()

# CORS middleware - permissive for development (Codespaces + localhost)
# In production, restrict to specific domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        # Codespaces URLs - regex pattern isn't working well with credentials
        # So we use a wildcard for dev. In production, use specific domains.
    ],
    allow_origin_regex=r"https://.*\.app\.github\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# ========================================
# AUTHENTICATION ENDPOINTS
# ========================================

@app.post("/api/auth/register")
async def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    """Register new user"""
    # Check if user exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user
    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {"message": "User created successfully", "user_id": user.id}


@app.post("/api/auth/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get JWT token"""
    # Find user by username or email
    user = db.query(User).filter(
        (User.username == form_data.username) | (User.email == form_data.username)
    ).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name
        }
    }


@app.get("/api/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "avatar_url": current_user.avatar_url
    }


# ========================================
# FILE MANAGEMENT ENDPOINTS
# ========================================

@app.post("/api/files/upload")
async def upload_file(
    file: UploadFile = FastAPIFile(...),
    folder_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload file"""
    # Save file to disk
    file_data = await file_service.save_file(file, current_user.id)
    
    # Create database record
    db_file = File(
        filename=file_data["filename"],
        original_filename=file_data["original_filename"],
        file_path=file_data["file_path"],
        file_size=file_data["file_size"],
        mime_type=file_data["mime_type"],
        owner_id=current_user.id,
        folder_id=folder_id
    )
    
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    
    return {"message": "File uploaded", "file_id": db_file.id}


@app.get("/api/files")
async def get_files(
    folder_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's files"""
    query = db.query(File).filter(File.owner_id == current_user.id)
    
    if folder_id is not None:
        query = query.filter(File.folder_id == folder_id)
    
    files = query.all()
    
    return [{
        "id": f.id,
        "filename": f.original_filename,
        "size": f.file_size,
        "mime_type": f.mime_type,
        "created_at": f.created_at,
        "is_favorite": f.is_favorite
    } for f in files]


@app.get("/api/files/{file_id}/download")
async def download_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download file"""
    file = db.query(File).filter(
        File.id == file_id,
        File.owner_id == current_user.id
    ).first()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    if not os.path.exists(file.file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    return FileResponse(
        path=file.file_path,
        filename=file.original_filename,
        media_type=file.mime_type
    )


@app.delete("/api/files/{file_id}")
async def delete_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete file"""
    file = db.query(File).filter(
        File.id == file_id,
        File.owner_id == current_user.id
    ).first()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Delete from disk
    file_service.delete_file(file.file_path)
    
    # Delete from database
    db.delete(file)
    db.commit()
    
    return {"message": "File deleted"}


# ========================================
# FOLDER MANAGEMENT ENDPOINTS
# ========================================

@app.post("/api/folders")
async def create_folder(
    name: str,
    parent_id: Optional[int] = None,
    color: str = "#1976d2",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create folder"""
    folder = Folder(
        name=name,
        parent_id=parent_id,
        owner_id=current_user.id,
        color=color
    )
    
    db.add(folder)
    db.commit()
    db.refresh(folder)
    
    return {"message": "Folder created", "folder_id": folder.id}


@app.get("/api/folders")
async def get_folders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's folders"""
    folders = db.query(Folder).filter(Folder.owner_id == current_user.id).all()
    
    return [{
        "id": f.id,
        "name": f.name,
        "parent_id": f.parent_id,
        "color": f.color,
        "created_at": f.created_at
    } for f in folders]


# ========================================
# AI CHAT ENDPOINTS
# ========================================

@app.post("/api/ai/chat")
async def create_chat(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new AI chat"""
    chat = AIChat(
        user_id=current_user.id,
        title="New Chat"
    )
    
    db.add(chat)
    db.commit()
    db.refresh(chat)
    
    return {"chat_id": chat.id}


@app.post("/api/ai/chat/{chat_id}/message")
async def send_message(
    chat_id: int,
    message: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send message to AI"""
    # Get chat
    chat = db.query(AIChat).filter(
        AIChat.id == chat_id,
        AIChat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    # Save user message
    user_msg = AIMessage(chat_id=chat_id, role="user", content=message)
    db.add(user_msg)
    db.commit()
    
    # Generate title if first message
    if len(chat.messages) == 1:
        chat.title = await generate_chat_title(message)
        db.commit()
    
    # Get all messages for context
    messages = [
        {"role": msg.role, "content": msg.content}
        for msg in chat.messages
    ]
    
    # Get AI response
    ai_response = await chat_with_ai(messages)
    
    # Save AI response
    ai_msg = AIMessage(chat_id=chat_id, role="assistant", content=ai_response)
    db.add(ai_msg)
    db.commit()
    
    return {"response": ai_response}


@app.get("/api/ai/chats")
async def get_chats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's AI chats"""
    chats = db.query(AIChat).filter(AIChat.user_id == current_user.id).all()
    
    return [{
        "id": c.id,
        "title": c.title,
        "created_at": c.created_at,
        "message_count": len(c.messages)
    } for c in chats]


@app.get("/api/ai/chat/{chat_id}/messages")
async def get_messages(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get chat messages"""
    chat = db.query(AIChat).filter(
        AIChat.id == chat_id,
        AIChat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    return [{
        "id": msg.id,
        "role": msg.role,
        "content": msg.content,
        "created_at": msg.created_at
    } for msg in chat.messages]


# ========================================
# EMAIL ENDPOINTS
# ========================================

@app.post("/api/email/send")
async def send_email(
    to_emails: List[str],
    subject: str,
    body_text: str,
    body_html: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send email via Gmail"""
    result = await email_service.send_email(
        to_emails=to_emails,
        subject=subject,
        body_text=body_text,
        body_html=body_html
    )
    
    # Save to database
    email_record = Email(
        user_id=current_user.id,
        message_id=result["message_id"],
        from_email=settings.gmail_email,
        to_emails=", ".join(to_emails),
        subject=subject,
        body_text=body_text,
        body_html=body_html,
        status="sent"
    )
    
    db.add(email_record)
    db.commit()
    
    return {"message": "Email sent", "recipients": result["recipients"]}


@app.get("/api/email/inbox")
async def get_inbox(
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    """Fetch emails from Gmail inbox"""
    emails = await email_service.fetch_emails(limit=limit)
    return emails


# ========================================
# HEALTH CHECK
# ========================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "status": "running"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
