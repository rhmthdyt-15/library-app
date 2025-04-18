import { wrapTokenAsHeader } from "../../common/helpers/http";
import apiConfig from "../../config/api";
import HTTPClient from "../../lib/http";
import {
  AuthChangePasswordRequestBody,
  AuthLoginBodyRequest,
  AuthLoginResponse,
  AuthProfileResponse,
  AuthRegisterBodyRequest,
  AuthUpdateProfileRequestBody,
  AuthUpdateProfileResponse,
} from "./interface";

const httpClient = HTTPClient(apiConfig.service.main);

export const authLoginService = (
  body: AuthLoginBodyRequest
): Promise<AuthLoginResponse> =>
  httpClient.postHttpRequest<AuthLoginResponse>("/api/auth/login", body);

export const authRegisterService = (
  body: AuthRegisterBodyRequest
): Promise<AuthLoginResponse> =>
  httpClient.postHttpRequest<AuthLoginResponse>("/api/auth/register", body);

export const authLogoutService = (token: string): Promise<any> =>
  httpClient.postHttpRequest<any>(
    "/api/auth/logout",
    {},
    { headers: wrapTokenAsHeader(token) }
  );

export const getProfileService = (
  token: string
): Promise<AuthProfileResponse> =>
  httpClient.getHttpRequest<AuthProfileResponse>("/api/profile", {
    headers: wrapTokenAsHeader(token),
  });

export const updateProfileService = (
  token: string,
  body: AuthUpdateProfileRequestBody
): Promise<AuthUpdateProfileResponse> =>
  httpClient.putHttpRequest<AuthUpdateProfileResponse>("/api/profile", body, {
    headers: wrapTokenAsHeader(token),
  });

export const changePasswordService = (
  token: string,
  body: AuthChangePasswordRequestBody
): Promise<any> =>
  httpClient.putHttpRequest<any>("/api/change-password", body, {
    headers: wrapTokenAsHeader(token),
  });
