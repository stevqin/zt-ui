import QRCode from 'qrcode';
import type { ZtQRCodeLevel } from './types';
export function encodeQRCode(value: string, level: ZtQRCodeLevel = 'M') {
  const result = QRCode.create(value, { errorCorrectionLevel: level });
  return { size: result.modules.size, data: result.modules.data };
}
