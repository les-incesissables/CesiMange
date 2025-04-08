import { IRoutePermission } from "./IRoutePermission";

export interface IServiceDefinition
{
    routeName: string;
    BaseUrl: string;
    enabled: boolean;
    publicRoutes?: IRoutePermission[];
    protectedRoutes?: IRoutePermission[];
}