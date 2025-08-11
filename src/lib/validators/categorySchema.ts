import * as v from "valibot";

export const categorySchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Введіть назву категорії")),
});
