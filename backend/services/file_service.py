"""
File upload and management service
"""
import os
import shutil
import uuid
from typing import Optional
from fastapi import UploadFile
from config import get_settings
import magic

settings = get_settings()


class FileService:
    """File upload and storage service"""
    
    def __init__(self):
        self.upload_dir = settings.upload_dir
        self.max_size = settings.max_file_size_mb * 1024 * 1024  # Convert to bytes
        
        # Create upload directory if doesn't exist
        os.makedirs(self.upload_dir, exist_ok=True)
    
    async def save_file(self, file: UploadFile, user_id: int) -> dict:
        """
        Save uploaded file to disk
        
        Args:
            file: FastAPI UploadFile object
            user_id: ID of user uploading file
        
        Returns:
            Dict with file info (path, size, mime_type)
        """
        # Generate unique filename
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        
        # Create user directory
        user_dir = os.path.join(self.upload_dir, str(user_id))
        os.makedirs(user_dir, exist_ok=True)
        
        # Full file path
        file_path = os.path.join(user_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Check size limit
        if file_size > self.max_size:
            os.remove(file_path)
            raise Exception(f"File size exceeds limit of {settings.max_file_size_mb}MB")
        
        # Detect MIME type
        mime = magic.Magic(mime=True)
        mime_type = mime.from_file(file_path)
        
        return {
            "filename": unique_filename,
            "original_filename": file.filename,
            "file_path": file_path,
            "file_size": file_size,
            "mime_type": mime_type
        }
    
    def delete_file(self, file_path: str) -> bool:
        """Delete file from disk"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception:
            return False
    
    def get_file_path(self, user_id: int, filename: str) -> str:
        """Get full path to user's file"""
        return os.path.join(self.upload_dir, str(user_id), filename)


# Global instance
file_service = FileService()
