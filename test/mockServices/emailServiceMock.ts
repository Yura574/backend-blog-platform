






export class EmailServiceMock {
  async sendMailConfirmation (email: string, code: string){
    // await Promise.resolve()
    return true
  }
}