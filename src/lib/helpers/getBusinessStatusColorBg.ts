export function getBusinessStatusBgColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-[#05b456]/35';
    case 'hidden':
      return 'bg-grey-500';
    case 'rejected':
      return 'bg-[#c71143]/30';
    case 'pending':
      return 'bg-[#eae7dd]';
  }
}
