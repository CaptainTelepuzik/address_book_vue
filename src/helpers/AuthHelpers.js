import {CookieStorage, SessionStorage} from "@/helpers/BrowserStorageHelpers";
import {router} from "@/routes";

class AuthHelpers {
    static _instance = null;
    static _isAuth = false;
    static _userInfo = {};
    static _user = null;
    static _cookieStorage = new CookieStorage('auth');
    static _sessionStorage = new SessionStorage('auth');
    static _cookieMaxAge = 7 * 24 * 60 * 60;
    static _userFields = 'userId';
    static _userInformationFields = 'userInformation';

    constructor() {
        if (!AuthHelpers._instance) {
            AuthHelpers._instance = this;
        }

        AuthHelpers._cookieStorage.changeMaxAge(AuthHelpers._cookieMaxAge);

        AuthHelpers._checkAuth();
        AuthHelpers._checkUserInfo();

        return AuthHelpers._instance;
    }

    static getInstance() {
        AuthHelpers._checkAuth();
        AuthHelpers._checkUserInfo();

        if (!AuthHelpers._instance) {
            AuthHelpers._instance = this;
        }

        return AuthHelpers._instance;
    }

    static _checkAuth(force = false) {
        if (!AuthHelpers._isAuth || force) {
            AuthHelpers._isAuth = !!(
                AuthHelpers._cookieStorage.get(AuthHelpers._userFields)
                || AuthHelpers._sessionStorage.get(AuthHelpers._userFields)
            );
        }
    }

    static _checkUserInfo(force = false) {
        if (!AuthHelpers._userInfo || force) {
            AuthHelpers._userInfo =
                AuthHelpers._cookieStorage.get(AuthHelpers._userInformationFields)
                || AuthHelpers._sessionStorage.get(AuthHelpers._userInformationFields);
        }

        if (!AuthHelpers._user || force) {
            AuthHelpers._user =
                AuthHelpers._cookieStorage.get(AuthHelpers._userFields)
                || AuthHelpers._sessionStorage.get(AuthHelpers._userFields);
        }
    }

    static _checkInstance() {
        if (!AuthHelpers._instance) {
            new AuthHelpers();
        }
    }

    static userIsAuth() {
        AuthHelpers._checkInstance();
        AuthHelpers._checkAuth(true)

        return AuthHelpers._isAuth;
    }

    static getUserInfo() {
        AuthHelpers._checkInstance();
        AuthHelpers._checkUserInfo(true);

        return AuthHelpers._userInfo;
    }

    static getUser() {
        AuthHelpers._checkInstance();

        return AuthHelpers._user || 0;
    }

    static forceCheck() {
        this._checkUserInfo(true);
        this._checkAuth(true);
    }

    static login(useCookie, userId, userData) {
        const storageHelpers = useCookie
            ? AuthHelpers._cookieStorage
            : AuthHelpers._sessionStorage;

        storageHelpers.set(AuthHelpers._userFields, userId);
        storageHelpers.set(AuthHelpers._userInformationFields, userData);

        AuthHelpers.forceCheck();
        router.push('home');
    }

    static logout() {
        AuthHelpers._cookieStorage.delete(AuthHelpers._userFields);
        AuthHelpers._cookieStorage.delete(AuthHelpers._userInformationFields);
        AuthHelpers._sessionStorage.delete(AuthHelpers._userFields);
        AuthHelpers._sessionStorage.delete(AuthHelpers._userInformationFields);

        AuthHelpers.forceCheck();
        router.push('login');
    }
}

const AH = new AuthHelpers();

export {AH, AuthHelpers};