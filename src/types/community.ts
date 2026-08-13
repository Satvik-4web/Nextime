export type CommunityCategory = 
  | "Question"
  | "Assignment Help"
  | "Concept"
  | "Programming"
  | "Exam Prep"
  | "Resources"
  | "Discussion";

export interface CommunityQuestion {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  body: string;
  subjectId?: string;
  subjectName?: string;
  assignmentId?: string;
  category: CommunityCategory;
  tags: string[];
  anonymous: boolean;
  createdAt: number;
  updatedAt: number;
  replyCount: number;
  acceptedAnswerId?: string;
  upvotes: number;
}

export interface CommunityReply {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  body: string;
  accepted: boolean;
  votes: number;
  createdAt: number;
}

export interface CommunityUser {
  id: string;
  displayName: string;
  avatar?: string;
  program?: string;
  helpfulPoints: number;
  acceptedAnswers: number;
  subjects: string[];
}
