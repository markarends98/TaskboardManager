export interface UserStory {
  id: string;
  name: string;
  description: string;
  story_points: number;
  project: string;
  sprint: string;
  assignee: any;
  status: string;
  order: number;
  order_modified: Date;
  archived: boolean;
  completionDate: Date;
}
