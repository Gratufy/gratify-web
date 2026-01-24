//button colors based on business status
export function getBusinessStatusBgColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-icons-color-success/35'; // 'bg-[#05b456]/35'; //'bg-[#8ec89a] '; //hover:shadow-[1px 2px 10px 2px #dcdcdc]#8ec89a bg-[#05b456]/35
    case 'hidden':
      return 'bg-background-grey-100'; //'bg-[#efefef]'; //background-grey-100 bg-[#7c7c7c]/30
    case 'rejected':
      return 'bg-icons-color-accent/50'; //'bg-[#c71143]/50'; //bg-[#c71143]/30
    case 'pending':
      return 'bg-icons-color-pending'; // dark:bg-[#3b3a2c]//#dfd077; bg-[#eae7dd]
    case 'draft':
      return 'bg-button-white';
  }
}

export function getStatusBgAddClasses(status: string) {
  switch (status) {
    case 'approved':
      return '  focus:bg-icons-color-success/50'; //hover:shadow-[1px 2px 10px 2px #dcdcdc]#8ec89a bg-[#05b456]/35
    case 'hidden':
      return 'focus:bg-background-grey-100/50'; //background-grey-100 bg-[#7c7c7c]/30
    case 'rejected':
      return 'focus:bg-icons-color-accent/80'; //bg-[#c71143]/30
    case 'pending':
      return 'focus:bg-icons-color-pending/70'; //#dfd077; bg-[#eae7dd]
    case 'draft':
      return 'focus:bg-button-white/60';
  }
}
export function getBusinessStatusCardBgColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-background-main-100'; //'bg-[#eae7dd]';
    case 'hidden':
      return 'bg-background-grey-300'; //'bg-[#bdbdbd]';
    case 'rejected':
      return 'bg-background-grey-100'; //'bg-[#dcdcdc]';
    case 'pending':
      return 'bg-icons-main-50'; //'bg-[#f5f3f0]';
    case 'draft':
      return 'bg-background-grey-50'; //'bg-[#f9f9f9]';
  }
}
