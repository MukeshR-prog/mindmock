import { create } from "zustand";

type VoiceType = "professional-male" | "professional-female" | "friendly-male" | "friendly-female";

interface InterviewState {
  interviewId: string | null;
  currentQuestion: string;
  transcript: string[];
  isListening: boolean;
  voiceType: VoiceType;
  cameraEnabled: boolean;

  setInterviewId: (id: string) => void;
  setQuestion: (q: string) => void;
  addTranscript: (line: string) => void;
  startListening: () => void;
  stopListening: () => void;
  setVoiceType: (voice: VoiceType) => void;
  setCameraEnabled: (enabled: boolean) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  interviewId: null,
  currentQuestion: "",
  transcript: [],
  isListening: false,
  voiceType: "professional-female",
  cameraEnabled: false,

  setInterviewId: (id) => set({ interviewId: id }),
  setQuestion: (q) => set({ currentQuestion: q }),
  addTranscript: (line) =>
    set((state) => ({
      transcript: [...state.transcript, line],
    })),

  startListening: () => set({ isListening: true }),
  stopListening: () => set({ isListening: false }),
  setVoiceType: (voice) => set({ voiceType: voice }),
  setCameraEnabled: (enabled) => set({ cameraEnabled: enabled }),

  reset: () =>
    set({
      interviewId: null,
      currentQuestion: "",
      transcript: [],
      isListening: false,
      voiceType: "professional-female",
      cameraEnabled: false,
    }),
}));
