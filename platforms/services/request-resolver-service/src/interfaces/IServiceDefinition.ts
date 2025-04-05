import { IRoutePermission } from "./IRoutePermission";

export interface IServiceDefinition
{
    apiName: string;
    BaseUrl: string;
    enabled: boolean;
    publicRoutes?: IRoutePermission[];
    protectedRoutes?: IRoutePermission[];
}