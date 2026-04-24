import 'server-only';
import { cache } from 'react';
import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../index';
import { customers, addresses } from '../schema';
import type { Customer, Address } from '../schema';

/**
 * Queries clients — respect RGPD : `deletedAt` filtre toujours les comptes
 * soft-deleted des lectures publiques.
 */

export type CustomerWithAddresses = Customer & { addresses: Address[] };

export const getCustomerById = cache(async (id: string): Promise<Customer | null> => {
  const rows = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), isNull(customers.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
});

export const getCustomerByEmail = cache(async (email: string): Promise<Customer | null> => {
  const rows = await db
    .select()
    .from(customers)
    .where(and(eq(customers.email, email.toLowerCase()), isNull(customers.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
});

export const getCustomerWithAddresses = cache(
  async (id: string): Promise<CustomerWithAddresses | null> => {
    const customer = await getCustomerById(id);
    if (!customer) return null;
    const addrs = await db
      .select()
      .from(addresses)
      .where(eq(addresses.customerId, id))
      .orderBy(addresses.isDefault);
    return { ...customer, addresses: addrs };
  },
);
