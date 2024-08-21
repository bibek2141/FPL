import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamFixturesComponent } from './team-fixtures.component';

describe('TeamFixturesComponent', () => {
  let component: TeamFixturesComponent;
  let fixture: ComponentFixture<TeamFixturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamFixturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamFixturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
