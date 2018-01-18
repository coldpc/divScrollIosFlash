import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkNativeScrollComponent } from './sk-native-scroll.component';

describe('SkNativeScrollComponent', () => {
  let component: SkNativeScrollComponent;
  let fixture: ComponentFixture<SkNativeScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkNativeScrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkNativeScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
