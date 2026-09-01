export interface CaseMetric {
  name: string;
  score: number; // 0 - 100
  color: string; // Hex color from strict design system
  category: "critical" | "warning" | "success";
}

export interface TimelineEvent {
  timestamp: string;
  description: string;
  type: "ai_detection" | "operator_action" | "system_event";
}

export interface TranscriptUtterance {
  time: string;
  speaker: "Caller" | "Operator (Ananya Sharma)" | "Co-Pilot Alert";
  text: string;
  isFlagged?: boolean;
  flaggedKeywords?: string[];
  toneMarker?: string;
  isAlert?: boolean;
}

export interface CaseRecord {
  id: string;
  caseNumber: string;
  status: "critical" | "warning" | "low";
  statusLabel: string;
  district: string;
  state: string;
  sviScore: number;
  callerNameAnonymized: string;
  operatorName: string;
  intakeTimestamp: string;
  callDuration: string;
  metrics: CaseMetric[];
  detectedKeywords: string[];
  flaggedTime: string;
  caseBrief: string;
  timeline: TimelineEvent[];
  transcript: TranscriptUtterance[];
  historicalMatch?: {
    caseId: string;
    similarityScore: number;
    year: number;
    district: string;
    resolution: string;
  };
  delayRiskScore: number; // 0-100
}

