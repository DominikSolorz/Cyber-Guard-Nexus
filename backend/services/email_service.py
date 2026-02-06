"""
Gmail email service - IMAP receive, SMTP send
"""
import asyncio
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import aiosmtplib
from aioimaplib import aioimaplib
from config import get_settings
from typing import List, Dict, Optional
import os

settings = get_settings()


class EmailService:
    """Gmail email service using IMAP/SMTP"""
    
    def __init__(self):
        self.smtp_server = settings.smtp_server
        self.smtp_port = settings.smtp_port
        self.imap_server = settings.imap_server
        self.imap_port = settings.imap_port
        self.email = settings.gmail_email
        self.password = settings.gmail_app_password
    
    async def send_email(
        self,
        to_emails: List[str],
        subject: str,
        body_text: str,
        body_html: Optional[str] = None,
        cc_emails: Optional[List[str]] = None,
        bcc_emails: Optional[List[str]] = None,
        attachments: Optional[List[str]] = None
    ) -> Dict:
        """
        Send email via Gmail SMTP
        
        Args:
            to_emails: List of recipient emails
            subject: Email subject
            body_text: Plain text body
            body_html: HTML body (optional)
            cc_emails: CC recipients
            bcc_emails: BCC recipients
            attachments: List of file paths to attach
        
        Returns:
            Dict with status and message_id
        """
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = self.email
            msg['To'] = ', '.join(to_emails)
            msg['Subject'] = subject
            
            if cc_emails:
                msg['Cc'] = ', '.join(cc_emails)
            
            # Add text body
            msg.attach(MIMEText(body_text, 'plain', 'utf-8'))
            
            # Add HTML body if provided
            if body_html:
                msg.attach(MIMEText(body_html, 'html', 'utf-8'))
            
            # Add attachments
            if attachments:
                for file_path in attachments:
                    if os.path.exists(file_path):
                        with open(file_path, 'rb') as f:
                            part = MIMEBase('application', 'octet-stream')
                            part.set_payload(f.read())
                            encoders.encode_base64(part)
                            part.add_header(
                                'Content-Disposition',
                                f'attachment; filename={os.path.basename(file_path)}'
                            )
                            msg.attach(part)
            
            # All recipients
            all_recipients = to_emails.copy()
            if cc_emails:
                all_recipients.extend(cc_emails)
            if bcc_emails:
                all_recipients.extend(bcc_emails)
            
            # Send via SMTP
            await aiosmtplib.send(
                msg,
                hostname=self.smtp_server,
                port=self.smtp_port,
                username=self.email,
                password=self.password,
                start_tls=True
            )
            
            return {
                "status": "sent",
                "message_id": msg['Message-ID'],
                "recipients": len(all_recipients)
            }
        
        except Exception as e:
            raise Exception(f"Failed to send email: {str(e)}")
    
    async def fetch_emails(self, mailbox: str = "INBOX", limit: int = 50) -> List[Dict]:
        """
        Fetch emails from Gmail via IMAP
        
        Args:
            mailbox: Mailbox to read from (default: INBOX)
            limit: Maximum number of emails to fetch
        
        Returns:
            List of email dicts
        """
        try:
            # Connect to IMAP
            imap_client = aioimaplib.IMAP4_SSL(host=self.imap_server, port=self.imap_port)
            await imap_client.wait_hello_from_server()
            
            # Login
            await imap_client.login(self.email, self.password)
            
            # Select mailbox
            await imap_client.select(mailbox)
            
            # Search for all emails
            _, message_numbers = await imap_client.search('ALL')
            
            # Get last N emails
            email_ids = message_numbers[0].split()[-limit:]
            
            emails = []
            for email_id in email_ids:
                # Fetch email
                _, msg_data = await imap_client.fetch(email_id, '(RFC822)')
                
                # Parse email
                email_body = msg_data[1]
                email_message = email.message_from_bytes(email_body)
                
                # Extract data
                emails.append({
                    "message_id": email_message.get('Message-ID'),
                    "from": email_message.get('From'),
                    "to": email_message.get('To'),
                    "subject": email_message.get('Subject'),
                    "date": email_message.get('Date'),
                    "body": self._get_email_body(email_message)
                })
            
            # Logout
            await imap_client.logout()
            
            return emails
        
        except Exception as e:
            raise Exception(f"Failed to fetch emails: {str(e)}")
    
    def _get_email_body(self, email_message) -> str:
        """Extract email body from message"""
        body = ""
        
        if email_message.is_multipart():
            for part in email_message.walk():
                content_type = part.get_content_type()
                if content_type == "text/plain":
                    body = part.get_payload(decode=True).decode()
                    break
        else:
            body = email_message.get_payload(decode=True).decode()
        
        return body


# Global instance
email_service = EmailService()
