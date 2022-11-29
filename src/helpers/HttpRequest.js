import {default as axios} from 'axios';
import {AuthHelpers} from "@/helpers/AuthHelpers";
/**
 * Класс стандартизированых запросов
 */
export default class HttpRequest {
    /**
     * Стандантизированная отправка закпроса на БЛ
     *
     * @param params Данные для запроса
     * @param filter Фильтр
     * @param endpointName Имя конечной точки
     * @param method Название метода
     * @returns {Promise<{error_text: string, success: boolean}>} Результат с БЛ
     */
    static async sendRequest(params, filter, endpointName, method) {
        let result = {success: false, error_text: ''};

        if (!endpointName) {
            throw 'Не передана конечная точка запроса';
        }

        if (!method) {
            throw 'Не передан метод для запроса';
        }

        const url = 'http://127.0.0.1:5000/service'

        const requestParams = {
            endpointName,
            method,
            data: {
                filter: {
                    'X-User_ID': AuthHelpers.getUser(),
                    ...filter
                },
                params
            }
        }

        await axios.post(url, requestParams)
            .then((response) => {
                result = response.data;
            })
            .catch(({error}) => {
                result.error_text = error
            });

        return result;
    }
}