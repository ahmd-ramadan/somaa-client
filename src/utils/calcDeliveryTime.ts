export const calcDeliveryTime = ({
    locale,
    timeToMake,
    timeZone = 'Africa/Cairo'
}: {
    locale: string;
    timeToMake: number;
    timeZone?: string;
}) => {
    const toDate = new Date();
    
    // Check if toDate is valid
    if (isNaN(toDate.getTime())) {
        // console.error("Invalid date format for toDate");
        return "Invalid date";
    }

    // Validate timeToMake
    if (typeof timeToMake !== 'number' || !isFinite(timeToMake) || timeToMake < 0) {
        // console.error("Invalid timeToMake value:", timeToMake);
        return "Invalid time";
    }

    // Calculate the start and end delivery dates
    const startDate = new Date(toDate);
    startDate.setDate(startDate.getDate() + timeToMake);

    // Check if startDate is valid
    if (isNaN(startDate.getTime())) {
        // console.error("Invalid date format for startDate");
        return "Invalid delivery date";
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3); // Add 3 days to start date

    // Check if endDate is valid
    if (isNaN(endDate.getTime())) {
        // console.error("Invalid date format for endDate");
        return "Invalid delivery date";
    }

    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        timeZone
    };

    const localeMapping: Record<string, string> = {
        ar: 'ar-EG',
        en: 'en-US'
    };

    const localeTime = localeMapping[locale] || 'ar-EG';
    const formatter = new Intl.DateTimeFormat(localeTime, options);

    // Format the start and end dates
    const formattedStartDate = formatter.format(startDate);
    const formattedEndDate = formatter.format(endDate);

    return `${formattedStartDate} - ${formattedEndDate}`;
};
