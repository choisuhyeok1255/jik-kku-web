export interface CreateShareForm {
  title: string;
  content: string;
  deadline: string | null;
  stadiumId: number | null;
  maxAttendees: number;
}
