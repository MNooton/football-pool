import { Component, OnInit } from '@angular/core';
import { Person } from 'src/shared/models/interface.person';
import personData from '../../shared/data/persons.json';
import pickData from '../../shared/data/picks.json';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {
  persons: Person[] = personData;
  displayedColumns: string[] = ['position', 'imageUrl', 'name', 'record'];
  standings = null;

  constructor() { }

  ngOnInit(): void {
    this.standings = this.persons.map ( person => ({
      position: person.id,
      imageUrl: person.imageUrl,
      name: person.name,
      record: '0-0-0'
    }));
  }

}
