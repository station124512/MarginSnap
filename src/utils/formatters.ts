import { Currency } from '../types/margin';

export function formatCurrency(value: number, currency: Currency = 'KRW'): string {
  if (isNaN(value) || !isFinite(value)) return '0';

  if (currency === 'USD') {
    return `$${Number(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (currency === 'JPY') {
    return `¥${Math.round(value).toLocaleString('ja-JP')}`;
  }

  // KRW 기본
  return `₩${Math.round(value).toLocaleString('ko-KR')}`;
}

export function formatSignedCurrency(value: number, currency: Currency = 'KRW'): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  const prefix = value > 0 ? '+ ' : value < 0 ? '- ' : '';
  const absVal = Math.abs(value);

  if (currency === 'USD') {
    return `${prefix}$${absVal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (currency === 'JPY') {
    return `${prefix}¥${Math.round(absVal).toLocaleString('ja-JP')}`;
  }

  return `${prefix}₩${Math.round(absVal).toLocaleString('ko-KR')}`;
}

export function formatPercent(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0.0%';
  if (Math.abs(value) > 99999) return '>99,999%';
  return `${Number(value).toFixed(1)}%`;
}

// 구 버전 호환용 alias
export const formatWon = (value: number) => formatCurrency(value, 'KRW');
export const formatSignedWon = (value: number) => formatSignedCurrency(value, 'KRW');
