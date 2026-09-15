from sqlalchemy import Column, Integer, String, Text, Float
from .database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100))
    description = Column(Text)
    priority = Column(String(20), default="Medium")
    department = Column(String(100), default="Municipality")
    status = Column(String(50), default="Submitted")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    photo = Column(Text, nullable=True)
