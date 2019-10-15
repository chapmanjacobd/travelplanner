export const passportModeChange = SG => ({
  type: 'PASSPORT_MODE_CHANGE',
  mode: SG,
});

export const passportGroupUpdate = groupStatus => ({
  type: 'PASSPORT_GROUP_UPDATE',
  groupStatus,
});

export const passportSingleUpdate = (inner, result) => ({
  type: 'PASSPORT_SINGLE_UPDATE',
  inner,
  result,
});

export const passportSync = status => ({
  type: 'PASSPORT_SYNC',
  status,
});

export function increasePassport() {
  return { type: 'INCREASE_PASSPORT' };
}
