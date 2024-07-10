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
  confirmationCode: {
    expirationDate: string,
    expirationCode: string,
    isConfirm: boolean
  }
}
