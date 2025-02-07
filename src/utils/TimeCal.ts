export const TimeCal = (created_at: string | Date): string => {
  const datecal = new Date(created_at).getTime();
  const today = new Date().getTime();
  const dayDifference = Math.abs(
    Math.round((today - datecal) / (1000 * 3600 * 24))
  );

  if (dayDifference < 1) {
    const hourDifference = Math.abs(
      Math.round((today - datecal) / (1000 * 3600))
    );

    if (hourDifference < 1) {
      const minuteDifference = Math.abs(
        Math.round((today - datecal) / (1000 * 60))
      );

      if (minuteDifference < 1) {
        const secondDifference = Math.abs(Math.round((today - datecal) / 1000));
        return secondDifference > 1
          ? `${secondDifference} seconds ago`
          : "created just now";
      }

      return minuteDifference === 1
        ? "1 minute ago"
        : `${minuteDifference} minutes ago`;
    }

    return hourDifference === 1 ? "1 hour ago" : `${hourDifference} hours ago`;
  }

  if (dayDifference === 1) return "1 day ago";

  const yearDifference = Math.abs(
    Math.round((today - datecal) / (1000 * 3600 * 24 * 30 * 12))
  );
  if (yearDifference >= 1) return `${yearDifference} years ago`;

  const monthDifference = Math.abs(
    Math.round((today - datecal) / (1000 * 3600 * 24 * 30))
  );
  if (monthDifference >= 1) return `${monthDifference} months ago`;

  return `${dayDifference} days ago`;
};

export const DeliveryDelayCal = (days_left_for_delivery: number): string => {
  const today = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(today.getDate() + days_left_for_delivery);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = deliveryDate.toLocaleDateString("en-US", options);

  if (days_left_for_delivery > 0) {
    return `Expected delivery on ${formattedDate}`;
  } else if (days_left_for_delivery === 0) {
    return "Delivery expected today";
  } else {
    const delayDays = Math.abs(days_left_for_delivery);
    return delayDays === 1
      ? `Delayed by 1 day since ${formattedDate}`
      : `Delayed by ${delayDays} days since ${formattedDate}`;
  }
};

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Ensures AM/PM format
  });

  return `${formattedDate}, ${formattedTime}`;
};
