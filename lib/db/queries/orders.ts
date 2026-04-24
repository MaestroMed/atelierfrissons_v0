import 'server-only';
import { cache } from 'react';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../index';
import { orders, orderItems } from '../schema';
import type { Order, OrderItem } from '../schema';

/**
 * Queries commandes — lecture en Server Component et actions serveur.
 *
 * Génération du numéro de commande : `AF-YYYY-NNNNNN` où NNNNNN est un
 * compteur par année. Atomique via `nextval()` sur une sequence dédiée
 * (créée dans la migration RLS — voir supabase/migrations/).
 */

export type OrderWithItems = Order & { items: OrderItem[] };

export const getOrderById = cache(async (id: string): Promise<OrderWithItems | null> => {
  const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  const order = rows[0];
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { ...order, items };
});

export const getOrderByNumber = cache(
  async (orderNumber: string): Promise<OrderWithItems | null> => {
    const rows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
    const order = rows[0];
    if (!order) return null;
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    return { ...order, items };
  },
);

export const getOrdersByCustomer = cache(
  async (customerId: string, limit = 50): Promise<Order[]> => {
    return db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId))
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  },
);

/**
 * Génère le prochain numéro de commande (AF-YYYY-NNNNNN).
 *
 * Utilise une sequence SQL côté Postgres pour garantir l'atomicité en cas
 * de plusieurs instances Vercel traitant des checkout simultanés.
 * Sprint 3 : remplacer par une RPC Supabase nextval() pour éviter la race.
 */
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getUTCFullYear();
  const [row] = await db.execute<{ next_val: string }>(
    sql`SELECT to_char(nextval('af_order_number_seq'::regclass), 'FM000000') AS next_val`,
  );
  const nextVal = row?.next_val ?? '000001';
  return `AF-${year}-${nextVal}`;
}