export const SYNTHETIC_CASES: CaseRecord[] = [
  {
    id: "case-4471",
    caseNumber: "#4471",
    status: "critical",
    statusLabel: "critical",
    district: "Sant Kabir Nagar",
    state: "Uttar Pradesh",
    sviScore: 84,
    callerNameAnonymized: "Citizen S.K. (Protected)",
    operatorName: "Ananya Sharma",
    intakeTimestamp: "10:42 AM IST, 24 Oct",
    callDuration: "03:18 mins",
    metrics: [
      {
        name: "Voice tone",
        score: 88,
        color: "#B23A3A",
        category: "critical",
      },
      {
        name: "Distress keywords",
        score: 76,
        color: "#B23A3A",
        category: "critical",
      },
      {
        name: "Speech pace",
        score: 64,
        color: "#A6650F",
        category: "warning",
      },
      {
        name: "Isolation signal",
        score: 80,
        color: "#B23A3A",
        category: "critical",
      },
    ],
    detectedKeywords: ["alone", "they said they'd come back", "scared"],
    flaggedTime: "00:47 into the call",
    caseBrief:
      "Caller reported repeated threats and is currently alone at home. High fear indicators detected in both tone and language. Operator escalated to police at 02:14. Similar complaint pattern noted in this district over the past 2 weeks.",
    timeline: [
      {
        timestamp: "00:47",
        description: "distress detected, co-pilot alert shown",
        type: "ai_detection",
      },
      {
        timestamp: "02:14",
        description: "escalated to police by operator",
        type: "operator_action",
      },
      {
        timestamp: "02:20",
        description: "case brief generated",
        type: "system_event",
      },
    ],
    transcript: [
      {
        time: "00:04",
        speaker: "Operator (Ananya Sharma)",
        text: "Namaste, Helpline desk Uttar Pradesh. Main Ananya bol rahi hoon. Aap surakshit jagah par hain?",
      },
      {
        time: "00:18",
        speaker: "Caller",
        text: "Mujhe madad chahiye... bahar kuch log gate bajaa rahe hain.",
        toneMarker: "Tremor in voice (+18Hz fluctuation)",
      },
      {
        time: "00:32",
        speaker: "Operator (Ananya Sharma)",
        text: "Main aapke saath hoon. Kripya darwaza andar se band rakhein. Aapka zila aur sthan batayein.",
      },
      {
        time: "00:47",
        speaker: "Caller",
        text: "Sant Kabir Nagar, Khalilabad road. Main ghar par bilkul alone hoon, they said they'd come back... mujhe bohot scared lag raha hai.",
        isFlagged: true,
        flaggedKeywords: ["alone", "they said they'd come back", "scared"],
        toneMarker: "Acoustic panic spike detected (88%)",
      },
      {
        time: "00:48",
        speaker: "Co-Pilot Alert",
        text: "⚠️ SVI Spike (84/100): Isolation threat detected. Recommend immediate police dispatch protocol & stay on line.",
        isAlert: true,
      },
      {
        time: "01:15",
        speaker: "Operator (Ananya Sharma)",
        text: "Aap ghabrayein nahi, main line par hi hoon. Khalilabad local PCR unit ko alert kar rahi hoon.",
      },
      {
        time: "02:14",
        speaker: "Operator (Ananya Sharma)",
        text: "PCR Van 04 dispatch ho chuki hai, ETA 6 minutes. Main aapke saath call par active rahungi.",
      },
      {
        time: "03:10",
        speaker: "Caller",
        text: "Police siren ki aawaz aa rahi hai... thank you ma'am.",
        toneMarker: "De-escalation recorded (-35% distress level)",
      },
    ],
    historicalMatch: {
      caseId: "#SKN-2025-1102",
      similarityScore: 92,
      year: 2025,
      district: "Sant Kabir Nagar",
      resolution: "Rapid PCR deployment within 7 mins prevented unlawful trespassing. Community beat officer assigned for 14-day follow-up.",
    },
    delayRiskScore: 18,
  },
  {
    id: "case-8942",
    caseNumber: "#UP-8942",
    status: "critical",
    statusLabel: "critical",
    district: "Gorakhpur",
    state: "Uttar Pradesh",
    sviScore: 78,
    callerNameAnonymized: "Citizen R.P. (Protected)",
    operatorName: "Ananya Sharma",
    intakeTimestamp: "09:15 AM IST, 24 Oct",
    callDuration: "02:45 mins",
    metrics: [
      {
        name: "Voice tone",
        score: 75,
        color: "#B23A3A",
        category: "critical",
      },
      {
        name: "Distress keywords",
        score: 82,
        color: "#B23A3A",
        category: "critical",
      },
      {
        name: "Speech pace",
        score: 70,
        color: "#A6650F",
        category: "warning",
      },
      {
        name: "Isolation signal",
        score: 65,
        color: "#A6650F",
        category: "warning",
      },
    ],
    detectedKeywords: ["urgent", "break-in", "send help"],
    flaggedTime: "00:35 into the call",
    caseBrief:
      "Commercial shop burglary attempt reported in Gorakhpur town centre. Suspects fled upon bystander gathering. Operator dispatched mobile patrol unit.",
    timeline: [
      {
        timestamp: "00:35",
        description: "emergency keywords detected by co-pilot",
        type: "ai_detection",
      },
      {
        timestamp: "01:10",
        description: "operator notified Gorakhpur central patrol",
        type: "operator_action",
      },
      {
        timestamp: "02:40",
        description: "first responder check-in confirmed",
        type: "system_event",
      },
    ],
    transcript: [
      {
        time: "00:10",
        speaker: "Operator (Ananya Sharma)",
        text: "Helpline desk Gorakhpur, please state your emergency.",
      },
      {
        time: "00:35",
        speaker: "Caller",
        text: "Shops near Golghar chowk, break-in attempt happening urgent send help!",
        isFlagged: true,
        flaggedKeywords: ["urgent", "break-in", "send help"],
      },
    ],
    historicalMatch: {
      caseId: "#GKP-2025-0891",
      similarityScore: 86,
      year: 2025,
      district: "Gorakhpur",
      resolution: "Night patrol beat intensified around Golghar commercial quadrant.",
    },
    delayRiskScore: 24,
  },
  {
    id: "case-3104",
    caseNumber: "#MH-3104",
    status: "warning",
    statusLabel: "warning",
    district: "Pune",
    state: "Maharashtra",
    sviScore: 52,
    callerNameAnonymized: "Citizen P.K. (Protected)",
    operatorName: "Vikram Singh",
    intakeTimestamp: "08:30 AM IST, 24 Oct",
    callDuration: "04:12 mins",
    metrics: [
      {
        name: "Voice tone",
        score: 48,
        color: "#A6650F",
        category: "warning",
      },
      {
        name: "Distress keywords",
        score: 55,
        color: "#A6650F",
        category: "warning",
      },
      {
        name: "Speech pace",
        score: 50,
        color: "#A6650F",
        category: "warning",
      },
      {
        name: "Isolation signal",
        score: 42,
        color: "#A6650F",
        category: "warning",
      },
    ],
    detectedKeywords: ["harassment", "dispute", "need counselling"],
    flaggedTime: "01:12 into the call",
    caseBrief:
      "Neighbourhood dispute regarding boundary access in Hadapsar. No immediate physical harm reported. Operator scheduled mediation officer visit.",
    timeline: [
      {
        timestamp: "01:12",
        description: "moderate dispute indicators tagged",
        type: "ai_detection",
      },
      {
        timestamp: "03:45",
        description: "referral logged to Pune Civil Mediation Desk",
        type: "operator_action",
      },
    ],
    transcript: [
      {
        time: "00:15",
        speaker: "Caller",
        text: "Hamare padosi ke saath roz vivad ho raha hai, boundary wall ko lekar.",
      },
    ],
    historicalMatch: {
      caseId: "#PUN-2025-0419",
      similarityScore: 78,
      year: 2025,
      district: "Pune",
      resolution: "Civil mediation session conducted successfully within 48 hours.",
    },
    delayRiskScore: 35,
  },
  {
    id: "case-1190",
    caseNumber: "#RJ-1190",
    status: "low",
    statusLabel: "low",
    district: "Jaipur Rural",
    state: "Rajasthan",
    sviScore: 22,
    callerNameAnonymized: "Citizen M.J. (Protected)",
    operatorName: "Pooja Verma",
    intakeTimestamp: "07:50 AM IST, 24 Oct",
    callDuration: "01:50 mins",
    metrics: [
      {
        name: "Voice tone",
        score: 25,
        color: "#2F855A",
        category: "success",
      },
      {
        name: "Distress keywords",
        score: 18,
        color: "#2F855A",
        category: "success",
      },
      {
        name: "Speech pace",
        score: 30,
        color: "#2F855A",
        category: "success",
      },
      {
        name: "Isolation signal",
        score: 15,
        color: "#2F855A",
        category: "success",
      },
    ],
    detectedKeywords: ["information request", "helpline timing"],
    flaggedTime: "00:20 into the call",
    caseBrief:
      "General inquiry regarding pension verification helpline timings and nearby Jan Seva Kendra locations. Informational resolution provided.",
    timeline: [
      {
        timestamp: "00:20",
        description: "inquiry classified as routine informational",
        type: "ai_detection",
      },
      {
        timestamp: "01:40",
        description: "SMS guide dispatched to caller with center coordinates",
        type: "operator_action",
      },
    ],
    transcript: [
      {
        time: "00:05",
        speaker: "Caller",
        text: "Jan Seva Kendra Jaipur Rural ka timing kya hai?",
      },
    ],
    historicalMatch: {
      caseId: "#JPR-2025-0012",
      similarityScore: 95,
      year: 2025,
      district: "Jaipur",
      resolution: "Automated SMS notification dispatched.",
    },
    delayRiskScore: 5,
  },
];
