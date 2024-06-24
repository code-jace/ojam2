import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSearchDialogComponent } from './video-search-dialog.component';

describe('VideoSearchDialogComponent', () => {
  let component: VideoSearchDialogComponent;
  let fixture: ComponentFixture<VideoSearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoSearchDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
