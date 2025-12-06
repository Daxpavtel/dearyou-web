from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Journal Form Models
class JournalSubmission(BaseModel):
    currentState: str
    currentFeeling: str
    mainGoal: str
    goalImportance: str
    futureIdentity: str
    obstacles: List[str]
    removeForever: str
    motivationType: str
    closestSentence: str
    aesthetic: str
    wantPhoto: str
    affirmationStyle: str
    guideStyle: str
    writingAmount: str
    tonePreference: str
    futureSelfMessage: str
    name: Optional[str] = ""
    personalBelief: Optional[str] = ""
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EmailSignup(BaseModel):
    email: EmailStr
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Email Helper Function
async def send_email(subject: str, body: str, to_email: str):
    """Send email using Gmail SMTP"""
    smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_username = os.environ.get('SMTP_USERNAME')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    if not smtp_username:
        logger.error("SMTP_USERNAME not configured")
        raise HTTPException(status_code=500, detail="Email service not configured")
    
    # If no password, skip actual sending (for demo purposes)
    if not smtp_password:
        logger.warning(f"Email would be sent to {to_email}: {subject}")
        logger.info(f"Email body: {body[:200]}...")
        return True
    
    try:
        message = MIMEMultipart()
        message["From"] = smtp_username
        message["To"] = to_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "html"))
        
        async with aiosmtplib.SMTP(hostname=smtp_host, port=smtp_port, use_tls=False) as smtp:
            await smtp.connect()
            await smtp.starttls()
            await smtp.login(smtp_username, smtp_password)
            await smtp.send_message(message)
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Journal Submission Endpoint
@api_router.post("/submit-journal")
async def submit_journal(submission: JournalSubmission):
    """Handle journal personalization form submission"""
    try:
        # Save to database
        submission_dict = submission.model_dump()
        submission_dict['timestamp'] = submission_dict['timestamp'].isoformat()
        result = await db.journal_submissions.insert_one(submission_dict)
        
        # Prepare email content
        notification_email = os.environ.get('NOTIFICATION_EMAIL', 'abhiii.webdesign@gmail.com')
        
        email_subject = f"New Journal Submission - {submission.name or 'Anonymous'}"
        
        email_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #d4af37;">New DearYou Journal Submission</h2>
            
            <h3>📝 Identity Snapshot</h3>
            <p><strong>Current State:</strong> {submission.currentState}</p>
            <p><strong>Current Feeling:</strong> {submission.currentFeeling}</p>
            
            <h3>🎯 Goals & Future Self</h3>
            <p><strong>Main Goal (90 days):</strong> {submission.mainGoal}</p>
            <p><strong>Why Important:</strong> {submission.goalImportance}</p>
            <p><strong>Future Identity:</strong> {submission.futureIdentity}</p>
            
            <h3>🚧 Obstacles & Patterns</h3>
            <p><strong>Obstacles:</strong> {', '.join(submission.obstacles)}</p>
            <p><strong>Remove Forever:</strong> {submission.removeForever}</p>
            
            <h3>💭 Emotional Anchors</h3>
            <p><strong>Motivation Type:</strong> {submission.motivationType}</p>
            <p><strong>Closest Sentence:</strong> {submission.closestSentence}</p>
            
            <h3>🎨 Personalization Details</h3>
            <p><strong>Aesthetic:</strong> {submission.aesthetic}</p>
            <p><strong>Want Photo:</strong> {submission.wantPhoto}</p>
            <p><strong>Affirmation Style:</strong> {submission.affirmationStyle}</p>
            
            <h3>📖 Ritual Style</h3>
            <p><strong>Guide Style:</strong> {submission.guideStyle}</p>
            <p><strong>Writing Amount:</strong> {submission.writingAmount}</p>
            <p><strong>Tone Preference:</strong> {submission.tonePreference}</p>
            
            <h3>✨ Final Personal Touch</h3>
            <p><strong>Future Self Message:</strong> {submission.futureSelfMessage}</p>
            <p><strong>Name:</strong> {submission.name or 'Not provided'}</p>
            <p><strong>Personal Belief:</strong> {submission.personalBelief or 'Not provided'}</p>
            
            <hr>
            <p><em>Submitted at: {submission.timestamp}</em></p>
        </body>
        </html>
        """
        
        # Send email notification
        await send_email(email_subject, email_body, notification_email)
        
        logger.info(f"Journal submission saved with ID: {result.inserted_id}")
        
        return {
            "success": True,
            "message": "Your personalized journal request has been received! We'll start crafting your journal.",
            "submissionId": str(result.inserted_id)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing journal submission: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process submission")

# Email Signup Endpoint
@api_router.post("/email-signup")
async def email_signup(signup: EmailSignup):
    """Handle email signup for early access"""
    try:
        # Save to database
        signup_dict = signup.model_dump()
        signup_dict['timestamp'] = signup_dict['timestamp'].isoformat()
        result = await db.email_signups.insert_one(signup_dict)
        
        # Send notification email
        notification_email = os.environ.get('NOTIFICATION_EMAIL', 'abhiii.webdesign@gmail.com')
        
        email_subject = "New Early Access Signup - DearYou"
        email_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #d4af37;">New Early Access Signup</h2>
            <p><strong>Email:</strong> {signup.email}</p>
            <p><strong>Signed up at:</strong> {signup.timestamp}</p>
            <hr>
            <p><em>Add this email to your early access list for Identity Kits!</em></p>
        </body>
        </html>
        """
        
        await send_email(email_subject, email_body, notification_email)
        
        logger.info(f"Email signup saved: {signup.email} with ID: {result.inserted_id}")
        
        return {
            "success": True,
            "message": "You're on the list! We'll notify you when Identity Kits launch."
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing email signup: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process signup")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
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