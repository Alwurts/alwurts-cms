import type { InferInsertModel } from "drizzle-orm";
import type { InferQueryModel } from "./inferDatabase";
import type { files } from "@/database/schema";

export type TFile = InferQueryModel<"files">;

export type TCreateFile = InferInsertModel<typeof files>;
