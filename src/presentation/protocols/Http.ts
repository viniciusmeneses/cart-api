export namespace Http {
  export interface IRequest<Body = any, UrlParams = any, UrlQuery = any> {
    body?: Body;
    url?: {
      params: UrlParams;
      query: UrlQuery;
    };
  }

  export interface IResponse {
    status: number;
    body?: any;
  }
}
