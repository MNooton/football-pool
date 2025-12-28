import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Standing } from 'src/shared/models/interface.standing';
import { RecordService } from 'src/shared/services/record.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css'],
  standalone: false
})
export class StandingsComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['imageUrl', 'name', 'position', 'record'];

  /** Optional input standings */
  @Input() standings: Standing[] | null = null;

  constructor(private recordService: RecordService) {}

  ngOnInit(): void {
    if (!this.standings) {
      this.standings = this.buildCurrentStandings();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['standings'] && this.standings) {
      // Ensure rankings are correct if external data is passed in
      this.standings = this.recordService.rankStandings([...this.standings]);
    }
  }

  private buildCurrentStandings(): Standing[] {
    const standings = this.recordService.personData.map(person => {
      const personRecord = this.recordService.getRecord(person.id);

      return {
        personId: person.id,
        rank: 1,
        imageUrl: person.imageUrl,
        name: person.name,
        record: personRecord.record,
        points: personRecord.points
      };
    });

    return this.recordService.rankStandings(standings);
  }
}
