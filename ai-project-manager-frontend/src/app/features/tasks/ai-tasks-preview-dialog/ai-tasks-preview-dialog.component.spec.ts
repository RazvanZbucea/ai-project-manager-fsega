import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiTasksPreviewDialogComponent } from './ai-tasks-preview-dialog.component';

describe('AiTasksPreviewDialogComponent', () => {
  let component: AiTasksPreviewDialogComponent;
  let fixture: ComponentFixture<AiTasksPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiTasksPreviewDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AiTasksPreviewDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
