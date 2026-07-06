import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		excerpt: z.string(),
		platforms: z.array(
			z.object({
				name: z.enum(['dev.to', 'medium']),
				url: z.string().url(),
				language: z.enum(['pt-BR', 'en-US']),
			}),
		),
	}),
});

const projects = defineCollection({
	type: 'content',
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
	type: 'content',
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
