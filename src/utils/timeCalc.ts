export const timeCalc = (date: Date, exact: boolean, plusTime?: boolean) => {
  const now = new Date();
  if (!(date instanceof Date)) {
    throw new Error('Provided date is not a valid Date object');
  }

  const timeDifference = now.getTime() - date.getTime();
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const weeksDifference = Math.floor(daysDifference / 7);
  const monthsDifference = Math.floor(
    now.getMonth() -
      date.getMonth() +
      12 * (now.getFullYear() - date.getFullYear())
  );

  if (exact) {
    if (minutesDifference < 1) {
      return 'Только что';
    } else if (minutesDifference < 60) {
      if (minutesDifference === 1) {
        return 'Минуту назад';
      } else if (minutesDifference % 10 > 1 && minutesDifference % 10 < 4) {
        return `${minutesDifference} минуты назад`;
      }
      return `${minutesDifference} минут назад`;
    } else if (hoursDifference < 2) {
      return 'Час назад';
    } else if (hoursDifference < 24) {
      if (hoursDifference % 10 > 1 && hoursDifference % 10 < 4) {
        return `${hoursDifference} часа назад`;
      }
      return `${hoursDifference} часов назад`;
    } else if (daysDifference === 1) {
      return 'Вчера';
    } else if (daysDifference < 7) {
      if (daysDifference < 4) {
        return `${daysDifference} дня назад`;
      }
      return `${daysDifference} дней назад`;
    } else if (weeksDifference < 4) {
      if (weeksDifference === 1) {
        return 'Неделю назад';
      }
      return `${weeksDifference} недели назад`;
    } else if (monthsDifference < 1) {
      return 'Этот месяц';
    } else if (monthsDifference < 12) {
      if (monthsDifference === 1) {
        return 'Месяц назад';
      }
      if (monthsDifference % 10 > 1 && monthsDifference % 10 < 4) {
        return `${monthsDifference} месяца назад`;
      }
      return `${monthsDifference} месяцев назад`;
    } else {
      return 'Давно';
    }
  } else {
    const optionsForTime = { hour: '2-digit', minute: '2-digit' } as const;
    const optionsForWeekday = { weekday: 'short' } as const;
    const optionsForFullDate = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    } as const;

    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
      month: 'short',
    });

    const monthNames = {
      янв: 'янв',
      фев: 'фев',
      мар: 'марта',
      апр: 'апр',
      май: 'мая',
      июн: 'июн',
      июл: 'июл',
      авг: 'авг',
      сен: 'сент',
      окт: 'окт',
      ноя: 'нояб',
      дек: 'дек',
    };

    const formatDate = (d: Date) => {
      const day = d.getDate();
      const month = dateFormatter.format(d).slice(0, 3);
      return `${day} ${monthNames[month as keyof typeof monthNames]}`;
    };

    const formatWithTime = (formattedDate: string, d: Date) => {
      return plusTime
        ? `${formattedDate}, ${new Intl.DateTimeFormat('ru-RU', optionsForTime).format(d)}`
        : formattedDate;
    };

    if (daysDifference < 1) {
      // Сегодня - показать время
      return new Intl.DateTimeFormat('ru-RU', optionsForTime).format(date);
    } else if (daysDifference < 7) {
      // На неделе - показать день недели + возможно время
      return formatWithTime(
        new Intl.DateTimeFormat('ru-RU', optionsForWeekday).format(date),
        date
      );
    } else if (now.getFullYear() === date.getFullYear()) {
      // В этом году - показать день и месяц + возможно время
      return formatWithTime(formatDate(date), date);
    } else {
      // В предыдущие годы - показать день, месяц и год + возможно время
      const formattedDate = new Intl.DateTimeFormat('ru-RU', optionsForFullDate).format(date);
      return formatWithTime(
        formattedDate.replace(
          /(\d{2}) (\S{3}) (\d{4})/,
          (_, day, month, year) => {
            return `${day} ${monthNames[month as keyof typeof monthNames]} ${year} г.`;
          }
        ),
        date
      );
    }
  }
};
  