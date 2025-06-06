import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteComponent } from './usuario.component';

describe('EstudianteComponent', () => {
  let component: EstudianteComponent;
  let fixture: ComponentFixture<EstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudianteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
