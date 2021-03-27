import { format, subDays } from 'date-fns';
import { DATE_FORMAT } from '~const';

/**
 * 작업지시 기본 조회 기간 반환
 */
export function getDefaultOrderedAtRange() {
  return [format(subDays(new Date(), 14), DATE_FORMAT), format(new Date(), DATE_FORMAT)];
}
