import { Component, OnInit } from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Person } from 'src/shared/models/interface.person';
import { Standing } from 'src/shared/models/interface.standing';
import { RecordService } from 'src/shared/services/record.service';
import pickData from '../../shared/data/picks_2021.json';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {
  displayedColumns: string[] = ['imageUrl', 'name', 'position', 'record'];
  standings: Standing[] = null;

  constructor(private recordService: RecordService) { }

  ngOnInit(): void {
    this.standings = this.recordService.personData.map ( person => {
      const personRecord = this.recordService.getRecord(person.id);
      const standing: Standing = {
        personId: person.id,
        rank: 1,
        imageUrl: person.imageUrl,
        name: person.name,
        record: personRecord.record,
        points: personRecord.points
    };
      return standing;
  });

    this.standings = this.recordService.rankStandings(this.standings);

  }

}
