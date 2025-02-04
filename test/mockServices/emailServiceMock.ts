






export class EmailServiceMock {
  async sendMailConfirmation (email: string, code: string){
    return true
  }
  async sendEmailForRecoveryPassword(email: string, code: string){
    return true
  }
}