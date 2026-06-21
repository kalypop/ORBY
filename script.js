const sections = Array.from(document.querySelectorAll(".section"));
const welcomeSection = document.getElementById("welcome");
const orbyStage = document.querySelector(".orby-stage");
const orby = document.getElementById("orby");
const orbyLine = document.getElementById("orbyLine");
const stateButtons = Array.from(document.querySelectorAll(".state-button"));
const moodCards = Array.from(document.querySelectorAll(".mood-card"));
const profileForm = document.getElementById("profileForm");
const profileReview = document.getElementById("profileReview");
const profileReviewList = document.getElementById("profileReviewList");
const collectOrbyHost = document.getElementById("collectOrbyHost");
const reviewOrbyHost = document.getElementById("reviewOrbyHost");
const journeyOrbyHost = document.getElementById("journeyOrbyHost");
const signalFolder = document.getElementById("signalFolder");
const collectionStatus = document.getElementById("collectionStatus");
const startSearch = document.getElementById("startSearch");
const journeyTitle = document.getElementById("journey-title");
const journeyStatus = document.getElementById("journeyStatus");
const journeyProgress = document.getElementById("journeyProgress");
const resultPacket = document.getElementById("resultPacket");
const editProfile = document.getElementById("editProfile");
const cvTextInput = document.getElementById("cvText");
const cvFileInput = document.getElementById("cvFile");
const useDemoCv = document.getElementById("useDemoCv");
const cvStatus = document.getElementById("cvStatus");
const jobGrid = document.getElementById("jobGrid");
const jobPoolSummary = document.getElementById("jobPoolSummary");
const selectedMatchCount = document.getElementById("selectedMatchCount");
const savedCount = document.getElementById("savedCount");
const dismissedCount = document.getElementById("dismissedCount");
const prepCount = document.getElementById("prepCount");
const trackerText = document.getElementById("trackerText");
const applicationMemoryTotal = document.getElementById("applicationMemoryTotal");
const applicationDashboardEmpty = document.getElementById("applicationDashboardEmpty");
const savedMemoryList = document.getElementById("savedMemoryList");
const prepMemoryList = document.getElementById("prepMemoryList");
const offerMemoryList = document.getElementById("offerMemoryList");
const rejectedMemoryList = document.getElementById("rejectedMemoryList");

const stateCopy = {
  calm: {
    label: "Calm / Idle",
    line: "I am here. We can make the search feel smaller."
  },
  searching: {
    label: "Searching",
    line: "I am scanning quietly for roles that deserve your attention."
  },
  thinking: {
    label: "Thinking / Analyzing",
    line: "I am comparing your goals, strengths, and constraints."
  },
  match: {
    label: "Match Found",
    line: "I found a few opportunities that feel genuinely aligned."
  },
  returning: {
    label: "Returning / Delivering",
    line: "I am bringing the useful results back to you gently."
  }
};

const profile = {
  searchMood: "Steady",
  searchMode: "Steady",
  targetRole: "Graduate Research Analyst",
  careerStage: "Graduate / entry level",
  locationPreference: "Birmingham, London, or remote",
  role: "Graduate Research Analyst",
  stage: "Graduate / entry level",
  location: "Birmingham, London, or remote",
  workStyle: "Hybrid preferred",
  drivingLicence: "Not specified",
  degreeGrade: "Not specified",
  willingToTravel: "Not specified",
  workEligibility: "",
  priorities: "Training, supportive team, realistic entry requirements, meaningful research-led work",
  skills: "Research methods, data analysis, scientific writing, Excel, stakeholder communication",
  languages: "",
  extraRequirements: "",
  cvText: "",
  cvSource: "",
  extractedEducation: "",
  extractedExperience: "",
  extractedSkills: "",
  extractedStrengths: "",
  extractedGaps: "",
  extractionConfidence: "",
  needsConfirmation: ""
};

let structuredProfile = null;

const demoCv = [
  "Kalyssa Dubois",
  "Biomedical Science student interested in forensic science, biomedical research, digital health, and scientific analyst roles.",
  "",
  "Technical & Digital Skills",
  "Excel, GraphPad Prism, basic R, FIJI / ImageJ, Simple Neurite Tracer, Microsoft Office, data recording, literature review, experimental design, microscopy, immunohistochemistry, confocal microscopy, RNA sequencing, PCA, gene expression analysis, scientific report writing.",
  "",
  "Projects",
  "BrainCheck cognitive screening and stimulation app prototype, 2025 - 2026.",
  "",
  "Research Experience",
  "Cancer Research Internship, Cancer Research UK / Institute of Cancer and Genomic Sciences, Jun 2024 - Jul 2024.",
  "Research Project / Dissertation on activity-dependent myelination, 2025 - 2026.",
  "",
  "Volunteering & Leadership",
  "Medical School Mentorship, 2024 - Present.",
  "Homeless Outreach, Nov 2024 - Present.",
  "",
  "Education",
  "BSc Biomedical Science (Graduation expected July 2026)",
  "University of Birmingham",
  "",
  "Certifications",
  "Harvard Medical School certificate, 2024. First Aid, 2019. IELTS, 2023.",
  "",
  "Languages",
  "French native, Spanish native, English fluent, Catalan proficient."
].join("\n\n");

const jobs = Array.isArray(window.seededJobs) ? window.seededJobs : [];
const CURATION_RULES = {
  Steady: { minimum: 2, maximum: 5, threshold: 78, fallbackThreshold: 74 },
  Exploring: { minimum: 3, maximum: 8, threshold: 70, fallbackThreshold: 66 },
  Uncertain: { minimum: 3, maximum: 8, threshold: 68, fallbackThreshold: 64 }
};

const jobStatuses = {};
const applicationStages = {};
const APPLICATION_MEMORY_KEY = "orbyApplicationMemory";
const memoryGroups = {
  saved: {
    list: savedMemoryList,
    empty: "No saved roles yet. Save a role when it feels worth revisiting."
  },
  prep: {
    list: prepMemoryList,
    empty: "No prep roles yet. Mark a role as Prep when you want to prepare for it."
  }
};

function loadApplicationMemory() {
  try {
    const stored = JSON.parse(localStorage.getItem(APPLICATION_MEMORY_KEY) || "{}");
    const validJobIds = new Set(jobs.map((job) => job.id));
    const validStatuses = new Set(["saved", "prep", "dismissed"]);
    const validStages = new Set(["preparing", "applied", "interview", "offer", "rejected"]);

    Object.entries(stored.jobStatuses || {}).forEach(([jobId, status]) => {
      if (validJobIds.has(jobId) && validStatuses.has(status)) {
        jobStatuses[jobId] = status;
      }
    });

    Object.entries(stored.applicationStages || {}).forEach(([jobId, stage]) => {
      if (validJobIds.has(jobId) && validStages.has(stage)) {
        applicationStages[jobId] = stage;
      }
    });
  } catch (error) {
    console.warn("ORBY could not read local application memory for this demo.", error);
  }
}

