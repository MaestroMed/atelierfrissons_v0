-- ═══════════════════════════════════════════════════════════════════════════
-- Atelier Frisson — Row Level Security policies
--   Migration SQL à appliquer APRÈS `pnpm db:push` (qui crée les 19 tables).
--   Appliquer via : Supabase Dashboard → SQL Editor (RUN) ou `psql -f`.
--   Source de vérité : CLAUDE.md §5.1 + §8 (4 couches sécurité).
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Sequence pour AF-YYYY-NNNNNN (numéros de commande atomiques) ────────────
CREATE SEQUENCE IF NOT EXISTS af_order_number_seq
  START WITH 1
  INCREMENT BY 1
  MINVALUE 1
  NO MAXVALUE
  CACHE 1;

-- ═══════════════════════════════════════════════════════════════════════════
-- ÉTAPE 1 : activer RLS sur toutes les tables
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE customers              ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses              ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories             ENABLE ROW LEVEL SECURITY;
ALTER TABLE products               ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants       ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items             ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items            ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews                ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE forge_pages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects              ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log              ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices               ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════
-- ÉTAPE 2 : helper — `is_admin()` renvoie true si auth.uid() est dans admin_users.is_active
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid() AND is_active = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_with_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
      AND is_active = TRUE
      AND role = required_role
  );
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- ÉTAPE 3 : policies par table
-- ═══════════════════════════════════════════════════════════════════════════

-- ── CUSTOMERS ───────────────────────────────────────────────────────────────
CREATE POLICY customers_read_own   ON customers FOR SELECT USING (auth.uid() = id AND deleted_at IS NULL);
CREATE POLICY customers_update_own ON customers FOR UPDATE USING (auth.uid() = id AND deleted_at IS NULL);
CREATE POLICY customers_read_admin ON customers FOR SELECT USING (public.is_admin());
CREATE POLICY customers_write_admin ON customers FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── ADDRESSES ──────────────────────────────────────────────────────────────
CREATE POLICY addresses_read_own    ON addresses FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY addresses_write_own   ON addresses FOR ALL    USING (auth.uid() = customer_id) WITH CHECK (auth.uid() = customer_id);
CREATE POLICY addresses_admin       ON addresses FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── CATEGORIES ──────────────────────────────────────────────────────────────
CREATE POLICY categories_read_public ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY categories_write_admin ON categories FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── PRODUCTS ────────────────────────────────────────────────────────────────
CREATE POLICY products_read_public ON products FOR SELECT USING (status = 'active');
CREATE POLICY products_read_admin  ON products FOR SELECT USING (public.is_admin());
CREATE POLICY products_write_admin ON products FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── PRODUCT VARIANTS ────────────────────────────────────────────────────────
CREATE POLICY variants_read_public ON product_variants FOR SELECT USING (
  is_active = TRUE
  AND EXISTS (SELECT 1 FROM products WHERE products.id = product_id AND products.status = 'active')
);
CREATE POLICY variants_admin ON product_variants FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── CARTS ──────────────────────────────────────────────────────────────────
-- Invités : lecture/écriture via session_id (matché côté applicatif, pas par RLS).
-- Connectés : lecture/écriture de leur propre cart.
CREATE POLICY carts_read_own  ON carts FOR SELECT USING (auth.uid() = customer_id OR auth.uid() IS NULL);
CREATE POLICY carts_write_own ON carts FOR ALL    USING (auth.uid() = customer_id OR auth.uid() IS NULL) WITH CHECK (auth.uid() = customer_id OR auth.uid() IS NULL);
CREATE POLICY carts_admin     ON carts FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── CART ITEMS ──────────────────────────────────────────────────────────────
CREATE POLICY cart_items_read ON cart_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_id AND (carts.customer_id = auth.uid() OR auth.uid() IS NULL))
);
CREATE POLICY cart_items_write ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_id AND (carts.customer_id = auth.uid() OR auth.uid() IS NULL))
) WITH CHECK (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_id AND (carts.customer_id = auth.uid() OR auth.uid() IS NULL))
);
CREATE POLICY cart_items_admin ON cart_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── ORDERS ──────────────────────────────────────────────────────────────────
CREATE POLICY orders_read_own   ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY orders_read_admin ON orders FOR SELECT USING (public.is_admin());
CREATE POLICY orders_write_admin ON orders FOR ALL   USING (public.is_admin()) WITH CHECK (public.is_admin());
-- Pas de policy INSERT pour les clients : les commandes sont créées
-- exclusivement via Server Action avec le service role (checkout).

