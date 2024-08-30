import { z } from "zod";

export const tagsSchema = z.array(z.string()).nullable();