function saveApplicationMemory() {
  try {
    localStorage.setItem(APPLICATION_MEMORY_KEY, JSON.stringify({
      jobStatuses,
      applicationStages,
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.warn("ORBY could not save local application memory for this demo.", error);
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toList(value) {
  return String(value || "")
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function keywordSet(value) {
  const stopWords = new Set(["and", "the", "with", "for", "role", "roles", "work", "team", "teams", "preferred"]);
  return new Set(
    String(value || "")
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((word) => word.length > 2 && !stopWords.has(word)) || []
  );
}

function overlapCount(source, target) {
  const sourceWords = keywordSet(source);
  return Array.from(keywordSet(target)).filter((word) => sourceWords.has(word)).length;
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }
  return "";
}

function splitCvIntoSections(text) {
  const headings = {
    profile: /^profile(?:\s+summary)?$/i,
    skills: /^(?:technical\s*&\s*digital\s*skills|technical skills|skills)$/i,
    projects: /^projects?$/i,
    research: /^(?:research experience|experience|work experience)$/i,
    volunteering: /^(?:volunteering\s*&\s*leadership|volunteering|leadership)$/i,
    education: /^education$/i,
    certifications: /^(?:certifications?|certificates?)$/i,
    languages: /^languages?$/i
  };
  const sections = { full: text || "" };
  const lines = String(text || "").split(/\r?\n/);
  let current = "summary";
  sections[current] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    const heading = Object.entries(headings).find(([, pattern]) => pattern.test(trimmed));

    if (heading) {
      current = heading[0];
      sections[current] = sections[current] || [];
      return;
    }

    if (!sections[current]) sections[current] = [];
    sections[current].push(line);
  });

  Object.keys(sections).forEach((key) => {
    if (Array.isArray(sections[key])) {
      sections[key] = sections[key].join("\n").trim();
    }
  });

  return sections;
}

function extractDateRanges(text) {
  const month = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
  const year = "20[0-3][0-9]";
  const datePoint = `(?:${month}\\s+)?${year}|Present`;
  const range = new RegExp(`\\b(?:${datePoint})\\s*(?:-|–|—|/)\\s*(?:${datePoint})\\b`, "gi");
  const expected = new RegExp(`\\b(?:graduation\\s+expected|expected(?:\\s+graduation)?|graduating)\\s+(?:in\\s+)?(?:${month}\\s+)?${year}\\b`, "gi");
  const standalone = new RegExp(`\\b(?:${month}\\s+)?${year}\\b|\\bPresent\\b`, "gi");
  const matches = [
    ...(text.match(expected) || []),
    ...(text.match(range) || []),
    ...(text.match(standalone) || [])
  ];

  return Array.from(new Set(matches.map((item) => item.replace(/\s+/g, " ").trim())));
}

function findNearestDateRange(sectionText) {
  return extractDateRanges(sectionText)[0] || "";
}

function extractExpectedGraduation(sectionText) {
  const month = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
  const match = sectionText.match(new RegExp(`\\b(?:graduation\\s+expected|expected(?:\\s+graduation)?|graduating)\\s+(?:in\\s+)?(${month}\\s+20[0-3][0-9]|20[0-3][0-9])\\b`, "i"));
  return match ? match[1].trim() : "";
}

function cleanCvLine(line) {
  return String(line || "")
    .replace(/\([^)]*(?:graduation|expected|20[0-3][0-9])[^)]*\)/gi, "")
    .replace(/\b(?:20[0-3][0-9]|Present)\b.*$/i, "")
    .replace(/\s+/g, " ")
    .replace(/[,;-]\s*$/, "")
    .trim();
}

function sentenceFromList(items, fallback) {
  const cleanItems = items.filter(Boolean);
  if (!cleanItems.length) return fallback;
  if (cleanItems.length === 1) return cleanItems[0];
  return `${cleanItems.slice(0, -1).join(", ")} and ${cleanItems.at(-1)}`;
}

function detectEducation() {
  const sections = splitCvIntoSections(profile.cvText);
  const educationText = sections.education || "";
  const searchText = educationText || `${profile.cvText} ${profile.skills} ${profile.role}`;
  const lines = searchText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const degreeLine = lines.find((line) => /\b(?:BSc|BA|MSc|MA|PhD|Bachelor(?:'s)?|Master(?:'s)?|degree)\b/i.test(line)) || "";
  const degree = cleanCvLine(firstMatch(degreeLine || searchText, [
    /\b(?:BSc|BA|MSc|MA|PhD)\s+(?:in\s+)?[A-Za-z /&-]{3,60}/i,
    /\b(?:Bachelor(?:'s)?|Master(?:'s)?)\s+(?:of|in)\s+[A-Za-z /&-]{3,60}/i
  ]));
  const universityLine = lines.find((line) => /\b(?:University|College|School)\b/i.test(line)) || "";
  const university = cleanCvLine(firstMatch(universityLine || searchText, [
    /\bUniversity of [A-Za-z ]{3,55}/i,
    /\b[A-Za-z ]{3,55} University\b/i
  ]));
  const expectedGraduation = extractExpectedGraduation(educationText || degreeLine);
  const educationDate = expectedGraduation ? `graduation expected ${expectedGraduation}` : findNearestDateRange(educationText);

  if (degree || university || educationDate) {
    const parts = [degree || "Education background detected", university, educationDate].filter(Boolean);
    return `${parts.join(", ")}. ORBY detected this from your CV; please confirm it is correct.`;
  }

  if (/biomedical|science|research/i.test(searchText)) {
    return `Science or research-facing education signal detected from your profile. ORBY could not confirm the institution or graduation date.`;
  }

  return `Education was not clearly identified from the CV text. ORBY is treating this as ${profile.stage.toLowerCase()} until you confirm it.`;
}

function detectExperience() {
  const sections = splitCvIntoSections(profile.cvText);
  const text = `${profile.cvText} ${profile.skills} ${profile.priorities}`.toLowerCase();
  const signals = [];

  if (/cancer research|cruk|institute of cancer|genomic sciences/.test(text)) signals.push("cancer research internship experience at CRUK / the Institute of Cancer and Genomic Sciences");
  if (/dissertation|activity-dependent myelination|myelination/.test(text)) signals.push("a dissertation or research project involving activity-dependent myelination");
  if (/braincheck|cognitive screening|stimulation app|prototype/.test(text)) signals.push("BrainCheck digital health project work");
  if (/medical school mentorship|mentorship/.test(text)) signals.push("medical school mentorship");
  if (/homeless outreach|outreach/.test(text)) signals.push("homeless outreach volunteering");
  if (/research|literature|project|study/.test(text) || sections.research) signals.push("research experience");
  if (/lab|laboratory|clinical|hospital|healthcare|patient|microscopy|immunohistochemistry/.test(text)) signals.push("laboratory, clinical, or healthcare-facing exposure");
  if (/intern|placement|work experience|volunteer/.test(text)) signals.push("internship, placement, volunteering, or work experience");
  if (/mentor|lead|captain|society|team/.test(text)) signals.push("teamwork, mentoring, or leadership");
  if (/data|excel|analysis|python|sql|statistics|graphpad|imagej|fiji|rna/.test(text)) signals.push("data analysis or technical research work");
  if (/writing|report|presentation|communication|stakeholder/.test(text)) signals.push("scientific writing, reporting, and communication");

  return `ORBY noticed ${sentenceFromList(Array.from(new Set(signals)).slice(0, 8), "no detailed experience yet")}.`;
}

function detectSkills() {
  const text = `${profile.skills}, ${profile.cvText}`;
  const detected = toList(profile.skills);
  const skillMap = [
    ["data analysis", /data|analysis|statistics/i],
    ["Excel", /excel/i],
    ["GraphPad Prism", /graphpad/i],
    ["basic R", /\bR\b|basic r/i],
    ["FIJI / ImageJ", /fiji|imagej/i],
    ["Simple Neurite Tracer", /simple neurite tracer/i],
    ["scientific report writing", /scientific report|writing|report/i],
    ["data recording", /data recording/i],
    ["Microsoft Office", /microsoft office|office/i],
    ["literature review", /literature review/i],
    ["experimental design", /experimental design/i],
    ["microscopy", /microscopy/i],
    ["immunohistochemistry", /immunohistochemistry/i],
    ["confocal microscopy", /confocal/i],
    ["RNA sequencing", /rna sequencing|rna/i],
    ["bioinformatics / PCA / gene expression analysis", /bioinformatics|pca|gene expression/i],
    ["communication", /communication|presentation|stakeholder/i],
    ["organisation", /organisation|organization|coordinate|planning/i],
    ["teamwork", /teamwork|team/i],
    ["biomedical knowledge", /biomedical|health|clinical|lab|science/i]
  ];

  skillMap.forEach(([label, pattern]) => {
    if (pattern.test(text) && !detected.some((item) => item.toLowerCase().includes(label))) {
      detected.push(label);
    }
  });

  return `ORBY noticed ${sentenceFromList(Array.from(new Set(detected)).slice(0, 18), "skills were not clearly specified yet")}.`;
}

function adjacentRoles() {
  const text = `${profile.role} ${profile.skills} ${profile.cvText}`.toLowerCase();
  const roles = [];

  if (/forensic/.test(text)) roles.push("Forensic Laboratory Assistant", "Evidence Documentation Assistant", "Toxicology Laboratory Support");
  if (/research|biomedical|science|health/.test(text)) roles.push("Research Assistant", "Health Insight Analyst");
  if (/data|excel|analysis|statistics/.test(text)) roles.push("Graduate Data Analyst", "Insight Analyst");
  if (/clinical research|trial|gcp/.test(text)) roles.push("Clinical Research Assistant", "Trial Documentation Coordinator");
  if (/digital health|braincheck|app|prototype|health tech/.test(text)) roles.push("Digital Health Project Assistant");
  if (/communication|stakeholder|writing|operations/.test(text)) roles.push("Research Operations Associate", "Programme Coordinator");

  return Array.from(new Set(roles)).slice(0, 4);
}

function detectStrengths() {
  const strengths = [];
  const text = `${profile.skills} ${profile.cvText} ${profile.languages}`.toLowerCase();

  if (/research|writing|literature/.test(text)) strengths.push("strong research and scientific writing background");
  if (/health|biomedical|clinical|hospital|lab/.test(text)) strengths.push("healthcare or biomedical context");
  if (/data|excel|analysis/.test(text)) strengths.push("data analysis and structured thinking");
  if (/communication|stakeholder|presentation/.test(text)) strengths.push("clear communication with teams or stakeholders");
  if (profile.languages.trim()) strengths.push("multilingual or international communication signal");

  return sentenceFromList(strengths, "a developing early-career profile with transferable skills");
}

function detectGaps() {
  const text = `${profile.cvText} ${profile.skills} ${profile.extraRequirements}`.toLowerCase();
  const target = `${profile.role} ${profile.priorities}`.toLowerCase();
  const gaps = [];

  if (/forensic/.test(target)) {
    if (!/forensic|evidence|chain.?of.?custody|toxicology|casework/.test(text)) {
      gaps.push("ORBY could not clearly confirm direct forensic laboratory or evidence-handling experience.");
    }
    gaps.push("Some forensic science roles may ask for chain-of-custody awareness, evidence handling, toxicology, forensic casework exposure, accreditation, security clearance, or police/government eligibility checks.");
  } else if (/clinical research|clinical trial|trial/.test(target)) {
    if (!/gcp|clinical trial|regulatory|patient|nhs/.test(text)) {
      gaps.push("Clinical research roles may ask for GCP, clinical trial documentation, patient-facing/NHS exposure, or regulatory awareness.");
    }
  } else if (/digital health|health tech|product/.test(target)) {
    if (!/product|prototype|user research|app|digital health/.test(text)) {
      gaps.push("Digital health roles may ask for product, user research, data handling, or health technology project evidence.");
    }
  } else if (/data|analyst|analytics/.test(target)) {
    if (!/sql|python|tableau|power bi|statistics|r\b/.test(text)) {
      gaps.push("Data or analyst roles may ask for SQL, Python, statistics, dashboards, or stronger commercial data examples.");
    }
  } else if (/biomedical|research|lab|laboratory/.test(target)) {
    if (!/microscopy|immunohistochemistry|confocal|rna|lab|laboratory|research/.test(text)) {
      gaps.push("Biomedical or laboratory roles may ask for specific lab techniques, research methods, data analysis, or scientific writing evidence.");
    }
  } else if (!/sql|python|tableau|power bi|r\b/.test(text)) {
    gaps.push("Specific software or role-specific methods may vary by employer.");
  }

  if (/abroad|visa|sponsorship|eligibility/.test(text)) gaps.push("Work eligibility, visa, sponsorship, or remote-from-abroad rules should be checked with employers.");
  if (!extractExpectedGraduation(splitCvIntoSections(profile.cvText).education || "") && !findNearestDateRange(splitCvIntoSections(profile.cvText).education || "")) {
    gaps.push("ORBY could not clearly identify an education date from the education section.");
  }

  return gaps;
}

function confidenceMessage(gaps) {
  const text = `${profile.cvText} ${profile.skills} ${profile.role}`.toLowerCase();
  const evidence = [];

  if (/bsc biomedical science|biomedical science/.test(text)) evidence.push("biomedical science education");
  if (/cancer research|cruk|research internship/.test(text)) evidence.push("cancer research experience");
  if (/lab|microscopy|immunohistochemistry|confocal|rna/.test(text)) evidence.push("laboratory and research methods");
  if (/data|excel|graphpad|r\b|analysis/.test(text)) evidence.push("data analysis");
  if (/writing|report|literature/.test(text)) evidence.push("scientific reporting");
  if (profile.languages.trim()) evidence.push("language background");

  const level = profile.cvText.trim() && evidence.length >= 3 ? "Medium-high" : profile.cvText.trim() ? "Medium" : "Medium-low";
  const target = profile.role.toLowerCase();
  let caution = "Role-specific requirements should still be checked before applying.";

  if (/forensic/.test(target)) {
    caution = "Forensic-specific experience, evidence-handling exposure, and eligibility requirements should still be confirmed before applying.";
  } else if (/clinical research|clinical trial/.test(target)) {
    caution = "Clinical trial documentation, GCP, patient-facing, or regulatory requirements should still be confirmed.";
  } else if (/data|analyst/.test(target)) {
    caution = "Tooling depth and commercial data expectations should still be checked role by role.";
  }

  return `${level}. ORBY detected ${sentenceFromList(evidence, "a developing early-career profile")}. ${caution}`;
}

function buildStructuredProfile() {
  const roles = adjacentRoles();
  const gaps = detectGaps();
  const forensicNote = /forensic/i.test(profile.role)
    ? " using your biomedical science and laboratory research background"
    : "";

  structuredProfile = {
    searchMode: profile.searchMood,
    targetRole: profile.role,
    careerStage: profile.stage,
    locationPreference: profile.location,
    workStyle: profile.workStyle,
    drivingLicence: profile.drivingLicence,
    degreeGrade: profile.degreeGrade,
    willingToTravel: profile.willingToTravel,
    workEligibility: profile.workEligibility || "No work eligibility or visa notes added yet.",
    priorities: profile.priorities,
    languages: profile.languages || "No languages added yet.",
    extraRequirements: profile.extraRequirements || "No extra constraints added yet.",
    cvText: profile.cvText,
    extractedEducation: detectEducation(),
    extractedExperience: detectExperience(),
    extractedSkills: detectSkills(),
    careerDirection: `${profile.role}${forensicNote}${roles.length ? `, with adjacent paths such as ${roles.join(", ")}` : ""}.`,
    extractedStrengths: `ORBY noticed ${detectStrengths()}.`,
    extractedGaps: gaps.join(" ") || "No major gaps detected from the current profile, but role-specific requirements should still be checked.",
    extractionConfidence: confidenceMessage(gaps),
    needsConfirmation: "Confirm anything that feels off before ORBY searches."
  };

  Object.assign(profile, structuredProfile);
  return structuredProfile;
}

function setState(state) {
  const nextState = stateCopy[state] ? state : "calm";
  orby.className = `orby-wrap ${nextState}`;
  orbyLine.textContent = stateCopy[nextState].line;
  stateButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.state === nextState);
  });
}

