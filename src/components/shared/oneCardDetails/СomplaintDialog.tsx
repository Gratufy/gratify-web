import React from 'react';
import IconFlag from '@/assets/icons/general/icon-flag.svg';
import IconWarning from '@/assets/icons/general/icon-Warning.svg';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function СomplaintDialog() {
  function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    console.log(e.currentTarget);
  }
  return (
    <Dialog>
      <DialogTrigger className="flex flex-1 cursor-pointer gap-3">
        <IconFlag className="size-6" aria-hidden="true" />
        <span className="placeholder-xs lg:placeholder-sm xl:placeholder-base">
          Скарга
        </span>
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-[425px]">
        <DialogHeader className="flex-row">
          <IconWarning clasName="size-6" />
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

              // placeholder="id..."

              // onChange={(e) => setResourceId(e.target.value)}
            />
          </div>
        </form>
        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <button className="btn-reject">Cancel</button>
          </DialogClose>
          <button type="submit" className="btn-aprove" onClick={handleSubmit}>
            Подати
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default СomplaintDialog;
