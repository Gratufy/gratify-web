import { useState, useTransition } from 'react';
import IconFlag from '@/assets/icons/general/icon-flag.svg';
import IconWarning from '@/assets/icons/general/icon-Warning.svg';
import {
  Dialog,
  // DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { sendComplaint } from '@/lib/actions/sendComplaint';

interface ComplainDialogProps {
  businessId: string;
  businessName: string;
}

function ComplaintDialog({ businessId, businessName }: ComplainDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [complaintText, setComplaintText] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await sendComplaint({
          businessName: businessName,
          businessId: businessId,
          complaintText,
          // honeypot: '', // Add honeypot field if needed for spam prevention
        });

        CustomToast({
          type: 'success',
          content: (
            <>
              <p className="font-semibold">Скарга відправлена</p>
            </>
          ),
        });

        setComplaintText('');
        // formRef.current?.reset();
        setOpen(false);
      } catch (error) {
        CustomToast({
          type: 'error',
          content: (
            <>
              <p className="font-semibold">Помилка при відправці скарги</p>
              <p className="text-sm">{(error as Error).message}</p>
            </>
          ),
        });
      }
    });
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger className="flex flex-1 cursor-pointer gap-3">
        <IconFlag className="size-4 lg:size-6" aria-hidden="true" />
        <span className="placeholder-xs lg:placeholder-sm xl:placeholder-base">
          Скарга
        </span>
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-[425px]">
        <DialogHeader className="flex-row">
          <IconWarning className="size-4 shrink-0 lg:size-6" />
          <DialogTitle>Дані не співпадають з дійсністю</DialogTitle>
          <DialogDescription className="sr-only">
            Подати скаргу
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="mb-3 grid gap-3">
            <Label
              htmlFor="id-complaint "
              className="placeholder-xs lg:placeholder-sm xl:placeholder-base"
            >
              Опишіть причину скарги
            </Label>
            <Textarea
              id="id-complaint"
              name="id-complaint"
              onChange={(e) => setComplaintText(e.target.value)}
              required
              minLength={10}
              disabled={isPending}
            />
          </div>
          <DialogFooter className="pt-2">
            {/* <DialogClose asChild> */}
            <button
              className="btn-reject"
              onClick={() => {
                setComplaintText('');
                //   formRef.current?.reset();
                setOpen(false);
              }}
            >
              Cancel
            </button>
            {/* </DialogClose> */}
            <button
              type="submit"
              className="btn-aprove"
              disabled={complaintText.trim().length <= 10 || isPending}
              onClick={handleSubmit}
            >
              Подати
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ComplaintDialog;
