import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		excerpt: z.string(),
		platforms: z
			.array(
				z.object({
					name: z.enum(['dev.to', 'medium']),
					url: z.string().url(),
					language: z.enum(['pt-BR', 'en-US']),
				}),
			)
			.min(1),
	}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		number: z.string(),
		title: z.string(),
		description: z.string(),
		technologies: z.array(z.string()),
		repoUrl: z.string().url(),
		liveUrl: z.string().url().optional(),
		previewImg: z.string().optional(),
		featured: z.boolean().default(false),
	}),
});

const experience = defineCollection({
	loader: glob({ base: './src/content/experience', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		company: z.string(),
		role: z.string(),
		roleLevel: z.string(),
		startDate: z.string(),
		endDate: z.union([z.string(), z.literal('current')]),
		technologies: z.array(z.string()).optional(),
		location: z.string().optional(),
	}),
});

export const collections = { blog, projects, experience };
