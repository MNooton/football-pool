import { Pick } from './interface.pick';

export interface UserRecord {
  email: string;
  username: string;
  picks: Pick[];
}
