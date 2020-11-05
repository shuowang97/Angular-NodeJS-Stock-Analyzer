import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCardGroupComponent } from './news-card-group.component';

describe('NewsCardGroupComponent', () => {
  let component: NewsCardGroupComponent;
  let fixture: ComponentFixture<NewsCardGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsCardGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsCardGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
