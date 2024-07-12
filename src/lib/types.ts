import { type ReactNode, isValidElement } from "react";

export function isReactNode(content: unknown): content is ReactNode {
	return isValidElement(content);
}
