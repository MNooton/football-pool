import { Pick } from './interface.pick'

export interface PersonPicks {
  personId: string;
  name: string;
  gender: string;
  picks: Pick[]
}
