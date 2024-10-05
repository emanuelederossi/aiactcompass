// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { desc, sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `compass_${name}`);

export const domanda = createTable(
  "domanda",
  {
    id: serial("id").primaryKey(),
    index: integer("index").notNull(),
    toolName: varchar("tool_name", { length: 256 }).notNull(),
    question: varchar("question", { length: 4096 }).notNull(),
    dependencies: jsonb("dependencies").notNull(),
    options: jsonb("options").notNull(),
    describe: varchar("describe", { length: 4096 }).notNull(),
  },
  (domanda) => ({
    toolNameIndex: index("tool_name_idx").on(domanda.toolName),
  })
);

export const categoria = createTable(
  "categoria",
  {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 256 }).notNull(),
    options: jsonb("options").notNull(),
  },
  (categoria) => ({
    nomeIndex: index("nome_idx").on(categoria.nome),
  })
);

export const output = createTable(
  "output",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    content: varchar("content", { length: 8192 }).notNull(),
    categories: jsonb("categories").notNull(),
  }
);