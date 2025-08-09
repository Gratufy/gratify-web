

ALTER TABLE "businesses" DROP CONSTRAINT "businesses_category_id_business_categories_category_id_fk";

ALTER TABLE "businesses"
ADD CONSTRAINT "businesses_category_id_business_categories_category_id_fk"
FOREIGN KEY ("category_id")
REFERENCES "business_categories" ("category_id")
ON DELETE SET DEFAULT;

--Function to prevent deletion of category "Інше"
CREATE OR REPLACE FUNCTION prevent_delete_inche()
RETURNS trigger AS $$
BEGIN
  IF OLD.category_id = '11111111-1111-1111-1111-111111111111' THEN
    RAISE EXCEPTION 'Cannot delete category Інше';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER trg_prevent_delete_inche
BEFORE DELETE ON "business_categories"
FOR EACH ROW
EXECUTE FUNCTION prevent_delete_inche();