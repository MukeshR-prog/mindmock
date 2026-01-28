import { create } from "zustand";

type ResumeSummary = {
  _id: string;
  fileName: string;
  targetRole?: string;
  experienceLevel?: string;
  atsScore: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  createdAt: string;
};

interface ResumeState {
  selectedResume: ResumeSummary | null;
  setSelectedResume: (resume: ResumeSummary) => void;
  clearSelectedResume: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  selectedResume: null,
  setSelectedResume: (resume) => set({ selectedResume: resume }),
  clearSelectedResume: () => set({ selectedResume: null }),
}));
