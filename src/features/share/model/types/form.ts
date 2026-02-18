export interface CreateShareForm {
  title: string;
  content: string;
  deadline: Date | null;
  stadiumId: number | null;
  maxAttendees: number;
}
