export enum LoginType {
  Basic = 'Basic',
  Mail = 'Mail',
  Captcha = 'Captcha',
}

export const LOCKED_MINUTES = 30;
export const LOGIN_TYPE: keyof typeof LoginType = LoginType.Basic;
