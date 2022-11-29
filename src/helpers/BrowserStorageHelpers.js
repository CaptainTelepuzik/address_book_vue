/**
 * Базовый класс свойств и методов
 */
class BasePropertiesStorage {
    _key = ''; // Ключ сущности
    _keyTypeItem = ''; // Ключ типов сущности
    _keyTypePrefix = 'TypesItem'; // Перфикс для ключа типа сущностей

    constructor(prefix) {
        this._key = prefix + '-';
        this._keyTypeItem = this._key + this._keyTypePrefix;
    }

    /**
     * Построение формализованого ключа
     *
     * @param key Ключ
     * @returns {string} Формализованный ключ
     * @private
     */
    _buildKey(key) {
        return this._key + key;
    }

    /**
     * Установка типа данных ключа
     *
     * @param key Ключ сущности
     * @param type Тип данных
     * @private
     */
    _setTypeItem(key, type) {
        const currentTypeItem = this._getCurrentTypeItem();
        currentTypeItem[key] = type;
        this._setTypeItemInStorage(this._keyTypeItem, JSON.stringify(currentTypeItem));
    }

    /**
     * Получение нужного типа данных по ключу
     *
     * @param key Ключ
     * @returns {*} Тип данных
     * @private
     */
    _getTypeItem(key) {
        const currentTypeItem = this._getCurrentTypeItem();
        return currentTypeItem[key];
    }

    /**
     * Удаления типа данных по ключу
     *
     * @param key Ключ
     * @private
     */
    _removeTypeItem(key) {
        const currentTypeItem = this._getCurrentTypeItem();
        const newTypeItem = {};

        Object.keys(currentTypeItem).forEach((keyItem) => {
            if (keyItem !== key) {
                newTypeItem[keyItem] = currentTypeItem[keyItem];
            }
        });

        this._setTypeItemInStorage(this._keyTypeItem, JSON.stringify(newTypeItem));
    }

    /**
     * Преобразование данных в исходных тип данных
     *
     * @param value Значение из хранилища
     * @param key Ключ сущности
     * @param typeItem Исходный тип данных
     * @returns {string|any|number} Данные с исходным типом
     * @private
     */
    static _prepareTypeResult(value, key, typeItem) {
        if (typeof value === 'string') {
            switch (typeItem) {
                case 'number':
                    return Number(value);
                case 'object':
                    return JSON.parse(value);
                default:
                    return value;
            }
        }

        return value;
    }

    /**
     * Преобразование данных для сохранения
     *
     * @param value Данные
     * @returns {any} Данные в виде для сохранения
     * @private
     */
    static _prepareValue(value) {
        return typeof value === 'object' ? JSON.stringify(value) : value;
    }

    /**
     * Получение всех типов данных
     * @private
     */
    _getCurrentTypeItem() {
    }

    /**
     * Сохранение типа данных в хранилище
     *
     * @param key Ключ
     * @param value Значение
     * @private
     */
    _setTypeItemInStorage(key, value) {
        return value;
    }
}

/**
 * Базовый класс хранилищ
 */
class BaseStorage extends BasePropertiesStorage {
    _storage = sessionStorage; // Хранилище данных WebApi

    /**
     * Сохранение значения по ключу в хранилище
     *
     * @param key Ключ
     * @param value Значение
     */
    set(key, value) {
        this._setTypeItem(key, typeof value);

        this._storage.setItem(this._buildKey(key),
            BasePropertiesStorage._prepareValue(value))
    }

    /**
     * Получение данных из хранилища в исходном типе данных
     *
     * @param key Ключ
     * @returns {string|*|number} Значение из хранилища
     */
    get(key) {
        return BasePropertiesStorage._prepareTypeResult(
            this._storage.getItem(this._buildKey(key)),
            key,
            this._getTypeItem(key)
        );
    }

    /**
     * Удаление данных по ключу
     *
     * @param key Ключ
     */
    delete(key) {
        this._storage.removeItem(this._buildKey(key));
        this._removeTypeItem(key);
    }

    /**
     * Очистка хранилища
     */
    clear() {
        this._storage.clear();
    }

    _getCurrentTypeItem() {
        return JSON.parse(this._storage.getItem(this._keyTypeItem)) || {};
    }

    _setTypeItemInStorage(key, value) {
        this._storage.setItem(key, value);
    }
}

/**
 * Хранилище в виде сессий
 */
class SessionStorage extends BaseStorage{
    _storage = sessionStorage;
}

/**
 * Хранилище в виде локального хранилища
 */
class LocalStorage extends BaseStorage {
    _storage = localStorage;
}

class CookieStorage extends BasePropertiesStorage {
    _path = '/'
    _domain = '';
    _expires = '';
    _maxAge = 24 * 60 * 60;
    _isSecure = true;
    _maxLength = 4 * 1024 - 10;

    constructor(prefix) {
        super(prefix);
    }

    set(key, value, force = false) {
        if (!force) {
            this._setTypeItem(key, typeof  value);
        }

        const cookieValue = this._createCookieString(key,
            BasePropertiesStorage._prepareValue(value), force);

        if (cookieValue.length < this._maxLength) {
            document.cookie = cookieValue;
        } else {
            throw 'Превышена максимальная длинна куки';
        }
    }

    get(key) {
        const matches = this._getCookieValue(key);

        return matches
            ? BasePropertiesStorage._prepareTypeResult(
                decodeURIComponent(matches), key, this._getTypeItem(key))
            : matches;
    }

    delete(key) {
        document.cookie = encodeURIComponent(this._buildKey(key)) + '=; max-age=-1';
    }

    clear() {
        const allCookies = document.cookie.split(';');

        allCookies.forEach((cookie) => {
            const cookieName = cookie.indexOf('=')
                ? cookie.split('=')[0]
                : null;

            if (cookieName) {
                this.delete(cookieName);
            }
        })
    }

    changePath(newPath) {
        this._path = newPath;
    }

    changeDomain(newDomain) {
        this._domain = newDomain;
    }

    changeExpires(newExpires) {
        this._expires = newExpires.toUTCString();
    }

    changeMaxAge(newMaxAgeSeconds) {
        this._maxAge = newMaxAgeSeconds;
    }

    changeSecure(newSecure) {
        this._isSecure = newSecure;
    }

    _createCookieString(key, value, force) {
        let cookieValue = encodeURIComponent(
            (!force ? this._buildKey(key) : key)).trim() + '='
            + encodeURIComponent(value) + '; path=' + this._path;

        if (this._domain) {
            cookieValue += '; domain=' + this._domain;
        }

        if (this._expires) {
            cookieValue += '; expires=' + this._expires;
        } else {
            cookieValue += '; max-age=' + this._maxAge;
        }

        if (this._isSecure) {
            cookieValue += '; secure';
        }

        return cookieValue;
    }

    _getCurrentTypeItem() {
        const typeItem = this._getCookieValue(this._keyTypeItem, true);
        return typeItem ? JSON.parse(decodeURIComponent(typeItem)) : {};
    }

    _setTypeItemInStorage(key, value) {
        this.set(key, value, true);
    }

    _getCookieValue(key, force) {
        const allCookies = document.cookie.split(';');
        let matches = null;

        allCookies.forEach((cookie) => {
            if (cookie) {
                const cookiePart = cookie.split('=');

                if (cookiePart[0].trim() === (!force ? this._buildKey(key) : key)) {
                    matches = cookiePart[1];
                }
            }
        });

        return matches;
    }
}

export {SessionStorage, LocalStorage, CookieStorage};
