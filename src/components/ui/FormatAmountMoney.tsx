import { formatCurrency } from "@/utils/formatCurrency";
import { useLocale } from "next-intl";

const FormatPrice = ({ locale, amount, className }: { locale?: string; amount: number; className?: string }) => {
    locale = useLocale();
    
    // Format the number with commas and two decimal places
    const formattedAmount = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

    // Make the decimal part smaller using HTML for styling
    const [whole, decimal] = formattedAmount.split('.');
    const currency = formatCurrency(locale);
    return (
        <p className={`${className}`}>{whole}<span style={{ fontSize: "smaller" }}>.{decimal}</span> {currency}</p>
    );
};

export default FormatPrice;