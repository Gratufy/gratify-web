export function getBusinessStatusBgColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-[#05b456]/35';
    case 'hidden':
      return 'bg-[#7c7c7c]/30';
    case 'rejected':
      return 'bg-[#c71143]/30';
    case 'pending':
      return 'bg-[#eae7dd]';
  }
}

export function getBusinessStatusCardBgColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-[#eae7dd]';
    case 'hidden':
      return 'bg-[#f9f9f9]';
    case 'rejected':
      return 'bg-[#dcdcdc]';
    case 'pending':
      return 'bg-[#f5f3f0]';
  }
}
