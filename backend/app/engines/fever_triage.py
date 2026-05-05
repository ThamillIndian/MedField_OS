from app.engines.base_triage_engine import BaseTriageEngine


class FeverTriageEngine(BaseTriageEngine):
    """
    Fever / Acute Febrile Illness Triage Engine
    
    Based on clinical guidelines for fever assessment in rural settings
    """
    
    def evaluate(self, symptoms: dict, vitals: dict) -> dict:
        """
        Evaluate fever case
        
        Args:
            symptoms: fever, fever_duration_days, vomiting, weakness, dizziness, 
                     rash, breathlessness, confusion, fainting, hydration, etc.
            vitals: temperature, bpSystolic, bpDiastolic, pulse, spo2
        """
        # Extract symptoms
        has_fever = symptoms.get("fever", False)
        fever_days = symptoms.get("fever_duration_days", symptoms.get("feverDurationDays", 0))
        vomiting = symptoms.get("vomiting", False)
        weakness = symptoms.get("weakness", False)
        dizziness = symptoms.get("dizziness", False)
        rash = symptoms.get("rash", False)
        breathlessness = symptoms.get("breathlessness", False)
        confusion = symptoms.get("confusion", False)
        fainting = symptoms.get("fainting", False)
        unable_to_drink = symptoms.get("unable_to_drink", False)
        
        # Extract vitals
        temp = vitals.get("temperature", 0)
        spo2 = vitals.get("spo2", vitals.get("SpO2", 100))
        bp_systolic = vitals.get("bpSystolic", vitals.get("bp_systolic", 120))
        
        # CRITICAL / RED FLAGS
        if breathlessness or spo2 < 92:
            self.set_risk("red", 90, "Breathing difficulty or low oxygen", "BREATHLESSNESS_OR_LOW_SPO2")
            self.add_condition("Respiratory distress")
            self.add_next_step("URGENT: Refer to doctor immediately")
            self.add_next_step("Oxygen support may be needed")
        
        if confusion or fainting:
            self.set_risk("red", 92, "Altered consciousness or fainting", "CONFUSION_OR_FAINTING")
            self.add_condition("Possible severe infection or dehydration")
            self.add_next_step("URGENT: Immediate doctor referral")
        
        if unable_to_drink and vomiting:
            self.set_risk("red", 85, "Unable to drink with continuous vomiting", "SEVERE_DEHYDRATION_RISK")
            self.add_condition("Severe dehydration risk")
            self.add_next_step("URGENT: IV fluids may be needed")
            self.add_next_step("Immediate medical attention required")
        
        # AMBER / MODERATE RISK
        if fever_days >= 3 and vomiting:
            self.set_risk("amber", 68, "Fever more than 3 days with vomiting", "FEVER_GT_3_DAYS_WITH_VOMITING")
            self.add_condition("Acute febrile illness")
            self.add_condition("Dehydration risk")
            self.add_next_step("Encourage oral rehydration")
            self.add_next_step("Monitor hydration status")
            self.add_next_step("Recheck in 12 hours")
            self.add_next_step("Refer if vomiting continues or worsens")
        
        if fever_days >= 3 and weakness:
            self.set_risk("amber", 65, "Prolonged fever with weakness", "FEVER_GT_3_DAYS_WITH_WEAKNESS")
            self.add_condition("Possible viral fever")
            self.add_condition("Monitor for complications")
            self.add_next_step("Rest and hydration")
            self.add_next_step("Recheck in 24 hours")
            self.add_next_step("Refer if fever persists beyond 5 days")
        
        if temp >= 103:
            self.set_risk("amber", 70, "High fever (>103°F)", "HIGH_FEVER")
            self.add_condition("High fever")
            self.add_next_step("Tepid sponging")
            self.add_next_step("Encourage fluids")
            self.add_next_step("Monitor temperature every 4 hours")
        
        if rash and has_fever:
            self.set_risk("amber", 72, "Fever with rash", "FEVER_WITH_RASH")
            self.add_condition("Possible viral exanthem or dengue-like illness")
            self.add_next_step("Document rash pattern")
            self.add_next_step("Monitor for bleeding signs")
            self.add_next_step("Doctor review recommended")
        
        if dizziness and weakness:
            self.set_risk("amber", 60, "Dizziness with weakness", "DIZZINESS_WITH_WEAKNESS")
            self.add_condition("Possible dehydration or low BP")
            self.add_next_step("Check hydration status")
            self.add_next_step("Oral rehydration solution")
            self.add_next_step("Avoid sudden standing")
        
        # GREEN / LOW RISK
        if has_fever and fever_days < 3 and not vomiting and not weakness:
            self.risk_level = "green" if self.risk_level == "green" else self.risk_level
            self.risk_score = max(self.risk_score, 35)
            self.reasons.append("Fever less than 3 days without severe symptoms")
            self.rule_triggers.append("MILD_FEVER")
            self.add_condition("Likely viral fever")
            self.add_next_step("Rest and hydration")
            self.add_next_step("Monitor temperature")
            self.add_next_step("Recheck if fever persists or worsens")
        
        # If no specific risk identified but fever present
        if has_fever and self.risk_level == "green" and len(self.reasons) == 0:
            self.risk_score = 30
            self.reasons.append("Fever present but no severe symptoms identified")
            self.rule_triggers.append("FEVER_PRESENT")
            self.add_condition("Febrile illness")
            self.add_next_step("Monitor symptoms")
            self.add_next_step("Ensure adequate fluid intake")
            self.add_next_step("Return if symptoms worsen")
        
        return self.get_result()
