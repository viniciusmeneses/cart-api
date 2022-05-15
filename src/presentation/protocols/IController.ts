import { Http } from "./Http";

export interface IController {
  handle(request: Http.IRequest): Promise<Http.IResponse>;
}
