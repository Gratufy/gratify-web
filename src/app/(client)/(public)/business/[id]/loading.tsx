export default function LoadingBusinessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 pt-10 lg:pt-14">
      <div className="w-full max-w-xl animate-pulse space-y-4">
        <div className="dark:bg-background-main-100 bg-background-grey-100 h-8 w-2/3 rounded" />
        <div className="dark:bg-background-main-100 bg-background-grey-100 h-6 w-1/2 rounded" />
        <div className="dark:bg-background-main-50 bg-background-grey-100/50 h-6 w-3/4 rounded" />
        <div className="dark:bg-background-main-50 bg-background-grey-100/50 h-40 w-full rounded" />
      </div>
    </div>
    // <div className="flex min-h-screen w-full flex-col items-center justify-center">
    //   <div className="text-center">
    //     <p className="mb-4 text-2xl font-semibold">
    //       Loading business details...
    //     </p>
    //     <div className="border-t-primary h-10 w-10 animate-spin rounded-full border-4 border-green-500" />
    //   </div>
    // </div>
  );
}
