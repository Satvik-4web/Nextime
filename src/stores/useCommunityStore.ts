import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CommunityQuestion, CommunityReply, CommunityUser } from "@/types/community";

interface CommunityState {
  currentUser: CommunityUser;
  questions: CommunityQuestion[];
  replies: Record<string, CommunityReply[]>; // Map of questionId -> Replies
  
  // Actions
  addQuestion: (question: Omit<CommunityQuestion, "id" | "createdAt" | "updatedAt" | "replyCount" | "upvotes">) => string;
  addReply: (questionId: string, reply: Omit<CommunityReply, "id" | "createdAt" | "questionId" | "accepted" | "votes">) => void;
  upvoteQuestion: (questionId: string) => void;
  upvoteReply: (questionId: string, replyId: string) => void;
  acceptReply: (questionId: string, replyId: string) => void;
}

const CURRENT_USER: CommunityUser = {
  id: "user-1",
  displayName: "Satvik",
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
    createdAt: Date.now() - 1000 * 60 * 2, // 2 mins ago
    updatedAt: Date.now(),
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
    createdAt: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    updatedAt: Date.now(),
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
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    updatedAt: Date.now(),
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

      addQuestion: (questionData) => {
        const id = `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const newQuestion: CommunityQuestion = {
          ...questionData,
          id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          replyCount: 0,
          upvotes: 0
        };
        
        set((state) => ({
          questions: [newQuestion, ...state.questions]
        }));
        
        return id;
      },

      addReply: (questionId, replyData) => {
        const id = `r-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const newReply: CommunityReply = {
          ...replyData,
          id,
          questionId,
          accepted: false,
          votes: 0,
          createdAt: Date.now()
        };
        
        set((state) => {
          const currentReplies = state.replies[questionId] || [];
          return {
            replies: {
              ...state.replies,
              [questionId]: [...currentReplies, newReply]
            },
            questions: state.questions.map(q => 
              q.id === questionId 
                ? { ...q, replyCount: q.replyCount + 1, updatedAt: Date.now() } 
                : q
            )
          };
        });
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
      }
    }),
    {
      name: "nextime-community",
      partialize: (state) => ({
        questions: state.questions,
        replies: state.replies
      }),
    }
  )
);
