from pydantic import BaseModel
from typing import Optional


class ReportCreate(BaseModel):
    category: str
    description: str
    priority: str = "Medium"
    department: str = "Municipality"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photo: str | None = None


class ReportResponse(ReportCreate):
    id: int
    status: str

    class Config:
        from_attributes = True