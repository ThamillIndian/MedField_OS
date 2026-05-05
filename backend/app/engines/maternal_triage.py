"""
Maternal Risk Triage Engine
Pregnancy complication screening
"""

from app.engines.base_triage_engine import BaseTriageEngine, TriageResult


class MaternalTriageEngine(BaseTriageEngine):
    """Triage engine for maternal/pregnancy risks"""

    def calculate_risk(self, symptoms: dict, vitals: dict) -> TriageResult:
        risk_level = "green"
        risk_score = 0
        possible_conditions = []
        reasons = []
        next_steps = []
        rule_triggers = []

        # Extract pregnancy data
        is_pregnant = symptoms.get("pregnant", False) or symptoms.get("pregnancy", False)
        gestational_weeks = symptoms.get("gestationalWeeks", 0) or symptoms.get("gestational_weeks", 0)
        
        # Extract symptoms
        bleeding = symptoms.get("bleeding", False)
        severe_headache = symptoms.get("severeHeadache", False) or symptoms.get("severe_headache", False)
        swelling = symptoms.get("swelling", False)
        reduced_fetal_movement = symptoms.get("reducedFetalMovement", False) or symptoms.get("reduced_fetal_movement", False)
        abdominal_pain = symptoms.get("abdominalPain", False) or symptoms.get("abdominal_pain", False)
        
        # Extract vitals
        bp_systolic = vitals.get("bpSystolic") or vitals.get("bp_systolic")
        bp_diastolic = vitals.get("bpDiastolic") or vitals.get("bp_diastolic")

        if not is_pregnant:
            return TriageResult(
                risk_level="green",
                risk_score=0,
                possible_conditions=["Not applicable - not pregnant"],
                reasons=["Patient not pregnant"],
                next_steps=["Use appropriate triage flow"],
                rule_triggers=[],
            )

        # RED FLAGS - Urgent obstetric emergency
        if bleeding:
            risk_level = "red"
            risk_score = 95
            rule_triggers.append("BLEEDING")
            reasons.append("Vaginal bleeding during pregnancy")
            possible_conditions.append("Placental abruption")
            possible_conditions.append("Miscarriage risk")
            next_steps.append("URGENT: Immediate obstetric referral")
            next_steps.append("Keep patient lying down")
            next_steps.append("Do not give anything by mouth")

        elif bp_systolic and bp_systolic >= 140 and severe_headache:
            risk_level = "red"
            risk_score = 92
            rule_triggers.append("HIGH_BP_WITH_HEADACHE")
            reasons.append(f"High blood pressure ({bp_systolic}/{bp_diastolic}) with severe headache")
            possible_conditions.append("Pre-eclampsia")
            possible_conditions.append("Eclampsia risk")
            next_steps.append("URGENT: Immediate hospital referral")
            next_steps.append("Monitor for seizures")
            next_steps.append("Keep in quiet, dark room if possible")

        elif reduced_fetal_movement:
            risk_level = "red"
            risk_score = 88
            rule_triggers.append("REDUCED_FETAL_MOVEMENT")
            reasons.append("Reduced or absent fetal movements")
            possible_conditions.append("Fetal distress")
            next_steps.append("URGENT: Immediate obstetric check required")
            next_steps.append("Count movements - refer if less than 10 in 2 hours")

        # AMBER - Moderate risk, needs doctor review
        elif swelling or severe_headache:
            risk_level = "amber"
            risk_score = 70
            if swelling:
                rule_triggers.append("SWELLING")
                reasons.append("Swelling present (face/hands/feet)")
            if severe_headache:
                rule_triggers.append("SEVERE_HEADACHE")
                reasons.append("Severe headache")
            possible_conditions.append("Pre-eclampsia warning signs")
            next_steps.append("Doctor review within 24 hours")
            next_steps.append("Monitor blood pressure daily")
            next_steps.append("Rest and reduce salt intake")

        elif bp_systolic and bp_systolic >= 140:
            risk_level = "amber"
            risk_score = 72
            rule_triggers.append("ELEVATED_BP")
            reasons.append(f"Elevated blood pressure ({bp_systolic}/{bp_diastolic})")
            possible_conditions.append("Gestational hypertension")
            next_steps.append("Doctor consultation needed")
            next_steps.append("Monitor BP regularly")
            next_steps.append("Watch for headache or vision changes")

        elif abdominal_pain:
            risk_level = "amber"
            risk_score = 65
            rule_triggers.append("ABDOMINAL_PAIN")
            reasons.append("Abdominal pain reported")
            possible_conditions.append("Needs evaluation")
            next_steps.append("Doctor assessment required")
            next_steps.append("Monitor pain intensity and location")

        # GREEN - Routine antenatal care
        else:
            risk_level = "green"
            risk_score = 20
            reasons.append("Routine antenatal check")
            possible_conditions.append("Normal pregnancy monitoring")
            next_steps.append("Continue routine antenatal care")
            next_steps.append("Next scheduled check-up as per protocol")
            next_steps.append("Report any warning signs immediately")

        # Additional guidance based on gestational age
        if gestational_weeks > 0:
            if gestational_weeks < 12:
                next_steps.append("Early pregnancy - ensure folic acid supplementation")
            elif gestational_weeks > 37:
                next_steps.append("Term pregnancy - watch for labor signs")

        return TriageResult(
            risk_level=risk_level,
            risk_score=risk_score,
            possible_conditions=possible_conditions,
            reasons=reasons,
            next_steps=next_steps,
            rule_triggers=rule_triggers,
        )
