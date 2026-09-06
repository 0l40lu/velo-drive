export interface CountryCurrencyConfig {
  country: string;
  code: string;
  symbol: string;
  name: string;
  flag: string;
  exchangeRate: number; // 1 USD = exchangeRate target currency
  symbolPosition: 'prefix' | 'suffix';
  decimalPlaces: number;
}

export const SUPPORTED_COUNTRIES: CountryCurrencyConfig[] = [
  {
    country: 'United States',
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    exchangeRate: 1.0,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'United Kingdom',
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    exchangeRate: 0.79,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'Germany',
    code: 'EUR',
    symbol: '€',
    name: 'Euro (Germany)',
    flag: '🇩🇪',
    exchangeRate: 0.92,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'France',
    code: 'EUR',
    symbol: '€',
    name: 'Euro (France)',
    flag: '🇫🇷',
    exchangeRate: 0.92,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'Canada',
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    exchangeRate: 1.36,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'Australia',
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    exchangeRate: 1.53,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'Japan',
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    flag: '🇯🇵',
    exchangeRate: 155.0,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'Nigeria',
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    flag: '🇳🇬',
    exchangeRate: 1500.0,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'United Arab Emirates',
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    exchangeRate: 3.67,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'Switzerland',
    code: 'CHF',
    symbol: 'CHF ',
    name: 'Swiss Franc',
    flag: '🇨🇭',
    exchangeRate: 0.89,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'India',
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    exchangeRate: 83.5,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'Brazil',
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    flag: '🇧🇷',
    exchangeRate: 5.45,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'Singapore',
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    exchangeRate: 1.35,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  {
    country: 'South Africa',
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    flag: '🇿🇦',
    exchangeRate: 18.5,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  }
];

const DEFAULT_CURRENCY = SUPPORTED_COUNTRIES[0]; // USD

/**
 * Returns the currency config for a given country name or currency code.
 */
export function getCurrencyForCountry(countryOrCode?: string): CountryCurrencyConfig {
  if (!countryOrCode) return DEFAULT_CURRENCY;
  const query = countryOrCode.trim().toLowerCase();

  const match = SUPPORTED_COUNTRIES.find(
    c =>
      c.country.toLowerCase() === query ||
      c.code.toLowerCase() === query ||
      c.name.toLowerCase().includes(query)
  );

  return match || DEFAULT_CURRENCY;
}

/**
 * Converts a base USD amount to the target country's currency.
 */
export function convertUSD(amountInUSD: number, countryOrCode?: string): number {
  const config = getCurrencyForCountry(countryOrCode);
  return amountInUSD * config.exchangeRate;
}

/**
 * Formats a base USD amount into a nicely styled localized currency string.
 * e.g. formatCurrency(185, 'United Kingdom') => '£146'
 *      formatCurrency(185, 'Japan') => '¥28,675'
 *      formatCurrency(185, 'Nigeria') => '₦277,500'
 */
export function formatCurrency(
  amountInUSD: number,
  countryOrCode?: string,
  options?: {
    showCode?: boolean;
    decimals?: number;
    forceDecimals?: boolean;
  }
): string {
  const config = getCurrencyForCountry(countryOrCode);
  const converted = amountInUSD * config.exchangeRate;

  let decimals = options?.decimals;
  if (decimals === undefined) {
    if (options?.forceDecimals) {
      decimals = config.decimalPlaces > 0 ? config.decimalPlaces : 2;
    } else if (config.code === 'JPY' || config.code === 'NGN' || config.code === 'INR') {
      decimals = 0;
    } else {
      // If converted number has fractional cents and user wants precision
      decimals = converted % 1 !== 0 && converted < 1000 ? 2 : 0;
    }
  }

  const formattedNumber = converted.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  const withSymbol =
    config.symbolPosition === 'prefix'
      ? `${config.symbol}${formattedNumber}`
      : `${formattedNumber} ${config.symbol}`;

  if (options?.showCode) {
    return `${withSymbol} ${config.code}`;
  }

  return withSymbol;
}

/**
 * Quick helper for daily car rate (clean whole number formatting)
 */
export function formatDailyRate(dailyPriceUSD: number, countryOrCode?: string): string {
  return formatCurrency(dailyPriceUSD, countryOrCode, { decimals: 0 });
}
