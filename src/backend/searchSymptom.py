from dataclasses import dataclass

@dataclass
class SearchSymptom:
    trackableId: int
    trackableName: str
    
@dataclass
class PopularSymptom:
    symptom: str
    numDiagnoses: int