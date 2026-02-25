import { useState, useTransition } from 'react';

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

import { connectWithAdmin } from '@/lib/actions/message/connectWithAdmin';
import { Input } from '../ui/input';

interface ConnectWithAdminProps {
  userId: string;
}

function ConnectWithAdmin({ userId }: ConnectWithAdminProps) {
  const [open, setOpen] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const text = formData.get('description') as string;
    if (!text || text.trim().length < 10) {
      form.reportValidity();
      return;
    }
    startTransition(async () => {
      try {
        await connectWithAdmin({
          userId,
          text,
          // honeypot: '', // Add honeypot field if needed for spam prevention
        });

        CustomToast({
          type: 'success',
          content: (
            <>
              <p className="font-semibold">Повідомлення відправлено</p>
            </>
          ),
        });

        form.reset();
        // formRef.current?.reset();
        setOpen(false);
      } catch (error) {
        CustomToast({
          type: 'error',
          content: (
            <>
              <p className="font-semibold">
                Помилка при відправці повідомлення
              </p>
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
      <DialogTrigger className="btn-reject placeholder-xs lg:placeholder-sm xl:placeholder-base">
        Зв&rsquo;язатись з адміном
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-[425px]">
        <DialogHeader className="flex-row">
          <IconWarning className="size-4 shrink-0 lg:size-6" />
          <DialogTitle>Зв&rsquo;язатись з адміном</DialogTitle>
          <DialogDescription className="sr-only">
            Зв&rsquo;язатись з адміном
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 grid gap-3">
            <Label
              htmlFor="id-connect-admin-deskription"
              className="placeholder-xs lg:placeholder-sm xl:placeholder-base"
            >
              Опишіть причину зв&rsquo;язку з адміном
            </Label>
            <Textarea
              id="id-connect-admin-deskription"
              name="description"
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
                setOpen(false);
              }}
            >
              Cancel
            </button>
            {/* </DialogClose> */}
            <button type="submit" className="btn-aprove" disabled={isPending}>
              Подати
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ConnectWithAdmin;
