import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterControlsComponent } from './voter-controls.component';

describe('VoterControlsComponent', () => {
  let component: VoterControlsComponent;
  let fixture: ComponentFixture<VoterControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoterControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
