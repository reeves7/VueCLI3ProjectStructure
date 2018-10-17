import http from '../http';

export interface ResponseData {
  message: string;
  payload: any;
}

export const ToolList = async (requestParam: any): Promise<any> => {
  try {
    const response = await http.get<ResponseData>('/user', { params: requestParam });
    return response.data.payload;
  } catch (e) {
    throw e;
  }
};