function placeOrby(sectionId) {
  orbyStage.hidden = false;
  orbyStage.style.removeProperty("display");
  orbyStage.style.removeProperty("opacity");
  orbyStage.style.removeProperty("visibility");
  orby.hidden = false;
  orby.style.removeProperty("display");
  orby.style.removeProperty("opacity");
  orby.style.removeProperty("visibility");

  if (sectionId === "collectProfileSignals") {
    collectOrbyHost.appendChild(orbyStage);
    return;
  }

  if (sectionId === "profileReview") {
    reviewOrbyHost.appendChild(orbyStage);
    return;
  }

  if (sectionId === "searchJourney") {
    journeyOrbyHost.insertBefore(orbyStage, resultPacket);
    return;
  }

  if (sectionId === "welcome") {
    const stateLab = welcomeSection.querySelector(".state-lab");
    welcomeSection.insertBefore(orbyStage, stateLab);
  }
}

function showSection(id) {
  placeOrby(id);

  sections.forEach((section) => {
    section.classList.toggle("active", section.id === id);
  });

  const stateBySection = {
    welcome: "calm",
    onboarding: "calm",
    profile: "calm",
    collectProfileSignals: "calm",
    profileReview: "thinking",
    searchJourney: "searching",
    dashboard: "returning"
  };

  setState(stateBySection[id] || "calm");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function collectProfile() {
  const formData = new FormData(profileForm);
  profile.role = formData.get("role") || profile.role;
  profile.stage = formData.get("stage") || profile.stage;
  profile.location = formData.get("location") || profile.location;
  profile.workStyle = formData.get("workStyle") || profile.workStyle;
  profile.drivingLicence = formData.get("drivingLicence") || "Not specified";
  profile.degreeGrade = formData.get("degreeGrade") || "Not specified";
  profile.willingToTravel = formData.get("willingToTravel") || "Not specified";
  profile.workEligibility = formData.get("workEligibility") || "";
  profile.priorities = formData.get("priorities") || "";
  profile.skills = formData.get("skills") || "";
  profile.languages = formData.get("languages") || "";
  profile.extraRequirements = formData.get("extraRequirements") || "";
  profile.cvText = formData.get("cvText") || "";
  profile.searchMode = profile.searchMood;
  profile.targetRole = profile.role;
  profile.careerStage = profile.stage;
  profile.locationPreference = profile.location;
}

function summarizeCvSignal() {
  if (!profile.cvText.trim()) {
    return "No CV text provided";
  }

  const cvWords = keywordSet(profile.cvText);
  const signals = ["research", "analysis", "data", "writing", "excel", "communication", "biomedical", "training"]
    .filter((word) => cvWords.has(word));

  return signals.length ? `CV signals: ${signals.join(", ")}` : "CV text added for simulated review";
}

function moodDescription() {
  const descriptions = {
    Steady: "Focused matching near your stated target role",
    Exploring: "Broader matching across adjacent roles connected to your skills",
    Uncertain: "Guided matching that favors clear, supportive, entry-level-friendly roles"
  };
  return descriptions[profile.searchMood] || descriptions.Steady;
}

function renderProfileReview() {
  const signal = structuredProfile || buildStructuredProfile();
  const reviewItems = [
    ["Search mode", `${signal.searchMode}: ${moodDescription()}`, ""],
    ["Target direction", signal.careerDirection, "wide-review"],
    ["Career stage", signal.careerStage, ""],
    ["Location and work style", `${signal.locationPreference}; ${signal.workStyle}`, ""],
    ["Requirement checks", `Driving licence: ${signal.drivingLicence}. Degree grade: ${signal.degreeGrade}. Travel: ${signal.willingToTravel}. Work eligibility notes: ${signal.workEligibility}`, "wide-review"],
    ["Education detected", signal.extractedEducation, "wide-review"],
    ["Experience ORBY noticed", signal.extractedExperience, "wide-review"],
    ["Skills and strengths", `${signal.extractedSkills}. ${signal.extractedStrengths}`, "full-review"],
    ["Languages", signal.languages, ""],
    ["Extra requirements / constraints", signal.extraRequirements, "wide-review"],
    ["Possible gaps or things to check", signal.extractedGaps, "full-review"],
    ["ORBY confidence / needs confirmation", `${signal.extractionConfidence} ${signal.needsConfirmation}`, "full-review"]
  ];

  profileReviewList.innerHTML = reviewItems.map(([label, value, className]) => `
    <div class="review-item ${className}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join("");
}

function runProfileCollection() {
  const progress = document.querySelector("#collectProfileSignals .analysis-progress span");
  progress.style.width = "0%";
  signalFolder.style.animation = "none";
  signalFolder.offsetHeight;
  signalFolder.style.animation = "";
  signalFolder.hidden = false;
  collectionStatus.textContent = "Receiving your profile signals...";
  setState("calm");

  window.setTimeout(() => {
    progress.style.width = "38%";
    collectionStatus.textContent = "";
  }, 700);

  window.setTimeout(() => {
    progress.style.width = "76%";
    collectionStatus.textContent = "ORBY is absorbing the profile files into one career signal.";
  }, 1600);

  window.setTimeout(() => {
    progress.style.width = "100%";
    collectionStatus.textContent = "Your profile orbit is ready for review.";
    buildStructuredProfile();
    renderProfileReview();
    showSection("profileReview");
  }, 2600);
}

function jobSearchText(job) {
  return [
    job.title,
    job.company,
    job.category,
    job.location,
    job.workStyle,
    job.level,
    job.summary,
    job.description,
    job.requiredSkills?.join(" "),
    job.preferredSkills?.join(" "),
    job.requirements?.join(" "),
    job.tags?.join(" "),
    job.sector
  ].join(" ");
}

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function jobStatusCounts() {
  return jobs.reduce((totals, job) => {
    totals[job.status] = (totals[job.status] || 0) + 1;
    return totals;
  }, {});
}

const categoryRelationships = {
  forensic: {
    keywords: ["forensic", "toxicology", "evidence", "dna", "crime lab", "casework", "analytical chemistry"],
    direct: ["Forensic science / toxicology / evidence"],
    adjacent: ["Biomedical research / lab support", "Scientific communications / documentation / evidence", "Clinical research / trials"]
  },
  biomedical: {
    keywords: ["biomedical", "lab", "laboratory", "research assistant", "translational", "microscopy", "cell culture"],
    direct: ["Biomedical research / lab support"],
    adjacent: ["Clinical research / trials", "Healthcare data / insight / analyst", "Scientific communications / documentation / evidence", "Adjacent transferable early-career roles"]
  },
  clinical: {
    keywords: ["clinical research", "clinical trial", "trial", "study assistant", "patient data", "gcp"],
    direct: ["Clinical research / trials"],
    adjacent: ["Public health / NHS / service improvement", "Healthcare data / insight / analyst", "Scientific communications / documentation / evidence", "Adjacent transferable early-career roles"]
  },
  healthcareData: {
    keywords: ["healthcare data", "data", "analyst", "insight", "analytics", "data coordinator", "service improvement"],
    direct: ["Healthcare data / insight / analyst"],
    adjacent: ["Digital health / health tech", "Public health / NHS / service improvement", "Clinical research / trials", "Adjacent transferable early-career roles"]
  },
  digitalHealth: {
    keywords: ["digital health", "healthtech", "health tech", "product research", "user research", "health innovation", "app"],
    direct: ["Digital health / health tech"],
    adjacent: ["Healthcare data / insight / analyst", "Public health / NHS / service improvement", "Biomedical research / lab support", "Adjacent transferable early-career roles"]
  },
  publicHealth: {
    keywords: ["public health", "population health", "community health", "health programme", "nhs", "service improvement"],
    direct: ["Public health / NHS / service improvement"],
    adjacent: ["Healthcare data / insight / analyst", "Clinical research / trials", "Scientific communications / documentation / evidence", "Adjacent transferable early-career roles"]
  },
  scientificComms: {
    keywords: ["scientific communication", "scientific communications", "medical writing", "documentation", "evidence review", "literature review", "science content"],
    direct: ["Scientific communications / documentation / evidence"],
    adjacent: ["Clinical research / trials", "Public health / NHS / service improvement", "Healthcare data / insight / analyst", "Adjacent transferable early-career roles"]
  }
};

const scoringWeights = {
  Steady: {
    roleRelevance: 32,
    skillOverlap: 15,
    levelFit: 13,
    locationWorkStyle: 12,
    educationSectorFit: 9,
    hardRequirementFit: 14,
    careerPriorityFit: 5
  },
  Exploring: {
    roleRelevance: 19,
    skillOverlap: 27,
    levelFit: 12,
    locationWorkStyle: 11,
    educationSectorFit: 12,
    hardRequirementFit: 12,
    careerPriorityFit: 7
  },
  Uncertain: {
    roleRelevance: 16,
    skillOverlap: 14,
    levelFit: 26,
    locationWorkStyle: 10,
    educationSectorFit: 8,
    hardRequirementFit: 18,
    careerPriorityFit: 8
  }
};

function interpretTargetDomains() {
  const roleTarget = String(profile.role || "").toLowerCase();
  const roleDomains = Object.entries(categoryRelationships)
    .filter(([, config]) => config.keywords.some((keyword) => roleTarget.includes(keyword)))
    .map(([domain]) => domain);

  if (roleDomains.length) return roleDomains;

  const target = `${profile.role} ${profile.priorities} ${profile.skills}`.toLowerCase();
  const domains = Object.entries(categoryRelationships)
    .filter(([, config]) => config.keywords.some((keyword) => target.includes(keyword)))
    .map(([domain]) => domain);

  if (domains.length) return domains;
  if (/research|science|study/.test(target)) return ["biomedical"];
  if (/health|care|nhs/.test(target)) return ["publicHealth"];
  return ["healthcareData"];
}

function categoryMatch(job, domains = interpretTargetDomains()) {
  let best = { strength: 0.15, relationship: "low", domain: domains[0] || "healthcareData" };

  domains.forEach((domain) => {
    const config = categoryRelationships[domain];
    if (!config) return;

    if (config.direct.includes(job.category) && best.strength < 1) {
      best = { strength: 1, relationship: "direct", domain };
    } else if (config.adjacent.includes(job.category) && best.strength < 0.68) {
      best = { strength: 0.68, relationship: "adjacent", domain };
    }
  });

  return best;
}

function componentScore(raw, weight) {
  return Math.round(Math.max(0, Math.min(1, raw)) * weight);
}

function clearRequirementCount(job) {
  return [
    job.experienceRequired,
    job.educationLevel,
    ...(job.requirements || [])
  ].filter(Boolean).length;
}

function userHasLabSignal() {
  return /lab|laboratory|microscopy|immunohistochemistry|confocal|cell culture|sample|research project|biomedical/i.test(`${profile.skills} ${profile.cvText}`);
}

function userHasSkill(pattern) {
  return pattern.test(`${profile.skills} ${profile.cvText} ${profile.priorities}`);
}

function degreeMeetsMinimum(requiredGrade) {
  if (!requiredGrade) return true;
  const order = { "First": 3, "2:1": 2, "2:2": 1 };
  if (!order[profile.degreeGrade]) return null;
  return order[profile.degreeGrade] >= order[requiredGrade];
}

function userConstraintProfile() {
  const extra = String(profile.extraRequirements || "").toLowerCase();
  const workStyle = String(profile.workStyle || "").toLowerCase();
  const location = String(profile.location || "").toLowerCase();
  const travel = String(profile.willingToTravel || "").toLowerCase();
  const eligibility = String(profile.workEligibility || "").toLowerCase();
  const combined = `${extra} ${workStyle} ${location} ${travel} ${eligibility}`;
  const places = ["birmingham", "london", "manchester", "leeds", "cambridge", "oxford"];
  const hardLocations = places.filter((place) => new RegExp(`(?:only|must be in|must be|needs? to be in|required in)\\s+${place}|${place}\\s+only`).test(combined));
  const preferredLocations = places.filter((place) => location.includes(place));

  return {
    remoteRequired: /(?:needs?|must|requires?|required|only|exclusively).{0,24}remote|remote\s+only|fully\s+remote|no\s+on-?site|cannot\s+(?:do|work)\s+on-?site/.test(combined),
    remotePreferred: workStyle.includes("remote") || extra.includes("remote"),
    noTravel: travel === "no" || /not willing to travel|cannot travel|can't travel|no travel/.test(combined),
    limitedTravel: travel === "limited",
    hardLocations,
    preferredLocations,
    sponsorshipNeeded: /needs?\s+sponsorship|requires?\s+sponsorship|visa sponsorship|need a visa|require a visa/.test(combined)
  };
}

function jobMatchesAnyLocation(job, locations) {
  const text = `${job.location} ${job.locationFlexibility || ""}`.toLowerCase();
  return locations.some((place) => text.includes(place));
}

function userConstraintAssessment(job) {
  const constraints = userConstraintProfile();
  const flags = [];
  const missingConfirmations = [];
  const reductions = [];
  let raw = 1;
  let cap = 100;
  const searchText = jobSearchText(job).toLowerCase();
  const style = `${job.workStyle || job.style || ""} ${job.location || ""}`.toLowerCase();
  const isRemote = /remote/.test(style);
  const isHybrid = /hybrid/.test(style);
  const isOnSite = /on-site|onsite/.test(style);

  if (constraints.remoteRequired) {
    if (isOnSite && !job.remoteCompatible) {
      flags.push("Does not match remote requirement.");
      reductions.push("work style dropped because you said remote is required");
      raw -= 0.6;
      cap = Math.min(cap, 68);
    } else if (isHybrid && !isRemote) {
      missingConfirmations.push("Confirm whether this hybrid role can be done fully remotely.");
      reductions.push("work style was reduced because the role is hybrid while you asked for remote");
      raw -= 0.28;
      cap = Math.min(cap, 82);
    } else if (!isRemote && job.remoteCompatible) {
      missingConfirmations.push("Confirm whether remote-compatible means fully remote for this role.");
      reductions.push("remote compatibility needs confirmation");
      raw -= 0.12;
      cap = Math.min(cap, 88);
    }
  }

  if (constraints.noTravel) {
    if (job.requiresTravel) {
      flags.push("May require travel.");
      reductions.push("travel requirement conflicts with your no-travel preference");
      raw -= 0.45;
      cap = Math.min(cap, 70);
    }

    if (isOnSite && constraints.preferredLocations.length && !jobMatchesAnyLocation(job, constraints.preferredLocations)) {
      flags.push("On-site location may conflict with your travel constraint.");
      reductions.push("on-site location may require travel outside your stated area");
      raw -= 0.28;
      cap = Math.min(cap, 78);
    }
  }

  if (constraints.hardLocations.length && !isRemote && !jobMatchesAnyLocation(job, constraints.hardLocations)) {
    flags.push("Location does not match stated requirement.");
    reductions.push("location does not match your stated requirement");
    raw -= 0.5;
    cap = Math.min(cap, 72);
  }

  if (constraints.sponsorshipNeeded && !/sponsorship|visa/i.test(searchText)) {
    missingConfirmations.push("Check employer work eligibility or sponsorship requirements.");
    reductions.push("sponsorship or work eligibility is not confirmed");
    raw -= 0.12;
    cap = Math.min(cap, 88);
  }

  return {
    raw: Math.max(0, raw),
    flags,
    missingConfirmations,
    reductions,
    cap,
    constraints
  };
}

function hardRequirementAssessment(job) {
  const flags = [];
  const missingConfirmations = [];
  const reductions = [];
  let raw = 1;
  let cap = 100;
  const stageText = profile.stage.toLowerCase();
  const profileText = `${profile.skills} ${profile.cvText} ${profile.extraRequirements} ${profile.workEligibility}`.toLowerCase();
  const constraints = userConstraintAssessment(job);

  if (job.requiresPhD) {
    if (!/\bphd\b|doctorate/.test(profileText)) {
      flags.push("PhD requirement is not matched by the current profile.");
      reductions.push("PhD requirement is not met");
      raw -= 0.55;
      cap = Math.min(cap, 58);
    }
  }

  const seniorYears = String(job.experienceRequired || "").match(/([3-9])\+?\s*(?:years|year)/i);
  if (seniorYears && /graduate|entry|student|career changer/.test(stageText)) {
    flags.push(`${job.experienceRequired} may be too senior for the selected career stage.`);
    reductions.push("experience requirement appears too senior");
    raw -= 0.35;
    cap = Math.min(cap, 66);
  }

  if (job.requiresPriorForensicExperience && !/forensic|casework|evidence|chain.?of.?custody|toxicology/.test(profileText)) {
    missingConfirmations.push("Direct forensic or casework experience may need confirmation.");
    reductions.push("direct forensic experience is not confirmed");
    raw -= 0.2;
    cap = Math.min(cap, 88);
  }

  if (job.requiresGCP && !/\bgcp\b|good clinical practice/.test(profileText)) {
    missingConfirmations.push("Check whether GCP training is required.");
    reductions.push("GCP training is not confirmed");
    raw -= 0.18;
    cap = Math.min(cap, 88);
  }

  if (job.requiresSQL && !/\bsql\b/.test(profileText)) {
    missingConfirmations.push("SQL may be required or preferred.");
    reductions.push("SQL is not confirmed");
    raw -= 0.12;
    cap = Math.min(cap, 90);
  }

  if (job.requiresPython && !/python|bioinformatics|coding/.test(profileText)) {
    missingConfirmations.push("Python or coding depth may need confirmation.");
    reductions.push("Python or coding depth is not confirmed");
    raw -= 0.16;
    cap = Math.min(cap, 88);
  }

  if (job.requiresLabExperience && !userHasLabSignal()) {
    missingConfirmations.push("Relevant lab experience may need confirmation.");
    reductions.push("lab experience is not confirmed");
    raw -= 0.15;
    cap = Math.min(cap, 90);
  }

  if (job.requiresDriving) {
    if (profile.drivingLicence === "No") {
      flags.push("Driving licence requirement is not met.");
      reductions.push("driving licence requirement is not met");
      raw -= 0.35;
      cap = Math.min(cap, 70);
    } else if (profile.drivingLicence === "Not specified") {
      missingConfirmations.push("Check whether you have the required driving licence.");
      reductions.push("driving licence is not confirmed");
      raw -= 0.12;
      cap = Math.min(cap, 90);
    }
  }

  if (job.requiresTravel) {
    if (profile.willingToTravel === "No") {
      flags.push("Travel requirement conflicts with your stated preference.");
      reductions.push("travel requirement conflicts with your preference");
      raw -= 0.25;
      cap = Math.min(cap, 76);
    } else if (profile.willingToTravel === "Limited" || profile.willingToTravel === "Not specified") {
      missingConfirmations.push("Travel expectations should be checked before applying.");
      reductions.push("travel expectations need confirmation");
      raw -= 0.1;
      cap = Math.min(cap, 91);
    }
  }

  if (job.requiresSecurityClearance && !/security clearance|police|government|clearance/.test(profileText)) {
    missingConfirmations.push("Security clearance or eligibility checks may apply.");
    reductions.push("security clearance eligibility needs confirmation");
    raw -= 0.08;
    cap = Math.min(cap, 92);
  }

  const gradeResult = degreeMeetsMinimum(job.minimumDegreeGrade);
  if (gradeResult === false) {
    flags.push(`Minimum degree grade ${job.minimumDegreeGrade} may not be met.`);
    reductions.push("minimum degree grade may not be met");
    raw -= 0.25;
    cap = Math.min(cap, 75);
  } else if (gradeResult === null) {
    missingConfirmations.push(`Check whether the ${job.minimumDegreeGrade} degree-grade requirement is met.`);
    reductions.push("degree grade requirement needs confirmation");
    raw -= 0.08;
    cap = Math.min(cap, 92);
  }

  if (/eligibility|right to work|visa|sponsorship|remote - international/i.test(jobSearchText(job)) && !profile.workEligibility.trim()) {
    missingConfirmations.push("Check employer work eligibility or visa requirements.");
    reductions.push("work eligibility or visa requirements need confirmation");
    raw -= 0.08;
    cap = Math.min(cap, 92);
  }

  raw = Math.min(raw, constraints.raw);

  return {
    raw: Math.max(0, raw),
    flags: [...flags, ...constraints.flags],
    missingConfirmations: [...missingConfirmations, ...constraints.missingConfirmations],
    reductions: [...reductions, ...constraints.reductions],
    cap: Math.min(cap, constraints.cap),
    constraints: constraints.constraints
  };
}

function scoreJob(job) {
  const searchableJob = jobSearchText(job);
  const searchableJobLower = searchableJob.toLowerCase();
  const roleOverlap = overlapCount(searchableJob, profile.role);
  const profileSignal = `${profile.skills} ${profile.cvText} ${profile.priorities} ${profile.languages}`;
  const skillOverlap = overlapCount(searchableJob, profileSignal);
  const requirementText = profile.extraRequirements.toLowerCase();
  const priorityText = `${profile.priorities} ${profile.extraRequirements}`.toLowerCase();
  const stageText = profile.stage.toLowerCase();
  const locationText = profile.location.toLowerCase();
  const workStyleText = profile.workStyle.toLowerCase();
  const domains = interpretTargetDomains();
  const category = categoryMatch(job, domains);
  const weights = scoringWeights[profile.searchMood] || scoringWeights.Steady;
  const entryFriendly = job.earlyCareerFriendly || /graduate|junior|entry|early|training|supportive|clear/i.test(searchableJob);
  const flexible = job.remoteCompatible || /remote|hybrid|flexible/i.test(searchableJob);
  const hard = hardRequirementAssessment(job);
  const constraints = hard.constraints || userConstraintProfile();
  const sameLocation = ["birmingham", "london", "manchester", "leeds", "cambridge", "oxford", "remote"]
    .some((place) => locationText.includes(place) && searchableJobLower.includes(place));
  const workStyleMatch =
    (workStyleText.includes("remote") && /remote/i.test(searchableJob)) ||
    (workStyleText.includes("hybrid") && /hybrid/i.test(searchableJob)) ||
    (workStyleText.includes("on-site") && /on-site/i.test(searchableJob)) ||
    workStyleText.includes("flexible");
  const remoteFitRaw = constraints.remoteRequired
    ? (/remote/i.test(searchableJob) ? 1 : job.remoteCompatible ? 0.55 : /hybrid/i.test(searchableJob) ? 0.28 : 0)
    : constraints.remotePreferred
      ? (/remote/i.test(searchableJob) ? 1 : /hybrid/i.test(searchableJob) ? 0.7 : 0.25)
      : null;
  const educationRaw = /biomedical|science|clinical|health|research/.test(`${profile.cvText} ${profile.skills}`.toLowerCase()) && /science|health|research|clinical|biomedical|lab|evidence/i.test(searchableJob) ? 1 : category.strength;
  const priorityRaw = [
    priorityText.includes("training") && job.trainingProvided,
    priorityText.includes("support") && entryFriendly,
    priorityText.includes("remote") && /remote/i.test(searchableJob),
    priorityText.includes("hybrid") && /hybrid/i.test(searchableJob),
    priorityText.includes("biomedical") && /biomedical|research|health|lab/i.test(searchableJob),
    requirementText && overlapCount(searchableJob, requirementText) > 0
  ].filter(Boolean).length / 4;
  const roleRaw = Math.min(1, category.strength * 0.72 + Math.min(roleOverlap, 5) * 0.08);
  const skillRaw = Math.min(1, skillOverlap / 8);
  const levelRaw = Math.max(0, Math.min(1,
    (entryFriendly ? 0.72 : 0.35) +
    (job.trainingProvided ? 0.16 : 0) -
    (job.seniorityScore >= 3 ? 0.42 : 0) -
    (/senior|mid-level/i.test(job.level) && /graduate|entry|student/.test(stageText) ? 0.26 : 0)
  ));
  const locationRaw = Math.min(1, Math.min(
    remoteFitRaw ?? 1,
    (sameLocation ? 0.5 : 0.18) + (workStyleMatch ? 0.4 : 0) + (flexible ? 0.1 : 0)
  ));

  const breakdown = {
    roleRelevance: componentScore(roleRaw, weights.roleRelevance),
    skillOverlap: componentScore(skillRaw, weights.skillOverlap),
    levelFit: componentScore(levelRaw, weights.levelFit),
    locationWorkStyle: componentScore(locationRaw, weights.locationWorkStyle),
    educationSectorFit: componentScore(educationRaw, weights.educationSectorFit),
    hardRequirementFit: componentScore(hard.raw, weights.hardRequirementFit),
    careerPriorityFit: componentScore(priorityRaw, weights.careerPriorityFit),
    modeAdjustment: 0,
    flags: [...hard.flags],
    missingConfirmations: [...hard.missingConfirmations],
    reductions: [...hard.reductions],
    weights,
    relationship: category.relationship,
    targetDomains: domains
  };

  if (profile.searchMood === "Steady") {
    breakdown.modeAdjustment = category.relationship === "direct" ? 8 : category.relationship === "adjacent" ? -7 : -16;
  } else if (profile.searchMood === "Exploring") {
    breakdown.modeAdjustment = category.relationship === "adjacent" ? 10 : category.relationship === "direct" ? 3 : -8;
    if (/operations|coordinator|documentation|evidence|project|research/i.test(searchableJob)) breakdown.modeAdjustment += 3;
  } else {
    breakdown.modeAdjustment = 0;
    if (entryFriendly) breakdown.modeAdjustment += 8;
    if (job.trainingProvided) breakdown.modeAdjustment += 6;
    if (clearRequirementCount(job) >= 3) breakdown.modeAdjustment += 3;
    if (job.seniorityScore >= 3 || job.requiresPhD) breakdown.modeAdjustment -= 18;
    if (category.relationship === "low") breakdown.modeAdjustment -= 6;
  }

  let total = breakdown.roleRelevance +
    breakdown.skillOverlap +
    breakdown.levelFit +
    breakdown.locationWorkStyle +
    breakdown.educationSectorFit +
    breakdown.hardRequirementFit +
    breakdown.careerPriorityFit +
    breakdown.modeAdjustment;

  if (job.status !== "active") total -= 40;
  if (job.category?.includes("Deliberate lower-priority")) total -= 8;
  if (breakdown.flags.length) total -= 8;
  total = Math.max(45, Math.min(hard.cap, Math.min(98, Math.round(total))));

  return {
    ...breakdown,
    total
  };
}

function fitLabel(score, breakdown = {}) {
  const hasMissing = breakdown.missingConfirmations?.length;
  const hasFlags = breakdown.flags?.length;
  let label = "Low fit";

  if (score >= 90) label = "Strong fit";
  else if (score >= 80) label = "Good fit";
  else if (score >= 70) label = "Possible fit";
  else if (score >= 60) label = "Exploratory fit";

  if (hasFlags && score < 80) return `${label} - check requirement`;
  if (hasMissing && score >= 70) return `${label} - needs confirmation`;
  return label;
}

function scoreBreakdownText(breakdown) {
  const weights = breakdown.weights || scoringWeights[profile.searchMood] || scoringWeights.Steady;
  return `Score breakdown: role ${breakdown.roleRelevance}/${weights.roleRelevance}, skills ${breakdown.skillOverlap}/${weights.skillOverlap}, level ${breakdown.levelFit}/${weights.levelFit}, location/work style ${breakdown.locationWorkStyle}/${weights.locationWorkStyle}, requirements ${breakdown.hardRequirementFit}/${weights.hardRequirementFit}.`;
}

function scoreReasonText(job, breakdown) {
  const strengths = [];

  if (breakdown.roleRelevance >= (breakdown.weights.roleRelevance * 0.75)) strengths.push("strong role direction");
  if (breakdown.skillOverlap >= (breakdown.weights.skillOverlap * 0.65)) strengths.push("good skill overlap");
  if (breakdown.levelFit >= (breakdown.weights.levelFit * 0.7)) strengths.push("career-stage fit");
  if (breakdown.locationWorkStyle >= (breakdown.weights.locationWorkStyle * 0.7)) strengths.push("location/work-style fit");
  if (breakdown.hardRequirementFit >= (breakdown.weights.hardRequirementFit * 0.8)) strengths.push("no major confirmed hard-requirement conflict");

  const base = strengths.length
    ? `Why ${breakdown.total}%? ORBY scored this highly for ${sentenceFromList(strengths.slice(0, 3), "several matching signals")}.`
    : `Why ${breakdown.total}%? This role has some relevant signals, but ORBY found trade-offs in the match.`;
  const reductions = breakdown.reductions?.length
    ? ` The score was reduced because ${sentenceFromList(Array.from(new Set(breakdown.reductions)).slice(0, 2), "some requirements need checking")}.`
    : " No major score-reducing conflict was detected.";

  return `${base}${reductions}`;
}

function explanationFor(job, breakdown) {
  const signal = structuredProfile || buildStructuredProfile();
  const style = job.workStyle || job.style || "";
  const moodLines = {
    Steady: `Because you chose Steady, ORBY prioritized roles close to your stated target. This ranks as a ${breakdown.relationship} category match for ${signal.targetRole}.`,
    Exploring: `Because you chose Exploring, ORBY allowed adjacent pathways and weighted transferable skills more heavily. This role sits in ${job.category}.`,
    Uncertain: "Because you chose Uncertain, ORBY prioritized approachable roles with clearer requirements, entry-level fit, training signals, and lower barriers."
  };
  const notes = [moodLines[profile.searchMood] || moodLines.Steady];

  notes.push(scoreReasonText(job, breakdown));
  notes.push(scoreBreakdownText(breakdown));

  if (signal.extraRequirements && !signal.extraRequirements.startsWith("No extra")) {
    const extraNote = breakdown.flags.length || breakdown.missingConfirmations.length
      ? "ORBY checked your extra requirements and flagged the relevant issues below."
      : style.toLowerCase().includes("remote") || style.toLowerCase().includes("hybrid")
        ? "This role appears compatible with your flexible-work preferences."
        : "No specific extra-requirement conflict was detected, but review the role details before applying.";
    notes.push(`Requirement note: ${extraNote}`);
  }

  if (signal.languages && !signal.languages.startsWith("No languages")) {
    notes.push("Your language background could strengthen your fit where communication, remote teams, or stakeholder work matter.");
  }

  if (breakdown.missingConfirmations.length) {
    notes.push(`Check: ${breakdown.missingConfirmations.slice(0, 2).join(" ")}`);
  }

  if (breakdown.flags.length) {
    notes.push(`Potential gap: ${breakdown.flags.slice(0, 2).join(" ")}`);
  }

  return {
    score: breakdown.total,
    scoreBreakdown: breakdown,
    fit: fitLabel(breakdown.total, breakdown),
    why: notes.join(" ")
  };
}

function rankedJobs() {
  return jobs
    .filter((job) => job.status === "active")
    .map((job) => {
      const breakdown = scoreJob(job);
      return { ...job, ...explanationFor(job, breakdown) };
    })
    .sort((a, b) => b.score - a.score);
}

function curationRuleForMode() {
  return CURATION_RULES[profile.searchMood] || CURATION_RULES.Steady;
}

function addUniqueJobs(target, source, maxCount) {
  source.forEach((job) => {
    if (target.length < maxCount && !target.some((item) => item.id === job.id)) {
      target.push(job);
    }
  });
  return target;
}

function isWorthShowing(job, threshold) {
  const hasHardConflict = job.scoreBreakdown?.flags?.some((flag) =>
    /remote requirement|location does not match|driving licence requirement is not met|travel requirement conflicts|PhD requirement/.test(flag)
  );

  return job.score >= threshold && !hasHardConflict;
}

function isSafeStarterJob(job) {
  const level = String(job.level || "").toLowerCase();
  const searchText = jobSearchText(job).toLowerCase();
  const hasHardRisk = job.requiresPhD || job.seniorityScore >= 3 || job.scoreBreakdown?.flags?.length;
  const supportiveRole = /assistant|support|coordinator|administrator|documentation|programme|trainee|entry|graduate|junior|technician/.test(searchText);

  return !hasHardRisk &&
    (job.earlyCareerFriendly || /graduate|entry|career-change|early/.test(level)) &&
    (job.trainingProvided || supportiveRole);
}

function curatedJobsForMode(ranked = rankedJobs()) {
  const rule = curationRuleForMode();
  const qualified = ranked.filter((job) => isWorthShowing(job, rule.threshold));
  const fallback = ranked.filter((job) => !qualified.some((item) => item.id === job.id) && isWorthShowing(job, rule.fallbackThreshold));
  const direct = qualified.filter((job) => job.scoreBreakdown?.relationship === "direct");
  const adjacent = qualified.filter((job) => job.scoreBreakdown?.relationship === "adjacent" || job.category?.includes("Adjacent"));
  const safeStarters = qualified.filter(isSafeStarterJob);
  const fallbackDirect = fallback.filter((job) => job.scoreBreakdown?.relationship === "direct");
  const fallbackSafe = fallback.filter(isSafeStarterJob);
  const selected = [];

  if (profile.searchMood === "Steady") {
    addUniqueJobs(selected, direct, rule.maximum);
    if (selected.length < rule.minimum) addUniqueJobs(selected, fallbackDirect, rule.maximum);
    return selected;
  }

  if (profile.searchMood === "Exploring") {
    addUniqueJobs(selected, direct, Math.min(4, rule.maximum));
    addUniqueJobs(selected, adjacent, rule.maximum);
    addUniqueJobs(selected, qualified, rule.maximum);
    if (selected.length < rule.minimum) addUniqueJobs(selected, [...fallbackDirect, ...fallbackSafe], rule.maximum);
    return selected;
  }

  if (profile.searchMood === "Uncertain") {
    addUniqueJobs(selected, direct.filter(isSafeStarterJob), Math.min(3, rule.maximum));
    addUniqueJobs(selected, direct, Math.min(3, rule.maximum));
    addUniqueJobs(selected, safeStarters, rule.maximum);
    addUniqueJobs(selected, adjacent.filter(isSafeStarterJob), rule.maximum);
    if (selected.length < rule.minimum) addUniqueJobs(selected, fallbackSafe, rule.maximum);
    return selected;
  }

  return qualified.slice(0, rule.maximum);
}

function resultPacketCopy(count = curatedJobsForMode().length) {
  if (profile.searchMood === "Uncertain") return `${count} guided ${count === 1 ? "opportunity" : "opportunities"}`;
  if (profile.searchMood === "Steady") return `${count} focused ${count === 1 ? "opportunity" : "opportunities"}`;
  return `${count} aligned ${count === 1 ? "opportunity" : "opportunities"}`;
}

function updateResultPacketCopy(count) {
  const packetTitle = resultPacket.querySelector("strong");
  if (packetTitle) packetTitle.textContent = resultPacketCopy(count);
}

function jobPoolSummaryCopy(totalCount, inactiveCount, selectedCount) {
  if (profile.searchMood === "Exploring") {
    return `ORBY searched ${totalCount} local demo roles, filtered inactive listings, and found ${selectedCount} relevant ${selectedCount === 1 ? "match" : "matches"}, including adjacent opportunities worth exploring.`;
  }

  if (profile.searchMood === "Uncertain") {
    return `ORBY searched ${totalCount} local demo roles, filtered inactive listings, and found ${selectedCount} guided ${selectedCount === 1 ? "match" : "matches"}, prioritising safer starting points.`;
  }

  return `ORBY searched ${totalCount} local demo roles, filtered inactive listings, and found ${selectedCount} strong focused ${selectedCount === 1 ? "match" : "matches"}.`;
}

function renderJobs() {
  const ranked = rankedJobs();
  const selectedJobs = curatedJobsForMode(ranked);
  const statusCounts = jobStatusCounts();
  const activeCount = statusCounts.active || 0;
  const testCount = jobs.length - activeCount;

  if (selectedMatchCount) {
    selectedMatchCount.textContent = `${selectedJobs.length} selected`;
  }

  if (jobPoolSummary) {
    jobPoolSummary.textContent = jobPoolSummaryCopy(jobs.length, testCount, selectedJobs.length);
  }

  updateResultPacketCopy(selectedJobs.length);

  jobGrid.innerHTML = selectedJobs.map((job) => {
    const currentStatus = jobStatuses[job.id] || "";
    const style = job.workStyle || job.style || "";
    return `
    <article class="job-card ${escapeHtml(currentStatus)}" data-job-id="${escapeHtml(job.id)}">
      <div class="job-topline">
        <div>
          <h3>${escapeHtml(job.title)}</h3>
          <div class="job-meta">${escapeHtml(job.company)} - ${escapeHtml(job.location)} - ${escapeHtml(style)}</div>
        </div>
        <div class="match-score">${job.score}%</div>
      </div>
      <div class="job-salary">${escapeHtml(job.salary)}</div>
      <span class="fit-label">${escapeHtml(job.fit)}</span>
      <p>${escapeHtml(job.summary)}</p>
      <div class="why">${escapeHtml(job.why)}</div>
      <div class="job-note">${escapeHtml(job.note)}</div>
      <div class="job-actions">
        <button type="button" class="${currentStatus === "saved" ? "active" : ""}" data-action="save">Save</button>
        <button type="button" class="${currentStatus === "dismissed" ? "active" : ""}" data-action="dismiss">Dismiss</button>
        <button type="button" class="${currentStatus === "prep" ? "active" : ""}" data-action="prep">Prep</button>
      </div>
    </article>
  `;
  }).join("");
}

function statusFromAction(action) {
  if (action === "save") return "saved";
  if (action === "dismiss") return "dismissed";
  if (action === "prep") return "prep";
  return "";
}

function compactMemoryReason(job) {
  const reason = String(job.why || job.summary || "")
    .replace(/Score breakdown:.*$/i, "")
    .replace(/Requirement note:.*$/i, "")
    .trim();
  const sentences = reason.split(". ").filter(Boolean);
  const compact = sentences.slice(0, 2).join(". ");
  if (!compact) return "ORBY recommended this role from the current local match set.";
  return compact.endsWith(".") ? compact : `${compact}.`;
}

function applicationStageLabel(jobId) {
  const stage = applicationStages[jobId] || "preparing";
  const labels = {
    preparing: "Preparing",
    applied: "Applied",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected"
  };

  return labels[stage] || "Preparing";
}

function dashboardJobCard(job, status) {
  const style = job.workStyle || job.style || "";
  const stage = applicationStages[job.id] || "preparing";
  const statusLabel = status === "prep" ? applicationStageLabel(job.id) : "Saved";
  const actions = status === "saved"
    ? `
      <button type="button" data-dashboard-action="prep">Move to Prep</button>
      <button type="button" data-dashboard-action="dismiss">Dismiss</button>
    `
    : stage === "applied"
      ? `
        <button type="button" data-dashboard-action="interview">Interview</button>
        <button type="button" data-dashboard-action="rejected">Rejected</button>
        <button type="button" data-dashboard-action="saved">Move back to Saved</button>
      `
      : stage === "interview"
        ? `
          <button type="button" data-dashboard-action="offer">Mark Offer</button>
          <button type="button" data-dashboard-action="rejected">Rejected</button>
          <button type="button" data-dashboard-action="saved">Move back to Saved</button>
        `
        : `
          <button type="button" data-dashboard-action="applied">Mark Applied</button>
          <button type="button" data-dashboard-action="saved">Move back to Saved</button>
          <button type="button" data-dashboard-action="dismiss">Dismiss</button>
        `;

  return `
    <article class="memory-job ${escapeHtml(status)}" data-job-id="${escapeHtml(job.id)}">
      <div class="memory-job-topline">
        <div>
          <h5>${escapeHtml(job.title)}</h5>
          <p>${escapeHtml(job.company)} - ${escapeHtml(job.location)} - ${escapeHtml(style)}</p>
        </div>
        <span>${escapeHtml(job.score)}%</span>
      </div>
      <div class="memory-job-meta">
        <span>${escapeHtml(job.salary)}</span>
        <span>${escapeHtml(job.fit)}</span>
        <span>${escapeHtml(statusLabel)}</span>
      </div>
      <p class="memory-reason">${escapeHtml(compactMemoryReason(job))}</p>
      <div class="memory-actions">
        ${actions}
      </div>
    </article>
  `;
}

function closedJobCard(job, outcome) {
  const style = job.workStyle || job.style || "";
  const outcomeLabel = outcome === "offer" ? "Offer" : "Rejected";

  return `
    <article class="memory-job closed ${escapeHtml(outcome)}" data-job-id="${escapeHtml(job.id)}">
      <div class="memory-job-topline">
        <div>
          <h5>${escapeHtml(job.title)}</h5>
          <p>${escapeHtml(job.company)} - ${escapeHtml(job.location)} - ${escapeHtml(style)}</p>
        </div>
        <span>${escapeHtml(job.score)}%</span>
      </div>
      <div class="memory-job-meta">
        <span>${escapeHtml(job.salary)}</span>
        <span>${escapeHtml(job.fit)}</span>
        <span>${escapeHtml(outcomeLabel)}</span>
      </div>
    </article>
  `;
}

function renderMemoryWorkspace() {
  const rankedById = rankedJobs().reduce((map, job) => {
    map[job.id] = job;
    return map;
  }, {});
  const activeMemoryTotals = {
    saved: 0,
    prep: 0,
    closed: 0
  };

  Object.entries(memoryGroups).forEach(([status, group]) => {
    if (!group.list) return;

    const statusJobs = Object.entries(jobStatuses)
      .filter(([, currentStatus]) => currentStatus === status)
      .map(([jobId]) => rankedById[jobId])
      .filter(Boolean)
      .filter((job) => !(status === "prep" && ["offer", "rejected"].includes(applicationStages[job.id])));

    activeMemoryTotals[status] = statusJobs.length;

    group.list.innerHTML = statusJobs.length
      ? statusJobs.map((job) => dashboardJobCard(job, status)).join("")
      : `<p class="memory-empty">${escapeHtml(group.empty)}</p>`;
  });

  const offerJobs = Object.entries(applicationStages)
    .filter(([, stage]) => stage === "offer")
    .map(([jobId]) => rankedById[jobId])
    .filter(Boolean);
  const rejectedJobs = Object.entries(applicationStages)
    .filter(([, stage]) => stage === "rejected")
    .map(([jobId]) => rankedById[jobId])
    .filter(Boolean);

  activeMemoryTotals.closed = offerJobs.length + rejectedJobs.length;

  if (offerMemoryList) {
    offerMemoryList.innerHTML = offerJobs.length
      ? offerJobs.map((job) => closedJobCard(job, "offer")).join("")
      : '<p class="memory-empty">No offers recorded yet.</p>';
  }

  if (rejectedMemoryList) {
    rejectedMemoryList.innerHTML = rejectedJobs.length
      ? rejectedJobs.map((job) => closedJobCard(job, "rejected")).join("")
      : '<p class="memory-empty">No rejected applications recorded yet.</p>';
  }

  if (applicationMemoryTotal) {
    const activeTotal = activeMemoryTotals.saved + activeMemoryTotals.prep;
    applicationMemoryTotal.textContent = `${activeTotal} active ${activeTotal === 1 ? "role" : "roles"}`;
  }

  if (applicationDashboardEmpty) {
    applicationDashboardEmpty.hidden = Boolean(activeMemoryTotals.saved || activeMemoryTotals.prep || activeMemoryTotals.closed);
  }
}

function updateJobStatusControls(jobId, status) {
  document.querySelectorAll("[data-job-id]").forEach((item) => {
    if (item.dataset.jobId !== jobId) return;

    item.classList.remove("saved", "dismissed", "prep");
    item.classList.add(status);
    item.querySelectorAll("[data-action]").forEach((button) => {
      button.classList.toggle("active", statusFromAction(button.dataset.action) === status);
    });
  });
}

function setJobStatus(jobId, status) {
  if (!jobId || !status || jobStatuses[jobId] === status) {
    return;
  }

  jobStatuses[jobId] = status;
  if (status === "saved") {
    delete applicationStages[jobId];
  }
  if (status === "prep" && (!applicationStages[jobId] || ["offer", "rejected"].includes(applicationStages[jobId]))) {
    applicationStages[jobId] = "preparing";
  }
  if (status === "dismissed" && !["offer", "rejected"].includes(applicationStages[jobId])) {
    delete applicationStages[jobId];
  }
  saveApplicationMemory();
  updateJobStatusControls(jobId, status);
  updateTracker();
}

function setApplicationStage(jobId, stage) {
  if (!jobId) return;

  if (stage === "offer" || stage === "rejected") {
    jobStatuses[jobId] = "dismissed";
    applicationStages[jobId] = stage;
  } else {
    jobStatuses[jobId] = "prep";
    applicationStages[jobId] = stage;
  }

  saveApplicationMemory();
  updateJobStatusControls(jobId, jobStatuses[jobId]);
  updateTracker();
}

function dismissFromDashboard(jobId) {
  if (!jobId) return;

  const shouldDismiss = window.confirm("Are you sure you want to dismiss this role?");
  if (shouldDismiss) {
    setJobStatus(jobId, "dismissed");
  }
}

function updateTracker() {
  const trackerTotals = Object.values(jobStatuses).reduce((totals, status) => {
    if (status) totals[status] += 1;
    return totals;
  }, { saved: 0, dismissed: 0, prep: 0 });

  savedCount.textContent = trackerTotals.saved;
  dismissedCount.textContent = trackerTotals.dismissed;
  prepCount.textContent = trackerTotals.prep;

  if (trackerTotals.saved || trackerTotals.dismissed || trackerTotals.prep) {
    trackerText.textContent = "ORBY uses these choices to understand what to prioritise next in this demo. This stays local to the session.";
  }

  renderMemoryWorkspace();
}

document.addEventListener("click", (event) => {
  const nextButton = event.target.closest("[data-next]");
  const stateButton = event.target.closest("[data-state]");
  const jobAction = event.target.closest("[data-action]");
  const dashboardAction = event.target.closest("[data-dashboard-action]");

  if (nextButton) {
    showSection(nextButton.dataset.next);
  }

  if (stateButton) {
    setState(stateButton.dataset.state);
  }

  if (jobAction) {
    const statusItem = jobAction.closest("[data-job-id]");
    setJobStatus(statusItem?.dataset.jobId, statusFromAction(jobAction.dataset.action));
  }

  if (dashboardAction) {
    const statusItem = dashboardAction.closest("[data-job-id]");
    const jobId = statusItem?.dataset.jobId;
    const action = dashboardAction.dataset.dashboardAction;

    if (action === "saved") setJobStatus(jobId, "saved");
    if (action === "prep") setJobStatus(jobId, "prep");
    if (action === "dismiss") dismissFromDashboard(jobId);
    if (action === "applied") setApplicationStage(jobId, "applied");
    if (action === "interview") setApplicationStage(jobId, "interview");
    if (action === "offer") setApplicationStage(jobId, "offer");
    if (action === "rejected") setApplicationStage(jobId, "rejected");
  }
});

moodCards.forEach((card) => {
  card.addEventListener("click", () => {
    moodCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    profile.searchMood = card.dataset.mood;
  });
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  collectProfile();
  buildStructuredProfile();
  showSection("collectProfileSignals");
  runProfileCollection();
});

cvFileInput.addEventListener("change", () => {
  const file = cvFileInput.files?.[0];

  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".txt") && file.type !== "text/plain") {
    cvStatus.textContent = "For Stage 1, please upload a plain .txt file or paste CV text below.";
    cvFileInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    cvTextInput.value = String(reader.result || "");
    profile.cvSource = file.name;
    cvStatus.textContent = `Loaded ${file.name} locally. Nothing was uploaded.`;
  });
  reader.addEventListener("error", () => {
    cvStatus.textContent = "Orby could not read that file locally. Please paste the CV text instead.";
  });
  reader.readAsText(file);
});

useDemoCv.addEventListener("click", () => {
  cvTextInput.value = demoCv;
  profile.cvSource = "Demo CV";
  cvStatus.textContent = "Demo CV added. You can edit it before analysis.";
});

editProfile.addEventListener("click", () => {
  showSection("profile");
});

function runSearchJourney() {
  resultPacket.hidden = true;
  journeyProgress.style.width = "0%";
  showSection("searchJourney");

  const steps = [
    {
      delay: 200,
      state: "searching",
      width: "38%",
      title: "ORBY is scanning the market.",
      text: `${profile.searchMood === "Steady" ? "Searching close-fit roles around your stated target." : profile.searchMood === "Exploring" ? "Scanning adjacent opportunities connected to your transferable skills." : "Looking for safer, clearer starting points with support signals."}`
    },
    {
      delay: 3000,
      state: "match",
      width: "78%",
      title: "ORBY found promising signals.",
      text: "A few opportunities feel aligned enough to bring back, with noisy matches filtered away."
    },
    {
      delay: 4600,
      state: "returning",
      width: "100%",
      title: "ORBY is returning with care.",
      text: "Your small set of aligned opportunities is ready."
    }
  ];

  steps.forEach((step, index) => {
    window.setTimeout(() => {
      setState(step.state);
      journeyProgress.style.width = step.width;
      journeyTitle.textContent = step.title;
      journeyStatus.textContent = step.text;

      if (index === steps.length - 1) {
        renderJobs();
        window.setTimeout(() => {
          resultPacket.hidden = false;
        }, 1200);
      }
    }, step.delay);
  });
}

startSearch.addEventListener("click", () => {
  runSearchJourney();
});

resultPacket.addEventListener("click", () => {
  showSection("dashboard");
});

loadApplicationMemory();
renderJobs();
updateTracker();
setState("calm");
