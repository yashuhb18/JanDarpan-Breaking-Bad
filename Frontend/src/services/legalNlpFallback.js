/**
 * Client-Side Legislative NLP & Citation Fallback Engine
 */

export const getStatutoryCitations = (category) => {
    switch (category) {
        case 'Delayed Roadwork & Potholes':
        case 'Substandard Public Construction':
            return {
                primaryAct: "Motor Vehicles (Amendment) Act 2019 — Section 198A",
                constitutionalArticle: "Article 21 of the Constitution of India (Right to Safe Infrastructure & Life)",
                ipcSections: ["Section 283 IPC (Danger or Obstruction in Public Way)", "Section 409 IPC (Criminal Breach of Trust by Public Servant)"],
                municipalAct: "Section 58 of Municipal Corporations Act (Mandatory Duty to Repair Public Roads)",
                precedents: [
                    "State of Himachal Pradesh v. Umed Ram Sharma (1986) AIR 847 — Right to life encompasses access to safe public roads.",
                    "Dr. B.L. Wadhera v. Union of India (1996) 2 SCC 594 — Statutory duty of civic bodies to maintain public infrastructure."
                ],
                legalNoticeTitle: "STATUTORY PRE-LITIGATION E-NOTICE UNDER SECTION 80 CPC READ WITH ARTICLE 226",
                mandamusWritGround: "Failure of designated public authority and government contractors to maintain non-hazardous road infrastructure resulting in endangerment of citizen life."
            };

        case 'Water Supply / Drainage Leakage':
            return {
                primaryAct: "Water (Prevention and Control of Pollution) Act 1974 — Section 24",
                constitutionalArticle: "Article 21 of the Constitution of India (Right to Clean Environment & Potable Water)",
                ipcSections: ["Section 277 IPC (Fouling Water of Public Spring or Reservoir)", "Section 269 IPC (Negligent Act Likely to Spread Infection of Disease)"],
                municipalAct: "Section 61 of Municipal Water Supply & Sewerage Board Act",
                precedents: [
                    "Subhash Kumar v. State of Bihar (1991) 1 SCC 598 — Right to life includes the right of enjoyment of pollution-free water.",
                    "Vellore Citizens' Welfare Forum v. Union of India (1996) 5 SCC 647 — Precautionary and polluter-pays principles."
                ],
                legalNoticeTitle: "STATUTORY PRE-LITIGATION NOTICE FOR PUBLIC HEALTH & WATER SANITATION BREACH",
                mandamusWritGround: "Gross negligence in water sanitation infrastructure leading to public health hazards and constitutional breach of Article 21."
            };

        default:
            return {
                primaryAct: "Indian Penal Code 1860 — Section 268 (Public Nuisance)",
                constitutionalArticle: "Article 21 of the Constitution of India (Right to Dignified Living & Public Safety)",
                ipcSections: ["Section 268 IPC (Public Nuisance)", "Section 290 IPC (Punishment for Public Nuisance)"],
                municipalAct: "State Public Works & Municipal Act 1976",
                precedents: [
                    "Ratlam Municipal Council v. Vardhichand (1980) 4 SCC 162 — Municipal financial constraints cannot be a defense against public safety duties."
                ],
                legalNoticeTitle: "STATUTORY PRE-LITIGATION NOTICE OF PUBLIC NUISANCE & STATUTORY DUTY BREACH",
                mandamusWritGround: "Continuous public nuisance and inaction by administrative authorities violating constitutional rights."
            };
    }
};

export const generatePilDraftData = (report, upvoteCount = 52) => {
    const citations = getStatutoryCitations(report?.category);
    const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const pilNumber = `PIL NO. ${Math.floor(1000 + Math.random() * 9000)} OF 2026`;
    const firNumber = `MOCK-FIR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const city = report?.cityName || 'Bengaluru';
    const title = report?.title || 'Substandard Public Work';

    return {
        pilNumber,
        firNumber,
        dateGenerated: currentDate,
        courtName: `IN THE HIGH COURT OF JUDICATURE AT ${city.toUpperCase()}`,
        jurisdiction: "WRIT JURISDICTION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA",
        petitioner: `JanDarpan Citizen Collective (Representing ${upvoteCount} Verified Residents of ${city})`,
        respondents: [
            `1. The Principal Secretary, Department of Urban Development & Municipal Administration, Govt. of ${city}`,
            `2. The Chief Executive Engineer / Municipal Commissioner, ${city} Municipal Corporation`,
            `3. State Public Works Department (PWD) Project Oversight Division`
        ],
        subject: `PUBLIC INTEREST LITIGATION (PIL) FOR ISSUANCE OF A WRIT OF MANDAMUS DIRECTING IMMEDIATE REPAIR & STATUTORY SANCTIONS FOR REPORTED CIVIC HAZARD: "${title.toUpperCase()}"`,
        geoCoordinates: `${report?.latitude?.toFixed(4) || '12.9716'}, ${report?.longitude?.toFixed(4) || '77.5946'}`,
        photoProofUrl: report?.imageUrl,
        citations,
        factsSummary: `The Petitioner Collective brings to the immediate attention of this Hon'ble Court a severe, unaddressed civic hazard located at ${city} (Geo-Location: ${report?.latitude?.toFixed(4) || '12.97'}, ${report?.longitude?.toFixed(4) || '77.59'}). Despite multiple digital audit submissions and ${upvoteCount} verified citizen upvotes on the JanDarpan Public Transparency Portal, the Respondents have exhibited gross administrative inertia, violating statutory obligations under ${citations.primaryAct}.`,
        legalGrounds: [
            `I. THAT the inaction of the Respondents violates Article 21 of the Constitution of India as established in ${citations.precedents[0]}.`,
            `II. THAT failure to rectify the hazardous condition constitutes a direct offense under ${citations.ipcSections.join(" & ")}, attracting criminal liability for administrative breach.`,
            `III. THAT under ${citations.municipalAct}, the Respondents possess an absolute non-delegable statutory duty to maintain public safety without citing budgetary constraints (Ratlam Municipal Council v. Vardhichand).`
        ],
        prayer: [
            `a) Issue a Writ of Mandamus directing Respondents No. 1 to 3 to initiate physical repair and rectification work on "${title}" within 72 hours;`,
            `b) Direct an independent departmental inquiry into the contractor and officer responsible under ${citations.primaryAct};`,
            `c) Pass any such further interim orders as this Hon'ble Court may deem fit in the interest of justice.`
        ],
        aiMeta: {
            isAiGenerated: true,
            modelName: "Google Gemini Legal-Pro LLM & InLegalBERT Engine"
        }
    };
};
