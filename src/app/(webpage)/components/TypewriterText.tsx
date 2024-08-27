"use client";

import React, { useState, useEffect } from "react";

interface TypewriterTextProps {
	options: string[];
	typingSpeed?: number;
	deletingSpeed?: number;
	pauseDuration?: number;
}

export function TypewriterText({
	options,
	typingSpeed = 100,
	deletingSpeed = 50,
	pauseDuration = 2000,
}: TypewriterTextProps) {
	const [text, setText] = useState(options[0]);
	const [isDeleting, setIsDeleting] = useState(false);
	const [optionIndex, setOptionIndex] = useState(0);
	const [isInitial, setIsInitial] = useState(true);

	useEffect(() => {
		if (isInitial) {
			const timer = setTimeout(() => {
				setIsInitial(false);
				setIsDeleting(true);
			}, pauseDuration);
			return () => clearTimeout(timer);
		}

		const currentOption = options[optionIndex];

		const timer = setTimeout(
			() => {
				if (!isDeleting && text === currentOption) {
					setTimeout(() => setIsDeleting(true), pauseDuration);
				} else if (isDeleting && text.length === 1) {
					setIsDeleting(false);
					setOptionIndex((prevIndex) => (prevIndex + 1) % options.length);
				} else {
					setText((prevText) =>
						isDeleting
							? prevText.slice(0, -1) || " " // Ensure at least a space remains
							: currentOption.slice(0, prevText.length + 1),
					);
				}
			},
			isDeleting ? deletingSpeed : typingSpeed,
		);

		return () => clearTimeout(timer);
	}, [
		text,
		isDeleting,
		optionIndex,
		options,
		typingSpeed,
		deletingSpeed,
		pauseDuration,
		isInitial,
	]);

	return text;
}
