import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, filter, take, switchMap } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { APIService } from '../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';

@Injectable()
export class MyInterceptor implements HttpInterceptor {

    private requests: HttpRequest<any>[] = [];
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
    );

    constructor(
        private loaderService: LoaderService,
        private apiService: APIService,
        private router: Router,
        private commonServices: CommonService
    ) { }

    removeRequest(requests: HttpRequest<any>) {
        const i = this.requests.indexOf(requests);
        if (i >= 0) {
            this.requests.splice(i, 1);

        }
        // console.log(i, this.requests.length);
        this.loaderService.isLoading.next(0 > 0);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.requests.push(request);
        this.loaderService.isLoading.next(true);
        const access_token: string = `Bearer ${this.apiService.accessToken()}`;
        request = request.clone({withCredentials: true});
        if (access_token) {
            request = request.clone({ headers: request.headers.set('Authorization', access_token) });
        }

        if (!request.headers.has('Content-Type')) {
            // request = request.clone({ headers: request.headers.set('Content-Type', 'multipart/form-data') });
            request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                    this.removeRequest(request);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let data = {};
                data = {
                    reason: error && error.error.reason ? error.error.reason : '',
                    status: error.status
                };
                this.removeRequest(request);
                if (error.status === 0) {
                    this.commonServices.hideLoader();
                    localStorage.clear();
                    this.router.navigate(['/login']);
                    this.commonServices.error('Please check your Network connection', '');
                    return throwError(error);
                }
                if (error.status === 401) {
                    this.commonServices.hideLoader();
                    this.commonServices.error(error.error.message, '');
                    localStorage.clear();
                    this.router.navigate(['/login']);
                    return throwError(error);
                }
                if (error.status === 422) {
                    this.commonServices.hideLoader();
                    if (error.error) {
                        if (error.error.errors) {
                            this.commonServices.error(error.error.errors[0].message, '');
                        }
                        if (error.error.message) {
                            this.commonServices.error(error.error.message, '');
                        }
                        if (error.error.message === 'milestoneId: Milestone should be a valid mongo Id') {
                            this.router.navigate(['/pagenotfound']);
                        }
                    } else {
                        this.commonServices.error('422 Unprocessable Entity', '');
                    }
                    return throwError(error);
                }
                if (error.status === 500) {
                    this.commonServices.hideLoader();
                    this.commonServices.error('500 Internal Server Error', '');
                    return throwError(error);
                }
                if (error.status === 403) {
                    this.commonServices.hideLoader();
                    this.commonServices.error(error.error.message, '');
                    return throwError(error);
                }
                if (error.status === 404) {
                    this.commonServices.hideLoader();
                    this.commonServices.error('404 User not Found', '');
                    return throwError(error);
                } else {
                    this.commonServices.hideLoader();
                    this.commonServices.error(error.error.message, '');
                    return throwError(error);
                }
            }));
    }

    private hideLoader(): void {
        this.loaderService.isLoading.next(false);
    }


    // intercept(req, next) {
    //     const bearertoken = req.clone({

    //         setHeaders: { Authorization: `Bearer ${this.apiService.accessToken()}` ? `Bearer ${this.apiService.accessToken()}` : '' }


    //     });

    //     return next.handle(bearertoken);
    // }

    // removeRequest(requests: HttpRequest<any>) {
    //     const i = this.requests.indexOf(requests);
    //     if (i >= 0) {
    //         this.requests.splice(i, 1);
    //     }
    //     this.loaderService.isLoading.next(0 > 0);
    // }

    // // function which will be called for all http calls
    // intercept(
    //     request: HttpRequest<any>,
    //     next: HttpHandler
    // ): Observable<HttpEvent<any>> {
    //     // how to update the request Parameters
    //     this.loaderService.isLoading.next(true);
    //     const access_token: string = localStorage.getItem('Access_Token');
    //     if (access_token) {
    //         request = this.addToken(request);
    //     }
    //     return next.handle(request).pipe(
    //         map((event: HttpEvent<any>) => {
    //             if (event instanceof HttpResponse) {
    //                 this.removeRequest(request);
    //             }
    //             return event;
    //         }),
    //         catchError(error => {

    //             // hide loader
    //             this.loaderService.isLoading.next(false);
    //             return throwError(error);

    //             // if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 422)) {
    //             //     // return this.handle401Error(request, next);
    //             //     return;
    //             // } else {
    //             //     return throwError(error);
    //             // }

    //         })
    //     );
    // }
    // private addToken(request: HttpRequest<any>) {
    //     return request.clone({
    //         setHeaders: {
    //             Authorization: `Bearer ${localStorage.getItem('Access_Token')}`
    //         }
    //     });
    // }

}
