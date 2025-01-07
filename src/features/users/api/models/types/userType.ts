export type UserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};


export type RegistrationUserType = {
  login: string;
  email: string;
  password: string
  createdAt: string;
  emailConfirmation: {
    confirmationCode: string,
    expirationDate: string,
    isConfirm: boolean
  }
}
