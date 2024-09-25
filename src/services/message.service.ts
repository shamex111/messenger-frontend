import { axiosWithAuth } from '@/api/interceptors';

import { API_URl } from '@/config/api.config';

import {
    IAttachment,
  IMessageBase,
  IMessageEdit,
  IMessageForm
} from '@/types/message.types';

class MessageService {
  async createMessage(data: IMessageForm) {
    return axiosWithAuth.post<IMessageBase>(API_URl.message(), data);
  }
  async getMessage(id: number) {
    return axiosWithAuth.get<IMessageBase>(API_URl.message(`${id}`));
  }
  async editMessage(id: number, data: IMessageEdit) {
    return axiosWithAuth.patch<IMessageBase>(API_URl.message(`${id}`), data);
  }
  async deleteMessage(id: number) {
    return axiosWithAuth.delete<IMessageBase>(API_URl.message(`${id}`));
  }
  async markAsRead(id: number) {
    return axiosWithAuth.patch(API_URl.message(`read-message/${id}`));
  }
  async attachment(data:IAttachment){
    return axiosWithAuth.post(API_URl.message('attachment'), data)
  }
}

export default new MessageService();
