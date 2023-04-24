from dataclasses import dataclass

@dataclass
class SearchSymptom:
    trackableId: int
    trackableName: str
        
@dataclass
class TreatmentPercent:
    treatmentName: str
    percent: float
@dataclass
class PopularSymptom:
    symptom: str
    numDiagnoses: int

@dataclass
class ConditionsTreatments:
    diagnosis: str
    treatment: str
    numTreatments: int
    dosage: str