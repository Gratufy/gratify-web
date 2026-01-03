export function getBusinessStatusBgColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-[#8ec89a] '; //hover:shadow-[1px 2px 10px 2px #dcdcdc]#8ec89a bg-[#05b456]/35
    case 'hidden':
      return 'bg-[#efefef]'; //background-grey-100 bg-[#7c7c7c]/30
    case 'rejected':
      return 'bg-[#c71143]/50'; //bg-[#c71143]/30
    case 'pending':
      return 'bg-[#dfd077]'; //#dfd077; bg-[#eae7dd]
    case 'draft':
      return 'bg-[#fff]';
  }
}

export function getStatusBgAddClasses(status: string) {
  switch (status) {
    case 'approved':
      return 'focus:bg-[#05b456] '; //hover:shadow-[1px 2px 10px 2px #dcdcdc]#8ec89a bg-[#05b456]/35
    case 'hidden':
      return 'focus:bg-[#dcdcdc]'; //background-grey-100 bg-[#7c7c7c]/30
    case 'rejected':
      return 'focus:bg-[#c71143]/80'; //bg-[#c71143]/30
    case 'pending':
      return 'focus:bg-[#d8c13a]'; //#dfd077; bg-[#eae7dd]
    case 'draft':
      return 'focus:bg-[#efefef]';
  }
}
export function getBusinessStatusCardBgColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-[#eae7dd]';
    case 'hidden':
      return 'bg-[#bdbdbd]';
    case 'rejected':
      return 'bg-[#dcdcdc]';
    case 'pending':
      return 'bg-[#f5f3f0]';
    case 'draft':
      return 'bg-[#f9f9f9]';
  }
}
