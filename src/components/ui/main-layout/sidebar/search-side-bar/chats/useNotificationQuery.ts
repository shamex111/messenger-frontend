import { useQuery } from '@tanstack/react-query';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';

export const useNotificationQuery = (dto: any) => {
  // Проверяем, что dto имеет валидные данные для выполнения запроса
  if (!dto.smthId || !dto.type) {
    return { isLoading: false, data: null, error: null };
  }

  // Выполняем запрос только если параметры корректны
  const { isLoading, data, error } = useQuery({
    queryKey: ['findNotification', dto.smthId, dto.type],
    queryFn: async () => {
      if (dto.type === 'channel') {
        return channelService.getNotification(dto);
      }
      if (dto.type === 'group') {
        return groupService.getNotification(dto);
      }
      throw new Error('Unsupported notification type');
    },
    // В случае, если данные для запроса отсутствуют, возвращаем пустой результат
    enabled: !!dto.smthId && !!dto.type, // Запрос активен только при наличии корректных параметров
  });

  return { isLoading, data, error };
};
