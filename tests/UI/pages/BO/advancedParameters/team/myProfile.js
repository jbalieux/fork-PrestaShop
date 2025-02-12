require('module-alias/register');
const EmployeeBasePage = require('@pages/BO/advancedParameters/team/employeeBasePage');

/**
 * Add employee page, contains functions that can be used on the page
 * @class
 * @extends EmployeeBasePage
 */
class MyProfile extends EmployeeBasePage {
  /**
   * @constructs
   * Setting up texts and selectors to use on add employee page
   */
  constructor() {
    super();

    this.errorInvalidFirstNameMessage = 'The "First name" field is invalid.';
    this.errorInvalidLastNameMessage = 'The "Last name" field is invalid.';
    this.errorInvalidFormatImageMessage = 'An unexpected error occurred. [PrestaShop\\PrestaShop\\Core\\Image\\'
      + 'Uploader\\Exception\\UploadedImageConstraintException code 2]: Image format "svg", not recognized, allowed '
      + 'formats are: gif, jpg, jpeg, jpe, png, webp';

    // Selectors
    this.passwordButton = '#employee_change_password_change_password_button';
    this.currentPasswordInput = '#employee_change_password_old_password';
    this.newPasswordInput = '#employee_change_password_new_password_first';
    this.confirmPasswordInput = '#employee_change_password_new_password_second';
    this.avatarFileInput = '#employee_avatarUrl';
    this.enableGravatarInput = toggle => `#employee_has_enabled_gravatar_${toggle}`;
  }

  /*
  Methods
   */

  /**
   * Fill form for update My Profile page
   * @param page {Page} Browser tab
   * @param currentPassword {string} Data to set on add/edit employee form
   * @param newEmployeeData {EmployeeData} Data to set on add/edit employee form
   * @returns {Promise<void>}
   */
  async updateEditEmployee(page, currentPassword, newEmployeeData) {
    await this.setValue(page, this.firstNameInput, newEmployeeData.firstName);
    await this.setValue(page, this.lastNameInput, newEmployeeData.lastName);
    if (newEmployeeData.avatarFile) {
      await this.uploadOnFileChooser(page, this.avatarFileInput, [newEmployeeData.avatarFile]);
    }
    await this.setChecked(page, this.enableGravatarInput(newEmployeeData.enableGravatar ? 1 : 0));
    await this.setValue(page, this.emailInput, newEmployeeData.email);
    await page.click(this.passwordButton);
    await this.setValue(page, this.currentPasswordInput, currentPassword);
    await this.setValue(page, this.newPasswordInput, newEmployeeData.password);
    await this.setValue(page, this.confirmPasswordInput, newEmployeeData.password);
    await this.selectByVisibleText(page, this.languageSelect, newEmployeeData.language);
    await this.selectDefaultPage(page, newEmployeeData.defaultPage);
    await this.clickAndWaitForNavigation(page, this.saveButton);
  }

  /**
   * Get the value of an input
   *
   * @param page {Page} Browser tab
   * @param input {string} ID of the input
   * @returns {Promise<string>}
   */
  async getInputValue(page, input) {
    return page.inputValue(input);
  }

  /**
   * Get login error
   * @param page {Page} Browser tab
   * @return {Promise<string>}
   */
  async getAlertSuccess(page) {
    return this.getAlertSuccessBlockParagraphContent(page);
  }

  /**
   * Get login error
   * @param page {Page} Browser tab
   * @return {Promise<string>}
   */
  async getAlertError(page) {
    return this.getAlertDangerBlockParagraphContent(page);
  }
}

module.exports = new MyProfile();
