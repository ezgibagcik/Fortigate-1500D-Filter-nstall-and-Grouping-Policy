import { Policy } from "./policy";
import { ResponseModel } from "./responseModel";

export interface PolicyResponseModel extends ResponseModel{
    results:Policy[],
}