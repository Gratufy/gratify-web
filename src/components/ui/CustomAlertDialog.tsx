import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import IconCross from '@/assets/icons/general/icon-16-cross.svg';
type CustomAlertDialogProps = {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  actionContent?: ReactNode;
  cancelText?: string;
  onAction?: () => void;
  actionClassName?: string; // My custom styles
  cancelClassName?: string;
  classNameTitle?: string;
  classNameDescription?: string;
  // actionHref?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CustomAlertDialog({
  trigger,
  title,
  description,

  actionContent,
  cancelText = 'Скасувати',
  onAction,
  actionClassName,
  cancelClassName,
  classNameTitle,
  classNameDescription,
  // actionHref,
  open,
  onOpenChange,
}: CustomAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogCancel className="hover:text-icons-color-accent absolute right-3 top-3 h-5 cursor-pointer border-none px-0 py-0">
          <IconCross className="size-5" />
        </AlertDialogCancel>
        <AlertDialogHeader>
          <AlertDialogTitle className={cn(classNameTitle)}>
            {title}
          </AlertDialogTitle>

          {description && (
            <AlertDialogDescription className={cn(classNameDescription)}>
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className={cn('btn-reject', cancelClassName)}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            className={cn('btn-aprove', actionClassName)}
            onClick={onAction}
          >
            {actionContent}
          </AlertDialogAction>
          {/* <AlertDialogAction asChild>
            <Link href={actionHref} className={actionClassName}>
              {actionText}
            </Link>
          </AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// to use
{
  /* <CustomAlertDialog
  trigger={<button className="text-red-600">Delete</button>}
  title="Удалить бизнес?"
  description="Это действие нельзя будет отменить."
  actionText="Удалить"
  cancelText="Отмена"
  onAction={() => deleteBusiness(id)}
  actionClassName="bg-red-600 hover:bg-red-700 text-white"
  cancelClassName="border border-gray-300"
/>; */
}
