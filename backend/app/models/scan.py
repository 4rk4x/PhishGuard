import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    url = Column(Text, nullable=False)
    defanged_url = Column(Text, nullable=False)
    domain = Column(String(255), nullable=True, index=True)
    classification = Column(String(50), nullable=False, index=True)  # "safe", "suspicious", "phishing"
    risk_score = Column(Float, nullable=False)  # 0.0 to 100.0
    confidence = Column(Float, nullable=False)  # 0.0 to 100.0
    model_used = Column(String(100), default="Random Forest Classifier")
    features_snapshot = Column(Text, nullable=False)  # JSON-serialized features
    explanation = Column(Text, nullable=False)  # JSON-serialized XAI explanation factors
    client_ip = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)

    # Relationship
    user = relationship("User", back_populates="scans")

    def __repr__(self):
        return f"<Scan id={self.id} classification='{self.classification}' score={self.risk_score}>"

