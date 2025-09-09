import type { Route } from '@angular/router'
import { RegisterComponent } from './register/register.component'
import { LogoutComponent } from './logout/logout.component'
import { LockScreenComponent } from './lock-screen/lock-screen.component'
import { ConfirmMailComponent } from './confirm-mail/confirm-mail.component'
import { SignInComponent } from './sign-in/sign-in.component'
import { RecoverPaswordComponent } from './recover-pasword/recover-pasword.component'
import { EmailVerifivationComponent } from './email-verifivation/email-verifivation.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const AUTH_ROUTES: Route[] = [
  {
    path: 'auth/login',
    component: SignInComponent,
    data: { title: 'Login' },
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
    data: { title: 'Register' },
  },
  {
    path: 'auth/logout',
    component: LogoutComponent,
    data: { title: 'Logout' },
  },
  {
    path: 'auth/recoverpw',
    component: RecoverPaswordComponent,
    data: { title: 'Recover Password' },
  },

  {
    path: 'auth/lock-screen',
    component: LockScreenComponent,
    data: { title: 'Lock Screen' },
  },
  {
    path: 'auth/confirm-mail',
    component: ConfirmMailComponent,
    data: { title: 'Confirm Mail' },
  },
  {
    path: 'email-verification',
    component: EmailVerifivationComponent,
    data: { title: 'Email Verification' },
  },
  {
    path: 'reset-password/:payload',
    component: ResetPasswordComponent,
    data: { title: 'Reset Password' },
  },
]
