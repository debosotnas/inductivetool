import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextPortionComponent } from './text-portion.component';

describe('TextPortionComponent', () => {
  let component: TextPortionComponent;
  let fixture: ComponentFixture<TextPortionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextPortionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPortionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
