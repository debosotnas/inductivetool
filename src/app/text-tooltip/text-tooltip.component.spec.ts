import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextTooltipComponent } from './text-tooltip.component';

describe('TextTooltipComponent', () => {
  let component: TextTooltipComponent;
  let fixture: ComponentFixture<TextTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
