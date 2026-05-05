from typing import Dict, List, Tuple


class BaseTriageEngine:
    """
    Base class for triage engines
    
    Important: The LLM should NOT decide final risk alone.
    The LLM understands language. The rule engine decides safety risk.
    """
    
    def __init__(self):
        self.risk_level = "green"
        self.risk_score = 0
        self.reasons = []
        self.rule_triggers = []
        self.possible_conditions = []
        self.next_steps = []
    
    def evaluate(self, symptoms: dict, vitals: dict) -> Dict:
        """
        Main evaluation method - override in subclasses
        
        Args:
            symptoms: Structured symptoms dict
            vitals: Vitals dict (temp, BP, pulse, SpO2, etc.)
        
        Returns:
            Triage result dict
        """
        raise NotImplementedError("Subclasses must implement evaluate()")
    
    def set_risk(self, level: str, score: int, reason: str, rule_trigger: str):
        """Helper to set risk level"""
        if level == "red":
            priority = 3
        elif level == "amber":
            priority = 2
        else:
            priority = 1
        
        # Only upgrade risk, never downgrade
        current_priority = 3 if self.risk_level == "red" else (2 if self.risk_level == "amber" else 1)
        
        if priority > current_priority:
            self.risk_level = level
            self.risk_score = max(self.risk_score, score)
        
        self.reasons.append(reason)
        self.rule_triggers.append(rule_trigger)
    
    def add_condition(self, condition: str):
        """Add possible condition"""
        if condition not in self.possible_conditions:
            self.possible_conditions.append(condition)
    
    def add_next_step(self, step: str):
        """Add next step"""
        if step not in self.next_steps:
            self.next_steps.append(step)
    
    def get_result(self) -> Dict:
        """Return final triage result"""
        return {
            "riskLevel": self.risk_level,
            "riskScore": self.risk_score,
            "possibleConditions": self.possible_conditions,
            "reasons": self.reasons,
            "nextSteps": self.next_steps,
            "ruleTriggers": self.rule_triggers,
        }
