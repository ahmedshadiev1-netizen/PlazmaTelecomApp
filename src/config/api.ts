import { Platform } from 'react-native';

const REMOTE_DEFAULT = 'http://192.168.56.1:8000';
const LOCAL_ANDROID = 'http://10.0.2.2:8000';
const LOCAL_IOS = 'http://127.0.0.1:8000';
const STORAGE_KEY = 'api_base_url_override';

export const API_TIMEOUT_MS = 12000;
export const API_STORAGE_KEY = STORAGE_KEY;

export const sanitizeBaseUrl = (value: string): string => {
  try {
    const trimmed = value.trim();
    const url = new URL(trimmed);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Unsupported protocol');
    }
    return url.origin;
  } catch (_) {
    return REMOTE_DEFAULT;
  }
};

export const getSuggestedLocalUrl = (): string =>
  Platform.OS === 'android' ? LOCAL_ANDROID : LOCAL_IOS;

export const getDefaultBaseUrl = (): string => {
  if (__DEV__) {
    return sanitizeBaseUrl(getSuggestedLocalUrl());
  }
  return sanitizeBaseUrl(REMOTE_DEFAULT);
};
