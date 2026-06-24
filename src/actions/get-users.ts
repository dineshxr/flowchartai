'use server';

import { getDb } from '@/db';
import { COLLECTIONS, type UserDoc, tsToDate } from '@/db/schema';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

// Define the schema for getUsers parameters
const getUsersSchema = z.object({
  pageIndex: z.number().min(0).default(0),
  pageSize: z.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  sorting: z
    .array(
      z.object({
        id: z.string(),
        desc: z.boolean(),
      })
    )
    .optional()
    .default([]),
});

// Define sort field mapping (keys of UserDoc that are sortable)
const sortFieldMap = {
  name: 'name',
  email: 'email',
  createdAt: 'createdAt',
  role: 'role',
  banned: 'banned',
  customerId: 'customerId',
  banReason: 'banReason',
  banExpires: 'banExpires',
} as const;

type SortField = keyof typeof sortFieldMap;

// Create a safe action for getting users
export const getUsersAction = actionClient
  .schema(getUsersSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { pageIndex, pageSize, search, sorting } = parsedInput;

      const db = await getDb();

      // Firestore can't do ILIKE/offset/orderBy-by-arbitrary-field cheaply, so
      // fetch all users (capped) and do filtering/sorting/pagination in memory.
      const snapshot = await db.collection(COLLECTIONS.user).limit(2000).get();

      let users: UserDoc[] = snapshot.docs.map((doc) => {
        const data = doc.data() as UserDoc;
        return {
          ...data,
          id: doc.id,
          createdAt: tsToDate(data.createdAt),
          updatedAt: tsToDate(data.updatedAt),
          banExpires: tsToDate(data.banExpires),
        };
      });

      // Filter by search (case-insensitive substring on name OR email)
      if (search) {
        const needle = search.toLowerCase();
        users = users.filter((u) => {
          const name = (u.name ?? '').toLowerCase();
          const email = (u.email ?? '').toLowerCase();
          return name.includes(needle) || email.includes(needle);
        });
      }

      // Determine sort field/direction (default createdAt desc)
      const sortConfig = sorting[0];
      const sortKey: SortField =
        sortConfig?.id && sortConfig.id in sortFieldMap
          ? (sortConfig.id as SortField)
          : 'createdAt';
      const sortDesc = sortConfig ? sortConfig.desc : true;

      const compare = (a: UserDoc, b: UserDoc): number => {
        const av = a[sortKey];
        const bv = b[sortKey];

        // Handle null/undefined consistently (nulls sort last in ascending)
        const aNil = av === null || av === undefined;
        const bNil = bv === null || bv === undefined;
        if (aNil && bNil) return 0;
        if (aNil) return 1;
        if (bNil) return -1;

        let result = 0;
        if (av instanceof Date && bv instanceof Date) {
          result = av.getTime() - bv.getTime();
        } else if (typeof av === 'boolean' && typeof bv === 'boolean') {
          result = av === bv ? 0 : av ? 1 : -1;
        } else if (typeof av === 'number' && typeof bv === 'number') {
          result = av - bv;
        } else {
          result = String(av).localeCompare(String(bv));
        }
        return result;
      };

      users.sort((a, b) => {
        const result = compare(a, b);
        return sortDesc ? -result : result;
      });

      // total is the filtered length (before slice)
      const total = users.length;

      // Paginate
      const offset = pageIndex * pageSize;
      let items = users.slice(offset, offset + pageSize);

      // hide user data in demo website
      if (process.env.NEXT_PUBLIC_DEMO_WEBSITE === 'true') {
        items = items.map((item) => ({
          ...item,
          name: 'Demo User',
          email: 'example@mksaas.com',
          customerId: 'cus_abcdef123456',
        }));
      }

      return {
        success: true,
        data: {
          items,
          total,
        },
      };
    } catch (error) {
      console.error('get users error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      };
    }
  });
