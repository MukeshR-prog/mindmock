import { create } from "zustand";

interface InterviewState {
  interviewId: string | null;
  currentQuestion: string;
  transcript: string[];
  isListening: boolean;

  setInterviewId: (id: string) => void;
  setQuestion: (q: string) => void;
  addTranscript: (line: string) => void;
  startListening: () => void;
  stopListening: () => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  interviewId: null,
  currentQuestion: "",
  transcript: [],
  isListening: false,

  setInterviewId: (id) => set({ interviewId: id }),
  setQuestion: (q) => set({ currentQuestion: q }),
  addTranscript: (line) =>
    set((state) => ({
      transcript: [...state.transcript, line],
    })),

  startListening: () => set({ isListening: true }),
  stopListening: () => set({ isListening: false }),

  reset: () =>
    set({
      interviewId: null,
      currentQuestion: "",
      transcript: [],
      isListening: false,
    }),
}));
