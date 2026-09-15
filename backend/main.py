from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, get_db, Base
from .models import Report
from .schemas import ReportCreate, ReportResponse

app = FastAPI(title="CivicPulse API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "CivicPulse Backend is running!"
    }


@app.post("/reports", response_model=ReportResponse)
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db)
):
    new_report = Report(
        category=report.category,
        description=report.description,
        priority=report.priority,
        department=report.department,
        latitude=report.latitude,
        longitude=report.longitude,
        photo=report.photo
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report


@app.get("/reports", response_model=list[ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()