import { FormBuilder, Validators } from '@angular/forms';
import { isRequired, hasEmailError } from './validators';

describe('validators - unitarias', () => {
  const fb = new FormBuilder();

  describe('isRequired', () => {
    it('retorna true si el campo tiene error required y está tocado', () => {
      const form = fb.group({ email: ['', Validators.required] });
      form.get('email')!.markAsTouched();
      expect(isRequired('email', form)).toBeTruthy();
    });

    it('retorna null/falsy si el campo no está tocado', () => {
      const form = fb.group({ email: ['', Validators.required] });
      expect(isRequired('email', form)).toBeFalsy();
    });

    it('retorna null/falsy si el campo tiene valor válido', () => {
      const form = fb.group({ email: ['test@test.com', Validators.required] });
      form.get('email')!.markAsTouched();
      expect(isRequired('email', form)).toBeFalsy();
    });

    it('funciona con el campo firstName', () => {
      const form = fb.group({ firstName: ['', Validators.required] });
      form.get('firstName')!.markAsTouched();
      expect(isRequired('firstName', form)).toBeTruthy();
    });

    it('funciona con el campo password', () => {
      const form = fb.group({ password: ['', Validators.required] });
      form.get('password')!.markAsTouched();
      expect(isRequired('password', form)).toBeTruthy();
    });
  });

  describe('hasEmailError', () => {
    it('retorna true si el email es inválido y está tocado', () => {
      const form = fb.group({ email: ['no-es-email', Validators.email] });
      form.get('email')!.markAsTouched();
      expect(hasEmailError(form)).toBeTruthy();
    });

    it('retorna null/falsy si el email no está tocado', () => {
      const form = fb.group({ email: ['no-es-email', Validators.email] });
      expect(hasEmailError(form)).toBeFalsy();
    });

    it('retorna null/falsy si el email es válido', () => {
      const form = fb.group({ email: ['correo@test.com', Validators.email] });
      form.get('email')!.markAsTouched();
      expect(hasEmailError(form)).toBeFalsy();
    });
  });
});
