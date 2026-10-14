// Supported fiat currencies and approximate USD exchange rates for fallback use.
export const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.4 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 151.6 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.52 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.37 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.9 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 7.24 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.35 },
  { code: "KRW", name: "South Korean Won", symbol: "₩", rate: 1375 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", rate: 5.1 },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", rate: 16.7 },
  { code: "ZAR", name: "South African Rand", symbol: "R", rate: 18.2 },
];

export const fallbackExchangeRates = Object.fromEntries(
  currencies.map(({ code, rate }) => [code, rate]),
);
