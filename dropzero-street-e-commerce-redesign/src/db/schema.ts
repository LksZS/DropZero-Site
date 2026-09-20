import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "payment_pending",
  "paid",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "approved",
  "declined",
  "refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "pix",
  "card",
  "boleto",
]);

export const movementTypeEnum = pgEnum("inventory_movement_type", [
  "in",
  "out",
  "adjustment",
  "reserved",
  "released",
]);

export const couponTypeEnum = pgEnum("coupon_type", ["percent", "fixed"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  role: text("role").default("customer").notNull(),
  ...timestamps,
}, (table) => [uniqueIndex("users_email_idx").on(table.email)]);

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
}, (table) => [uniqueIndex("categories_slug_idx").on(table.slug)]);

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  code: text("code").notNull(),
  campaign: text("campaign"),
  launchAt: timestamp("launch_at", { withTimezone: true }),
  imageUrl: text("image_url"),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
}, (table) => [uniqueIndex("collections_slug_idx").on(table.slug)]);

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  sku: text("sku").notNull(),
  description: text("description").notNull(),
  composition: text("composition"),
  measurements: text("measurements"),
  priceCents: integer("price_cents").notNull(),
  salePriceCents: integer("sale_price_cents"),
  costCents: integer("cost_cents"),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  collectionId: uuid("collection_id").references(() => collections.id, { onDelete: "set null" }),
  tags: text("tags").array().default([]).notNull(),
  images: jsonb("images").$type<string[]>().default([]).notNull(),
  featured: boolean("featured").default(false).notNull(),
  limited: boolean("limited").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
}, (table) => [
  uniqueIndex("products_slug_idx").on(table.slug),
  uniqueIndex("products_sku_idx").on(table.sku),
]);

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  sku: text("sku").notNull(),
  size: text("size").notNull(),
  color: text("color").notNull(),
  priceCents: integer("price_cents"),
  imageUrl: text("image_url"),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
}, (table) => [uniqueIndex("variants_sku_idx").on(table.sku)]);

export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }).notNull(),
  quantity: integer("quantity").default(0).notNull(),
  reserved: integer("reserved").default(0).notNull(),
  lowStockThreshold: integer("low_stock_threshold").default(5).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("inventory_variant_idx").on(table.variantId)]);

export const inventoryMovements = pgTable("inventory_movements", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }).notNull(),
  type: movementTypeEnum("type").notNull(),
  quantity: integer("quantity").notNull(),
  reason: text("reason").notNull(),
  reference: text("reference"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  label: text("label").default("Principal").notNull(),
  recipient: text("recipient").notNull(),
  postalCode: text("postal_code").notNull(),
  street: text("street").notNull(),
  number: text("number").notNull(),
  complement: text("complement"),
  district: text("district").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  ...timestamps,
});

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull(),
  type: couponTypeEnum("type").notNull(),
  value: integer("value").notNull(),
  minValueCents: integer("min_value_cents").default(0).notNull(),
  usageLimit: integer("usage_limit"),
  startsAt: timestamp("starts_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  freeShipping: boolean("free_shipping").default(false).notNull(),
  productIds: uuid("product_ids").array().default([]).notNull(),
  categoryIds: uuid("category_ids").array().default([]).notNull(),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
}, (table) => [uniqueIndex("coupons_code_idx").on(table.code)]);

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  number: text("number").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerDocument: text("customer_document"),
  status: orderStatusEnum("status").default("payment_pending").notNull(),
  subtotalCents: integer("subtotal_cents").notNull(),
  discountCents: integer("discount_cents").default(0).notNull(),
  shippingCents: integer("shipping_cents").default(0).notNull(),
  totalCents: integer("total_cents").notNull(),
  couponId: uuid("coupon_id").references(() => coupons.id, { onDelete: "set null" }),
  shippingAddress: jsonb("shipping_address").$type<Record<string, string>>().notNull(),
  trackingCode: text("tracking_code"),
  notes: text("notes"),
  ...timestamps,
}, (table) => [uniqueIndex("orders_number_idx").on(table.number)]);

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  sku: text("sku").notNull(),
  size: text("size").notNull(),
  color: text("color").notNull(),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  gateway: text("gateway").notNull(),
  gatewayPaymentId: text("gateway_payment_id"),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  amountCents: integer("amount_cents").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().default({}).notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  ...timestamps,
});

export const couponUsage = pgTable("coupon_usage", {
  couponId: uuid("coupon_id").references(() => coupons.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [primaryKey({ columns: [table.couponId, table.orderId] })]);

export const favorites = pgTable("favorites", {
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.productId] })]);

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  rating: integer("rating").notNull(),
  title: text("title"),
  body: text("body").notNull(),
  approved: boolean("approved").default(false).notNull(),
  ...timestamps,
}, (table) => [uniqueIndex("reviews_user_product_idx").on(table.userId, table.productId)]);

export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
