import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CommunityQuestion, CommunityReply, CommunityUser } from "@/types/community";
import { getNowMs } from "@/lib/time";

interface CommunityState {
  currentUser: CommunityUser;
  questions: CommunityQuestion[];
  replies: Record<string, CommunityReply[]>; // Map of questionId -> Replies
  isLive: boolean;
  
  // Actions
  fetchCommunityData: () => Promise<void>;
  addQuestion: (question: Omit<CommunityQuestion, "id" | "createdAt" | "updatedAt" | "replyCount" | "upvotes">) => Promise<string>;
  addReply: (questionId: string, reply: Omit<CommunityReply, "id" | "createdAt" | "questionId" | "accepted" | "votes">) => Promise<void>;
  upvoteQuestion: (questionId: string) => void;
  upvoteReply: (questionId: string, replyId: string) => void;
  acceptReply: (questionId: string, replyId: string) => void;
  updateUser: (updates: Partial<CommunityUser>) => void;
}

const CURRENT_USER: CommunityUser = {
  id: "user-1",
  displayName: "Unknown",
  avatar: "",
  program: "Computer Science Engineering",
  helpfulPoints: 284,
  acceptedAnswers: 23,
  subjects: ["Operating Systems", "Data Structures", "Computer Networks"]
};

// Seed initial data for a realistic feel
const INITIAL_QUESTIONS: CommunityQuestion[] = [
  {
    id: "q-1",
    authorId: "user-2",
    authorName: "Alex",
    title: "How does the two-pointer approach work for this problem?",
    body: "I'm struggling to understand the two-pointer approach for array traversal. Can someone explain?",
    subjectName: "Data Structures",
    category: "Concept",
    tags: ["Algorithms", "Two Pointers"],
    anonymous: false,
    createdAt: getNowMs() - 1000 * 60 * 2, // 2 mins ago
    updatedAt: getNowMs(),
    replyCount: 4,
    upvotes: 12
  },
  {
    id: "q-2",
    authorId: "user-3",
    authorName: "Anonymous Student",
    title: "Can someone explain Assignment 4, especially the page replacement part?",
    body: "I'm stuck on the LRU page replacement algorithm implementation. The test cases are failing.",
    subjectName: "Operating Systems",
    category: "Assignment Help",
    tags: ["Page Replacement", "Assignment 4"],
    anonymous: true,
    createdAt: getNowMs() - 1000 * 60 * 60 * 3, // 3 hours ago
    updatedAt: getNowMs(),
    replyCount: 6,
    upvotes: 8
  },
  {
    id: "q-3",
    authorId: "user-4",
    authorName: "Sarah",
    title: "Why is vector.erase() invalidating my iterator here?",
    body: "When I call `nums.erase(it)`, the next iteration crashes. Why does this happen?\n\n```cpp\nvector<int> nums;\n```",
    subjectName: "C++",
    category: "Programming",
    tags: ["C++", "Iterators", "Vectors"],
    anonymous: false,
    createdAt: getNowMs() - 1000 * 60 * 60 * 24, // 1 day ago
    updatedAt: getNowMs(),
    replyCount: 12,
    acceptedAnswerId: "r-1",
    upvotes: 24
  }
];

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      currentUser: CURRENT_USER,
      questions: INITIAL_QUESTIONS,
      replies: {},
      isLive: false,

      fetchCommunityData: async () => {
        try {
          const res = await fetch('/api/community');
          if (!res.ok) throw new Error('API offline');
          const data = await res.json();
          if (data && Array.isArray(data)) {
            // Success: connected to real backend
            set({ questions: data, isLive: true });
          }
        } catch (error) {
          // Fallback to local mode
          console.warn('Community API offline. Falling back to Local Demo Mode.');
          set({ isLive: false });
        }
      },

      addQuestion: async (questionData) => {
        const fallbackId = `q-${getNowMs()}-${Math.random().toString(36).substring(2, 9)}`;
        const localQuestion: CommunityQuestion = {
          ...questionData,
          id: fallbackId,
          createdAt: getNowMs(),
          updatedAt: getNowMs(),
          replyCount: 0,
          upvotes: 0
        };

        try {
          const res = await fetch('/api/community', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(localQuestion)
          });
          if (!res.ok) throw new Error('API offline');
          
          const dbQuestion = await res.json();
          set((state) => ({
            questions: [dbQuestion, ...state.questions],
            isLive: true
          }));
          return dbQuestion.id;
        } catch (error) {
          // Fallback to local mutation
          set((state) => ({
            questions: [localQuestion, ...state.questions],
            isLive: false
          }));
          return fallbackId;
        }
      },

      addReply: async (questionId, replyData) => {
        const fallbackId = `r-${getNowMs()}-${Math.random().toString(36).substring(2, 9)}`;
        const localReply: CommunityReply = {
          ...replyData,
          id: fallbackId,
          questionId,
          accepted: false,
          votes: 0,
          createdAt: getNowMs()
        };

        try {
          const res = await fetch('/api/community/replies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(localReply)
          });
          if (!res.ok) throw new Error('API offline');

          const dbReply = await res.json();
          set((state) => {
            const currentReplies = state.replies[questionId] || [];
            return {
              replies: { ...state.replies, [questionId]: [...currentReplies, dbReply] },
              questions: state.questions.map(q => q.id === questionId ? { ...q, replyCount: q.replyCount + 1, updatedAt: getNowMs() } : q),
              isLive: true
            };
          });
        } catch (error) {
          // Fallback to local mutation
          set((state) => {
            const currentReplies = state.replies[questionId] || [];
            return {
              replies: {
                ...state.replies,
                [questionId]: [...currentReplies, localReply]
              },
              questions: state.questions.map(q => 
                q.id === questionId 
                  ? { ...q, replyCount: q.replyCount + 1, updatedAt: getNowMs() } 
                  : q
              ),
              isLive: false
            };
          });
        }
      },

      upvoteQuestion: (questionId) => {
        set((state) => ({
          questions: state.questions.map(q => 
            q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
          )
        }));
      },

      upvoteReply: (questionId, replyId) => {
        set((state) => ({
          replies: {
            ...state.replies,
            [questionId]: (state.replies[questionId] || []).map(r => 
              r.id === replyId ? { ...r, votes: r.votes + 1 } : r
            )
          }
        }));
      },

      acceptReply: (questionId, replyId) => {
        set((state) => ({
          questions: state.questions.map(q => 
            q.id === questionId ? { ...q, acceptedAnswerId: replyId } : q
          ),
          replies: {
            ...state.replies,
            [questionId]: (state.replies[questionId] || []).map(r => 
              r.id === replyId ? { ...r, accepted: true } : { ...r, accepted: false }
            )
          }
        }));
      },

      updateUser: (updates) => set((state) => ({
        currentUser: { ...state.currentUser, ...updates }
      }))
    }),
    {
      name: "nextime-community",
      partialize: (state) => ({
        currentUser: state.currentUser,
        questions: state.questions,
        replies: state.replies
      }),
    }
  )
);
