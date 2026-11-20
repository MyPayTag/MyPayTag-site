export function quoteAmountValue(input: string, mode: "usd" | "token"): string {
  const value = input.trim();
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value) || !Number.isFinite(Number(value)) || Number(value) <= 0) {
    throw new Error("Enter a positive decimal amount.");
  }
  return mode === "usd" ? Number(value).toFixed(2) : value.startsWith(".") ? `0${value}` : value;
}
