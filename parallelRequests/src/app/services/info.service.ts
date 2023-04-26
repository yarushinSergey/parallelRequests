import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of, range} from "rxjs";
import {concatMap, delay, map, mergeMap} from "rxjs/operators";

@Injectable()
export class InfoService {
  private readonly apiUrl= '/api';

  constructor(private http: HttpClient) { }

  sendParamsRequest(): Observable<any> {
    return this.http.post(this.apiUrl, { "action": "params" });
  }

  sendProcessRequests(count: number, delayParam: number): Observable<any> {
    return range(1, count)
      .pipe(
        concatMap((val,i) => of(val).pipe(i === 0 ? delay(0) : delay(delayParam))),
        mergeMap(
          (index)=>this.sendProcessRequest(index)
        ),
        map((response,index)=> `${response.index}. Запрос отправлен: ${response.requestTime}, Ответ: ${JSON.stringify(response.data)}`),
      );

  }

  private sendProcessRequest(index: number): Observable<any> {
    const requestTime = new Date().toLocaleTimeString();
    return this.http.post(this.apiUrl, { action: 'process' }).pipe(
      mergeMap(response => {
        return of({ requestTime, data: response, index: index });
      })
    );
  }
}
