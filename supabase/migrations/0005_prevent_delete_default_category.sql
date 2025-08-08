CREATE OR REPLACE FUNCTION prevent_delete_default_category() RETURNS TRIGGER AS $$
BEGIN
  IF OLD.category_id = '11111111-1111-1111-1111-111111111111' THEN
    RAISE EXCEPTION 'Not possible to delete category "Інше"';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_delete_default_category
BEFORE DELETE ON business_categories
FOR EACH ROW
EXECUTE FUNCTION prevent_delete_default_category();