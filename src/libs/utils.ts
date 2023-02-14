import { Utils } from "alchemy-sdk";
import { z } from "zod";

export const zHexAddress = z.string().refine(Utils.isHexString);
