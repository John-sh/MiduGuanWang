import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

const ALLOWED_EXT = ['pdf', 'png', 'jpg', 'jpeg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  form: FormGroup;
  submitted = false;
  submitting = false;
  submitSuccess = false;
  codeSending = false;
  countdown = 0;
  private timerId: ReturnType<typeof setInterval> | null = null;

  socialSecurityLabels = ['联系人1', '联系人2', '联系人3'];

  attachmentHints = {
    socialSecurity:
      '请分别上传近三个月单位社保缴费证明（共3份），附件大小不超过5MB，支持 PDF/PNG/JPG/JPEG',
    unionCert: '工会法人资格证书，附件大小不超过5MB，支持 PDF/PNG/JPG/JPEG',
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      organization: ['', [Validators.required, Validators.maxLength(100)]],
      teamName: ['', [Validators.required, Validators.maxLength(50)]],
      contacts: this.fb.array([
        this.createContactControl(),
        this.createContactControl(),
        this.createContactControl(),
      ]),
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      verifyCode: ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
      socialSecurityFiles: this.fb.array([
        this.createFileControl(),
        this.createFileControl(),
        this.createFileControl(),
      ]),
      unionCertFile: [null as File | null, [Validators.required]],
      agreed: [false, [Validators.requiredTrue]],
    });
  }

  get contacts(): FormArray {
    return this.form.get('contacts') as FormArray;
  }

  get socialSecurityFiles(): FormArray {
    return this.form.get('socialSecurityFiles') as FormArray;
  }

  get unionCertFile(): File | null {
    return this.form.get('unionCertFile')?.value ?? null;
  }

  socialSecurityFileAt(index: number): File | null {
    return this.socialSecurityFiles.at(index)?.value ?? null;
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  createContactControl() {
    return this.fb.control('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern(/^[\u4e00-\u9fa5a-zA-Z·\s]{2,20}$/),
    ]);
  }

  createFileControl() {
    return this.fb.control(null as File | null, [Validators.required]);
  }

  fieldInvalid(path: string): boolean {
    const control = this.form.get(path);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  contactInvalid(index: number): boolean {
    const control = this.contacts.at(index);
    return control.invalid && (control.touched || this.submitted);
  }

  fileError(control: AbstractControl | null): string {
    if (!control || !(control.touched || this.submitted)) {
      return '';
    }
    if (control.hasError('required')) {
      return '请上传附件';
    }
    if (control.hasError('fileType')) {
      return '仅支持 PDF、PNG、JPG、JPEG';
    }
    if (control.hasError('fileSize')) {
      return '附件大小不能超过 5MB';
    }
    return '';
  }

  socialSecurityError(index: number): string {
    return this.fileError(this.socialSecurityFiles.at(index));
  }

  unionCertError(): string {
    return this.fileError(this.form.get('unionCertFile'));
  }

  onSocialSecurityChange(event: Event, index: number): void {
    this.applyFileToControl(
      event,
      this.socialSecurityFiles.at(index)
    );
  }

  onUnionCertChange(event: Event): void {
    this.applyFileToControl(event, this.form.get('unionCertFile'));
  }

  clearSocialSecurity(index: number): void {
    this.clearFileControl(
      this.socialSecurityFiles.at(index),
      `file-social-${index}`
    );
  }

  clearUnionCert(): void {
    this.clearFileControl(this.form.get('unionCertFile'), 'file-union');
  }

  sendCode(): void {
    const phone = this.form.get('phone');
    phone?.markAsTouched();
    if (!phone || phone.invalid) {
      return;
    }
    if (this.codeSending || this.countdown > 0) {
      return;
    }

    this.codeSending = true;
    window.setTimeout(() => {
      this.codeSending = false;
      this.countdown = 60;
      this.clearTimer();
      this.timerId = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) {
          this.clearTimer();
        }
      }, 1000);
    }, 600);
  }

  onSubmit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    window.setTimeout(() => {
      this.submitting = false;
      this.submitSuccess = true;
    }, 900);
  }

  resetForm(): void {
    this.submitSuccess = false;
    this.submitted = false;
    this.form.reset({
      organization: '',
      teamName: '',
      contacts: ['', '', ''],
      phone: '',
      verifyCode: '',
      socialSecurityFiles: [null, null, null],
      unionCertFile: null,
      agreed: false,
    });
    ['file-social-0', 'file-social-1', 'file-social-2', 'file-union'].forEach(
      (id) => {
        const input = document.getElementById(id) as HTMLInputElement | null;
        if (input) {
          input.value = '';
        }
      }
    );
  }

  private applyFileToControl(
    event: Event,
    control: AbstractControl | null
  ): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!control) {
      return;
    }

    control.markAsTouched();
    control.setErrors(null);

    if (!file) {
      control.setValue(null);
      control.setErrors({ required: true });
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED_EXT.includes(ext)) {
      control.setValue(null);
      control.setErrors({ fileType: true });
      input.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      control.setValue(null);
      control.setErrors({ fileSize: true });
      input.value = '';
      return;
    }

    control.setValue(file);
  }

  private clearFileControl(
    control: AbstractControl | null,
    inputId: string
  ): void {
    control?.setValue(null);
    control?.markAsTouched();
    control?.setErrors({ required: true });
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (input) {
      input.value = '';
    }
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