-- ── ORDER ITEMS ─────────────────────────────────────────────────────────────
CREATE POLICY order_items_read_own ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.customer_id = auth.uid())
);
CREATE POLICY order_items_admin ON order_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── PROMOTIONS ──────────────────────────────────────────────────────────────
CREATE POLICY promotions_read_public ON promotions FOR SELECT USING (
  is_active = TRUE
  AND (starts_at IS NULL OR starts_at <= NOW())
  AND (ends_at IS NULL OR ends_at >= NOW())
);
CREATE POLICY promotions_admin ON promotions FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── REVIEWS ─────────────────────────────────────────────────────────────────
CREATE POLICY reviews_read_approved ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY reviews_insert_authenticated ON reviews FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND auth.uid() = customer_id
);
CREATE POLICY reviews_read_own ON reviews FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY reviews_admin ON reviews FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── ARTICLES ────────────────────────────────────────────────────────────────
CREATE POLICY articles_read_public ON articles FOR SELECT USING (status = 'published');
CREATE POLICY articles_admin ON articles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── FORGE PAGES ─────────────────────────────────────────────────────────────
CREATE POLICY forge_read_published ON forge_pages FOR SELECT USING (status = 'published');
CREATE POLICY forge_admin ON forge_pages FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── REDIRECTS ───────────────────────────────────────────────────────────────
CREATE POLICY redirects_read_public ON redirects FOR SELECT USING (is_active = TRUE);
CREATE POLICY redirects_admin ON redirects FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── MARKETING EVENTS (append-only pour clients, lecture admin) ──────────────
CREATE POLICY events_insert_any ON marketing_events FOR INSERT WITH CHECK (TRUE);
CREATE POLICY events_read_own ON marketing_events FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY events_admin ON marketing_events FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── ADMIN USERS (lecture : admins eux-mêmes / owner voit tout) ──────────────
CREATE POLICY admin_users_self ON admin_users FOR SELECT USING (id = auth.uid());
CREATE POLICY admin_users_owner ON admin_users FOR ALL USING (public.is_admin_with_role('owner')) WITH CHECK (public.is_admin_with_role('owner'));

-- ── AUDIT LOG (append-only pour tous, lecture owner uniquement) ─────────────
CREATE POLICY audit_insert_any ON audit_log FOR INSERT WITH CHECK (TRUE);
CREATE POLICY audit_read_owner ON audit_log FOR SELECT USING (public.is_admin_with_role('owner'));

-- ── INVOICES (lecture client + admin) ───────────────────────────────────────
CREATE POLICY invoices_read_own ON invoices FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.customer_id = auth.uid())
);
CREATE POLICY invoices_admin ON invoices FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── NEWSLETTER SUBSCRIBERS ──────────────────────────────────────────────────
CREATE POLICY newsletter_insert_any ON newsletter_subscribers FOR INSERT WITH CHECK (TRUE);
-- Désabonnement via token signé (hors RLS, via service role côté /api).
CREATE POLICY newsletter_admin ON newsletter_subscribers FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ═══════════════════════════════════════════════════════════════════════════
-- ÉTAPE 4 : triggers updated_at (cohérence timestamp)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Appliquer aux tables qui ont `updated_at`
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'customers', 'products', 'carts', 'orders', 'articles', 'forge_pages'
  ])
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_%I_updated_at ON %I; ' ||
      'CREATE TRIGGER set_%I_updated_at BEFORE UPDATE ON %I ' ||
      'FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- FIN — vérifiez que toutes les policies sont actives :
--   SELECT schemaname, tablename, rowsecurity FROM pg_tables
--   WHERE schemaname = 'public' ORDER BY tablename;
-- ═══════════════════════════════════════════════════════════════════════════
