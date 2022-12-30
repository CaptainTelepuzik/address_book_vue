/**
 * Класс валидации пользователя
 */
class ValidationUser {
    static MIN_LENGTH = 2;
    static MAX_LENGTH = 43;
    static PASSWORD_MIN_LENGTH = 6;
    static RUSBOOK = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    static TelNumber = '0123456789'
    static Symbol = ' -@.+()'
    static isCorrect = false

    /**
     * Проверка длины ввода
     * @param text Имя, Фамилия, Почта, Телефон
     * @returns {boolean} Символ успешности
     */
    static _checkLENGTH(text) {
        if (this.MAX_LENGTH > text.length && text.length > this.MIN_LENGTH) {
            return !this.isCorrect
        } return this.isCorrect
    }

    /**
     * Проверка длины пароля
     * @param password Пароль
     * @returns {boolean} Символ успешности
     */
    static _checkPasswordLENGTH(password) {
        if (this.MAX_LENGTH > password && password.length > this.PASSWORD_MIN_LENGTH) {
            return !this.isCorrect
        } return this.isCorrect
    }

    /**
     * Проверка наличия пробела
     * @param text Текст
     * @returns {boolean} Символ успешности
     */
    static _checkNonSpace(text) {
        if (text.indexOf(' ') < 0) {
            return !this.isCorrect
        } return this.isCorrect
    }

    /**
     * Проверка других символов помимо русского алфавита
     * @param name Имя
     * @returns {boolean} Символ успешности
     */
    static _checkSymbolName(name) {
        if ((new Set(name.toLowerCase() + this.RUSBOOK)).size < 34) {
            return !this.isCorrect
        } return this.isCorrect
    }
    /**
     * Проверка других символов помимо русского алфавита + спец символы
     * @param surname Фамилия
     * @returns {boolean} Символ успешности
     */
    static _checkSymbolSurname(surname) {
        if (((new Set(surname.toLowerCase() + this.RUSBOOK + this.Symbol[0] + this.Symbol[1]).size < 36)
            && surname.split(this.Symbol[0]).length - 1 < 3
            && surname.split(this.Symbol[1]).length - 1 < 3)){
            return !this.isCorrect
        }return this.isCorrect
    }
    /**
     * Проверка количества символа "@" и "."
     * @param email Почта
     * @returns {boolean} Символ успешности
     */
    static _checkSymbolEmail(email) {
        if (email.split(this.Symbol[2]).length - 1 < 2 && email.split(this.Symbol[2]).length - 1 > 0
         && email.split(this.Symbol[3]).length - 1 < 2 && email.split(this.Symbol[3]).length - 1 > 0){
            return !this.isCorrect
        } return this.isCorrect
    }
    /**
     * Проверка номера телефона + спец символы
     * @param telephone Телефон
     * @returns {boolean} Символ успешности
     */
    static _checkTelNumber(telephone) {
        if (((new Set(telephone + this.TelNumber + this.Symbol[4] + this.Symbol[5] + this.Symbol[6])).size < 14)
            && telephone.split(this.Symbol[4]).length - 1 < 2
            && telephone.split(this.Symbol[5]).length - 1 < 2
            && telephone.split(this.Symbol[6]).length - 1 < 2){
            return !this.isCorrect
        } return this.isCorrect
    }
    static _checkValidationName(name) {
        if (this._checkLENGTH(name) &&
           this._checkSymbolName(name)){
            return !this.isCorrect
        } return this.isCorrect
    }
    static _checkValidationSurname(surname) {
        if (this._checkLENGTH(surname) &&
            this._checkSymbolSurname(surname)){
            return !this.isCorrect
        } return this.isCorrect
    }
    static _checkValidationLogin(login) {
        if (this._checkNonSpace(login) &&
            this._checkLENGTH(login)){
            return !this.isCorrect
        } return this.isCorrect
    }
    static _checkValidationPassword(password) {
        if (this._checkNonSpace(password) &&
            this. _checkPasswordLENGTH(password)){
            return !this.isCorrect
        } return this.isCorrect
    }
}
const AH = new ValidationUser()

export {AH, ValidationUser};