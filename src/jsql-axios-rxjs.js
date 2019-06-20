/*
 * Copyright (c) 2017-2019 JSQL Sp. z.o.o. (Ltd, LLC) www.jsql.it
 * See LICENSE or https://jsql.it/public-packages-license
 */

"use strict";

import axios from 'axios';
import {Observable, from} from 'rxjs';

export default function JsqlService(config) {

    /**
     * Overridie @request function
     * @param requestUrl
     * @param requestData
     * @param requestHeaders
     * @returns promise
     */
    window.JSQL.prototype.request = function (requestUrl, requestData, requestHeaders) {
        return from(axios({
            url: requestUrl,
            method: 'POST',
            dataType: 'json',
            headers: requestHeaders,
            data: requestData
        }));
    };

    /**
     * Overridie @wrap function
     * @param token
     * @param queryType
     * @returns promise
     */
    window.JSQL.prototype.wrap = function (token, queryType, selfReference) {

        let requestObservableWrapper = this.construct(token, queryType);
        requestObservableWrapper.__rxobservable = Observable.create((observer) => {

            requestObservableWrapper.checkAndCreateXhrPromise();

            requestObservableWrapper.xhrPromise
                .subscribe((res) => {
                    res = requestObservableWrapper.thenRxjs(res);
                    observer.next(res);
                }, (err) => {
                    err = requestObservableWrapper.catchRxjs(err);
                    observer.error(err);
                });
        });

        requestObservableWrapper.rx = function () {
            return requestObservableWrapper.__rxobservable;
        };

        requestObservableWrapper.observe = function () {
            return requestObservableWrapper.__rxobservable;
        };

        requestObservableWrapper.ok = function () {
            return requestObservableWrapper.__rxobservable.subscribe((res) => {
            });
        };

        return requestObservableWrapper;

    };

    config.rxjs = true;
    this.__jsqlInstance = new window.JSQL(config);

    return this.__jsqlInstance;

}