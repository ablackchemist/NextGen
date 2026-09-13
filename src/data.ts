import { RoadmapData } from './components/Roadmap3D';

export const roadmapDataMock: Record<string, RoadmapData> = {
  "Tier 1": {
    "tier": "Tier 1",
    "roadmap_title": "High School STEM Foundations",
    "milestones": [
      {
        "node_id": 1,
        "status": "Current",
        "title": "Science Fair Participant",
        "description": "Log an entry for your first high school STEM project and participate in the local NOBCChE science fair.",
        "type": "Core Quest",
        "xp_value": 100,
        "notebooklm_focus": "Upload your project logbook and research hypothesis for AI summarization."
      },
      {
        "node_id": 2,
        "status": "Locked",
        "title": "NextGen Community Event",
        "description": "Attend your first NOBCChE NextGen event and connect with college mentors.",
        "type": "Side Quest",
        "xp_value": 150,
        "notebooklm_focus": "Feed your session notes to organize networking contacts and key takeaways."
      },
      {
        "node_id": 3,
        "status": "Locked",
        "title": "College Readiness Portfolio",
        "description": "Finalize your STEM portfolio, complete with parent/educator reviews, ready for undergraduate applications.",
        "type": "Core Quest",
        "xp_value": 250,
        "notebooklm_focus": "Compile all your STEM activity reports into a single AI-generated college resume bullet point list."
      }
    ]
  },
  "Tier 2": {
    "tier": "Tier 2",
    "roadmap_title": "Undergraduate Technical Mastery",
    "milestones": [
      {
        "node_id": 1,
        "status": "Current",
        "title": "Lab Protocol Certification",
        "description": "Master and log at least 3 distinct laboratory or coding methodologies in your university coursework.",
        "type": "Core Quest",
        "xp_value": 100,
        "notebooklm_focus": "Upload lab manuals to generate step-by-step AI safety and procedure checklists."
      },
      {
        "node_id": 2,
        "status": "Locked",
        "title": "Summer Internship Secured",
        "description": "Apply for, land, and complete a summer research internship or REU.",
        "type": "Core Quest",
        "xp_value": 150,
        "notebooklm_focus": "Extract and store daily lab reflections to build your end-of-summer poster presentation."
      },
      {
        "node_id": 3,
        "status": "Locked",
        "title": "Chapter Leadership Track",
        "description": "Assume a leadership role within your local university NOBCChE chapter.",
        "type": "Side Quest",
        "xp_value": 250,
        "notebooklm_focus": "Organize meeting minutes and event plans into an executive summary."
      }
    ]
  },
  "Tier 3": {
    "tier": "Tier 3",
    "roadmap_title": "Graduate Research Specialization",
    "milestones": [
      {
        "node_id": 1,
        "status": "Current",
        "title": "Thesis/Dissertation Benchmarks",
        "description": "Establish your thesis committee and pass your comprehensive qualifying exams.",
        "type": "Core Quest",
        "xp_value": 100,
        "notebooklm_focus": "Upload literature review PDFs to generate an interconnected research synthesis."
      },
      {
        "node_id": 2,
        "status": "Locked",
        "title": "First Author Publication",
        "description": "Draft, submit, and successfully publish a manuscript in a peer-reviewed STEM journal.",
        "type": "Core Quest",
        "xp_value": 150,
        "notebooklm_focus": "Provide draft chapters to receive structural feedback and citation organization."
      },
      {
        "node_id": 3,
        "status": "Locked",
        "title": "National Conference Presentation",
        "description": "Deliver an oral or poster presentation at the NOBCChE National Conference.",
        "type": "Core Quest",
        "xp_value": 250,
        "notebooklm_focus": "Upload your presentation script to practice Q&A scenarios."
      }
    ]
  },
  "Tier 4": {
    "tier": "Tier 4",
    "roadmap_title": "Professional Leadership & Legacy",
    "milestones": [
      {
        "node_id": 1,
        "status": "Current",
        "title": "Mentorship Impact",
        "description": "Become an active mentor for early-career NOBCChE members and log 50 mentorship hours.",
        "type": "Core Quest",
        "xp_value": 100,
        "notebooklm_focus": "Upload mentee progress notes to track coaching effectiveness."
      },
      {
        "node_id": 2,
        "status": "Locked",
        "title": "Committee Leadership",
        "description": "Spearhead a regional programming initiative or serve on a national NOBCChE board committee.",
        "type": "Side Quest",
        "xp_value": 150,
        "notebooklm_focus": "Summarize strategic committee goals and historical meeting data."
      },
      {
        "node_id": 3,
        "status": "Locked",
        "title": "Thought-Leadership Publication",
        "description": "Publish an industry whitepaper, patent, or thought-leadership article in your specialized field.",
        "type": "Core Quest",
        "xp_value": 250,
        "notebooklm_focus": "Organize decades of field notes into a structured book or whitepaper outline."
      }
    ]
  }
};
