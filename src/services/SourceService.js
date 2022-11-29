import HttpRequest from "@/helpers/HttpRequest";

/**
 * Класс - сервис для запросов на БЛ
 */
export default class SourceService {
    /**
     * Базовые настройки запроса
     *
     * @type {{endpoint: string, keyProperty: string, bindind: {query: string, create: string, update: string, list: string, delete: string}}}
     * @private
     */
    _params = {
        endpoint: '',
        keyProperty: 'id',
        bindings: {
            create: 'Create',
            query: 'Get',
            update: 'Update',
            delete: 'Delete',
            list: 'List'
        }
    };
    /**
     * Признак корректной настройки источника данных
     *
     * @type {boolean}
     * @private
     */
    _isCorrect = false;

    constructor(params) {
        this._prepareParams(params || {});
    }

    /**
     * Запрос одной записи по ключу
     *
     * @param key Ключ
     * @returns {Promise<*>} Запись
     */
    async query(key) {
        return await this._sendRequest(key, this._params.bindings.query);
    }

    /**
     * Фиктивное создание записи
     *
     * @param record Запись с предустановленными значениями полей
     * @returns {Promise<*>} Запись с форматом
     */
    async create(record) {
        return await this._sendRequest(record, this._params.bindings.create);
    }

    /**
     * Удаление записи по ключу
     *
     * @param key Ключ
     * @returns {Promise<*>} Признак успешности
     */
    async delete(key) {
        return await this._sendRequest(key, this._params.bindings.delete);
    }

    /**
     * Обновление записи в БД
     *
     * @param record Запись
     * @returns {Promise<*>} Запись из БД
     */
    async update(record) {
        return await this._sendRequest(record, this._params.bindings.update);
    }

    /**
     * Списочный метод
     *
     * @param filter Прарметры фильтрации
     * @returns {Promise<*>} Список записей
     */
    async list(filter = {}) {
        return await this._sendRequest(null,
            this._params.bindings.list, filter);
    }

    /**
     * Выполнение кастомного запроса по ключу
     *
     * @param key Ключ метода из binding
     * @param data Данные метода
     * @returns {Promise<*>} Результат метода
     */
    async customQuery(key, data) {
        if (!this._params.bindings[key]) {
            throw 'Данный метод не поддерживает';
        }
        return this._sendRequest(data, this._params.bindings[key]);
    }

    /**
     * Настройка параметров источника данных
     *
     * @param params Парметры источника
     * @private
     */
    _prepareParams(params) {
        if (!params.endpoint) {
            throw 'Не перадана конечная точка для запроса';
        }

        this._params = {
            endpoint: params.endpoint,
            keyProperty: params.keyProperty || this._params.keyProperty,
            bindings: {
                ...this._params.bindings,
                ...params.bindings
            }
        };

        this._isCorrect = true;
    }

    /**
     * Отправка запроса на БЛ
     *
     * @param params Параметры запроса
     * @param method Имя метода
     * @param filter Параметры фильтрации
     * @returns {Promise<{error_text: string, success: boolean}>} Результат запроса
     * @private
     */
    async _sendRequest(params, method, filter = null) {
        return await HttpRequest
            .sendRequest(params, filter,
                this._params.endpoint, method);
    }
}