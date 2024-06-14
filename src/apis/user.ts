import { axiosInstance } from './axiosInstance';
import { GetUserRequest, GetUserResponse } from '../types/apis/user/getUser';

//'42455be1-ea49-49cc-a89f-1400c96fce09'

export const getUser = async (user_id: string): Promise<GetUserResponse> => {
  try {
    const response = await axiosInstance.get<GetUserResponse>(`/users/${user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Error fetching user data');
  }
};

export const getUserItem = async (user_Id: string): Promise<GetUserRequest> => {
  const response = await axiosInstance.get<GetUserRequest>(`/users/${user_Id}`);
  return response.data;
};

export const signup = async (email: string, password: string, type: string) => {
  try {
    const response = await axiosInstance.post('/users', { email, password, type });
    return response.data;
    console.log('로그인 성공');
    router.push('/');
  } catch (error) {
    console.error('로그인 실패', error);
  }
};
