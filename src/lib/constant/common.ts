export const AUTH_REQUIRED_LOGIN = [
  '/my-account',
  '/posts/:id',
  'publication/:id',
]

export const AUTH_REQUIRED_ADMIN = ['/admin(.*)']

export const enum GENDER_ENUM {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
