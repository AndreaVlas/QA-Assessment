const { expect } = require('@playwright/test');
const { randomUUID } = require('crypto');

exports.CreateAccountPage = class CreateAccountPage {

  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    // create account form
    this.title = page.getByRole('textbox', { name: 'title' });
    this.firstName = page.getByLabel('First name Required');
    this.lastName = page.getByLabel('Last name Required');
    this.email = page.getByRole('group', { name: 'Create an account' }).getByLabel('Email address Required');
    this.password = page.getByRole('group', { name: 'Create an account' }).getByLabel('Password Required', { exact: true });
    this.confirmPassword = page.getByLabel('Confirm password Required');
    this.termsAndConditions = page.getByLabel('I agree to the Terms &');
    this.createAccountButton = page.getByRole('button', { name: 'Create an account' });
    // messages
    this.successMessage = page.getByText('We have sent a confirmation')
    this.errorMessage = page.locator('#error-summary-title');
    this.messageContainer = page.locator('#message');
    this.emailErrorMessage = page.locator('div.error-text.margin-bottom-5');
    this.passwordRequirementsLink = page.locator('a.message--error.message__link');
    this.confirmPassLabel = page.locator('div.error-text.margin-bottom-5:has-text("Please confirm your new password")');
    this.errorMessageLabel = page.locator('div.error-text.margin-bottom-5:has-text("Please enter between 1 and 50 characters")');

  }

  async getErrorMessageText() {
    return await this.errorMessage.textContent();
  }
  async getEmailErrorText() {
    return await this.emailErrorMessage.textContent();
  }
  async getPasswordErrorText() {
    return await this.passwordRequirementsLink.textContent();
  }
  async getConfirmPasswordErrorText() {
    return await this.confirmPassLabel.waitFor({ state: 'visible' });
  }
  async getErrorMessageLabel() {
    return await this.errorMessageLabel.waitFor({ state: 'visible' });
  }

  async fillCreateAccountForm(userFirstName, userLastName, email, password, confirmPassword) {
    let uuid = randomUUID();
    const userEmail =  email? email : `test.jobseeker+${uuid}@madgex.com`;
    const pass = password? password : `password1`;
    const confirmPasswordValue = confirmPassword || pass;
    await this.title.fill('Mr');
    await this.firstName.fill(userFirstName);
    await this.lastName.fill(userLastName);
    await this.email.fill(userEmail);
    await this.password.fill(pass);
    await this.confirmPassword.fill(confirmPasswordValue);
    await this.termsAndConditions.check();
  }

  async emptyFieldsCheck(userFirstName, userLastName){
    await this.fillCreateAccountForm(userFirstName, userLastName, "", "", "")
  }
  async maxCharacterLimitValidation(userFirstName, userLastName){
    await this.fillCreateAccountForm(userFirstName, userLastName)
  }

  async duplicateEmailCheck(userFirstName, userLastName) {
    const emailUser = "test1jobseeker@madgex.com"
    await this.fillCreateAccountForm(userFirstName, userLastName, emailUser)
  }

  async missingDomainEmailCheck(userFirstName, userLastName) {
    await this.fillCreateAccountForm(userFirstName, userLastName, '@madgex.com', 'password1');
  }

  async invalidEmailFormatCheck(userFirstName, userLastName) {
    await this.fillCreateAccountForm(userFirstName, userLastName, 'test@madgex', 'password1');
  }

  async invalidPasswordFormatCheck(userFirstName, userLastName, email) {
    await this.fillCreateAccountForm(userFirstName, userLastName, email, 'pass');
  }

  async numbersOnlyPasswordCheck(userFirstName, userLastName, email) {
    await this.fillCreateAccountForm(userFirstName, userLastName, email, '11123456');
  }

  async lettersOnlyPasswordCheck(userFirstName, userLastName,email) {
    await this.fillCreateAccountForm(userFirstName, userLastName, email, 'passsssss');
  }

  async passwordSameAsFirstName(userFirstName, userLastName,email) {
    await this.fillCreateAccountForm(userFirstName, userLastName, email, userFirstName);
  }

  async invalidConfirmPassword(userFirstName, userLastName,email, password) {
    await this.fillCreateAccountForm(userFirstName, userLastName, email, password, 'pass1234567');
  }
};