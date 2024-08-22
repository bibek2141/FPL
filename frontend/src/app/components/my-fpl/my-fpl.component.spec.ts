import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFplComponent } from './my-fpl.component';

describe('MyFplComponent', () => {
  let component: MyFplComponent;
  let fixture: ComponentFixture<MyFplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyFplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
