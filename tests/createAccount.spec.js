const { default: test, expect } = require("@playwright/test");
const { CreateAccountPage } = require("./page-object-models/createAccountPage");

// Test for creating an account with valid data
test("Create a jobseeker account", async ({ page }) => {
  const createAccountPage = new CreateAccountPage(page);
  await page.goto("/register/");
  await createAccountPage.fillCreateAccountForm("Tester", "Bennington");
  await createAccountPage.createAccountButton.click();
  await expect(createAccountPage.successMessage).toBeVisible();
});
// Test for empty fields triggering focus on first name
test("Empty fields trigger focus on first name", async ({ page }) => {
  const createAccountPage = new CreateAccountPage(page);
  await page.goto("/register/");
  await createAccountPage.emptyFieldsCheck("", "");
  await createAccountPage.createAccountButton.click();
  const isFirstNameFocused = await createAccountPage.firstName.evaluate(
    (el) => document.activeElement === el
  );
  expect(isFirstNameFocused).toBe(true);
});
// Test for maximum character limit validation
test("Maximum Character Limit Validation", async ({ page }) => {
  const createAccountPage = new CreateAccountPage(page);
  await page.goto("/register/");
  await createAccountPage.maxCharacterLimitValidation(
    "Tester123456789123456",
    "Bennington1234566612535616233433423423ewkjckwckejwbckekjwbckebekwbcjkejbw"
  );
  await createAccountPage.createAccountButton.click();
  await createAccountPage.getErrorMessageLabel();
});

// Test for duplicate email during registration
test("Duplicate email fail register", async ({ page }) => {
  const createAccountPage = new CreateAccountPage(page);
  await page.goto("/register/");
  await createAccountPage.duplicateEmailCheck("Tester", "Bennington");
  await createAccountPage.createAccountButton.click();
  expect(await createAccountPage.getErrorMessageText()).toContain(
    "There is a problem, please check"
  );
});

// Test for email missing domain
test("Error for email missing domain", async ({ page }) => {
  const createAccountPage = new CreateAccountPage(page);
  await page.goto("/register/");
  await createAccountPage.missingDomainEmailCheck("Tester", "Bennington");
  await createAccountPage.createAccountButton.click();
  const isEmailFocused = await createAccountPage.email.evaluate(
    (el) => document.activeElement === el
  );
  expect(isEmailFocused).toBe(true);
});

// Test for invalid email format
test("Invalid email format", async ({ page }) => {
  const createAccountPage = new CreateAccountPage(page);
  await page.goto("/register/");
  await createAccountPage.invalidEmailFormatCheck("Tester", "Bennington");
  await createAccountPage.createAccountButton.click();
  await expect(createAccountPage.messageContainer).toBeVisible();
  expect(await createAccountPage.getEmailErrorText()).toContain(
    "The email address you entered does not seem"
  );
});

// Test for too short password format
test("Invalid password format", async ({ page }) => {
  const createAccountPage = new CreateAccountPage(page);
  await page.goto("/register/");
  await createAccountPage.invalidPasswordFormatCheck("Tester", "Bennington");
  await createAccountPage.createAccountButton.click();
  await expect(createAccountPage.messageContainer).toBeVisible();
  expect(await createAccountPage.getPasswordErrorText()).toContain(
    "Password Requirements:"
  );
});

// Test for password with letters only
test("Invalid password - letters only", async ({ page }) => {
  const createAccountPage = new CreateAccountPage(page);
  await page.goto("/register/");
  await createAccountPage.lettersOnlyPasswordCheck("Tester", "Bennington");
  await createAccountPage.createAccountButton.click();
  await expect(createAccountPage.messageContainer).toBeVisible();
  expect(await createAccountPage.getPasswordErrorText()).toContain(
    "Password Requirements:"
  );
});

// Test for password with numbers only
test("Invalid password - numbers only", async ({ page }) => {
  const createAccountPage = new CreateAccountPage(page);
  await page.goto("/register/");
  await createAccountPage.numbersOnlyPasswordCheck("Tester", "Bennington");
  await createAccountPage.createAccountButton.click();
  await expect(createAccountPage.messageContainer).toBeVisible();
  expect(await createAccountPage.getPasswordErrorText()).toContain(
    "Password Requirements:"
  );
});

// Test for password same as first name
test("Invalid password - same password value as first name", async ({
  page,
}) => {
  const createAccountPage = new CreateAccountPage(page);
  await page.goto("/register/");
  await createAccountPage.passwordSameAsFirstName("Tester", "Bennington");
  await createAccountPage.createAccountButton.click();
  await expect(createAccountPage.messageContainer).toBeVisible();
  expect(await createAccountPage.getPasswordErrorText()).toContain(
    "Password Requirements:"
  );
});

// Test for invalid confirm password value
test("Invalid confirm password value", async ({ page }) => {
  const createAccountPage = new CreateAccountPage(page);
  await page.goto("/register/");
  await createAccountPage.invalidConfirmPassword("Tester", "Bennington");
  await createAccountPage.createAccountButton.click();
  await createAccountPage.getConfirmPasswordErrorText();
});
