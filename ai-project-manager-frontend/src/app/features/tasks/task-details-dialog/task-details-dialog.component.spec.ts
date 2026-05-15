import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsDialogComponent } from './task-details-dialog.component';

describe('TaskDetailsDialogComponent', () => {
  let component: TaskDetailsDialogComponent;
  let fixture: ComponentFixture<TaskDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailsDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
